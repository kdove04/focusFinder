-- Per-user study preferences (one row per app user; created on first save)

create table if not exists public.user_study_preferences (
  user_id uuid primary key references public.app_users (id) on delete cascade,
  preferred_noise text not null default 'quiet' check (preferred_noise in ('quiet', 'moderate', 'loud')),
  preferred_busyness text not null default 'low' check (preferred_busyness in ('low', 'medium', 'high')),
  study_style text not null default 'either' check (study_style in ('solo', 'group', 'either')),
  updated_at timestamptz not null default now()
);

alter table public.user_study_preferences enable row level security;
