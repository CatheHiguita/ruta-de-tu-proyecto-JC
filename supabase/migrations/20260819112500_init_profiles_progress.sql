-- Multi-user progress tracking for "Ruta de tu Proyecto".
-- Students own their progress rows; admins get read-only visibility across the cohort.
-- Every table here is protected by row level security: the frontend ships a public
-- anon key, so RLS is the only boundary between one student's data and another's.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  track      text not null default 'basico' check (track in ('basico', 'avanzado')),
  role       text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- checkpoint_id is a free-form text key matching the CHECKPOINTS array in the
-- frontend. Checkpoint definitions stay in code on purpose: they are content,
-- not data, and storing them here would require a CMS nobody asked for.
create table if not exists public.progress (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  checkpoint_id text not null,
  status        text not null default 'pending'
                check (status in ('pending', 'showingSteps', 'showingMentor', 'done')),
  updated_at    timestamptz not null default now(),
  primary key (user_id, checkpoint_id)
);

-- Supports the admin dashboard's "who is stuck" query.
create index if not exists progress_status_idx on public.progress (status);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- security definer is required: a policy on profiles that reads profiles would
-- recurse infinitely under RLS. Running as the definer bypasses RLS for this
-- lookup only. search_path is pinned so the function cannot be hijacked.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists progress_touch_updated_at on public.progress;
create trigger progress_touch_updated_at
  before update on public.progress
  for each row execute function public.touch_updated_at();

-- Creates the profile row on signup. Runs as definer so it can insert while the
-- table has no INSERT policy at all -- which is deliberate: clients must never
-- be able to forge profile rows.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

revoke all on public.profiles from anon;
revoke all on public.progress from anon;

grant select on public.profiles to authenticated;

-- Column-level write control. A plain table-level UPDATE grant would cover every
-- column, letting a student set role = 'admin' from the browser console. Revoking
-- the table grant and re-granting only the safe columns closes that path at the
-- privilege layer, independently of RLS.
revoke update on public.profiles from authenticated;
grant update (full_name, track) on public.profiles to authenticated;

grant select, insert, update, delete on public.progress to authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.progress enable row level security;

-- auth.uid() is wrapped in a subselect so Postgres evaluates it once per query
-- instead of once per row.

create policy "profiles_select_own_or_admin"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "progress_select_own_or_admin"
  on public.progress for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

create policy "progress_insert_own"
  on public.progress for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "progress_update_own"
  on public.progress for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "progress_delete_own"
  on public.progress for delete to authenticated
  using (user_id = (select auth.uid()));

-- No INSERT or DELETE policy on profiles: rows are created by the signup trigger
-- and removed by the cascade from auth.users. RLS denies by default.

-- ---------------------------------------------------------------------------
-- Admin dashboard view
-- ---------------------------------------------------------------------------

-- security_invoker is mandatory. Views default to running as their owner, which
-- would silently bypass RLS and expose every student's row to any caller.
create or replace view public.progress_summary
with (security_invoker = on) as
select
  p.id                                                              as user_id,
  p.email,
  p.full_name,
  p.track,
  count(pr.checkpoint_id) filter (where pr.status = 'done')          as completed,
  count(pr.checkpoint_id) filter (where pr.status = 'showingMentor') as stuck,
  max(pr.updated_at)                                                 as last_activity
from public.profiles p
left join public.progress pr on pr.user_id = p.id
where p.role = 'student'
group by p.id, p.email, p.full_name, p.track;

grant select on public.progress_summary to authenticated;
