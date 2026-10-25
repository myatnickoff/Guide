create table if not exists public.guide_feedback (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 10 and 3000),
  source text not null default 'phuket-guide',
  created_at timestamptz not null default now()
);

alter table public.guide_feedback enable row level security;
revoke all on public.guide_feedback from anon, authenticated;
grant insert on public.guide_feedback to service_role;