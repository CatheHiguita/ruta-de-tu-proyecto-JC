// Supabase connection settings.
//
// These two values are PUBLIC by design and are meant to ship in the browser.
// The anon key grants no privileges on its own: every table is protected by
// row level security, so a user can only ever reach their own rows.
// Never put the service_role key here -- that one bypasses RLS entirely.
//
// Find both values in your Supabase dashboard under Project Settings > API.
window.SUPABASE_CONFIG = {
  url: 'https://qreuytxqgvmlvdhjkivq.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZXV5dHhxZ3ZtbHZkaGpraXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNDc3NzYsImV4cCI6MjEwMjcyMzc3Nn0.za5LHL8i3a2OdGL_4e2HneYAt7bD6vg_542u23lbA7U',
};
