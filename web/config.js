// Supabase connection settings.
//
// These two values are PUBLIC by design and are meant to ship in the browser.
// The anon key grants no privileges on its own: every table is protected by
// row level security, so a user can only ever reach their own rows.
// Never put the service_role key here -- that one bypasses RLS entirely.
//
// Find both values in your Supabase dashboard under Project Settings > API.
window.SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT-REF.supabase.co',
  anonKey: 'YOUR-ANON-KEY',
};
