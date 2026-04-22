-- App tables for Focus Finder (separate from auth.users)
-- Run via Supabase SQL Editor or: supabase db push

create table if not exists public.app_users (
  id uuid primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- If an older "reviews" table exists without location_id, IF NOT EXISTS would skip
-- CREATE TABLE and the index below would fail. Drop a mismatched table (data loss for that table only).
do $migration$
begin
  if to_regclass('public.reviews') is not null then
    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'reviews'
        and column_name = 'location_id'
    ) then
      raise notice 'Dropping public.reviews: schema does not match Focus Finder; recreating.';
      drop table public.reviews cascade;
    end if;
  end if;
end
$migration$;

create table if not exists public.reviews (
  id text primary key,
  location_id text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  noise_reported text not null,
  comment text not null default '',
  created_at timestamptz not null default now(),
  submitted_by_email text
);

create table if not exists public.custom_locations (
  id text primary key,
  name text not null,
  building text not null,
  floor text not null,
  description text not null,
  amenities text[] not null default '{}',
  typical_capacity int not null,
  baseline_noise int not null,
  baseline_busyness int not null
);

create index if not exists reviews_location_id_idx on public.reviews (location_id);
create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

alter table public.app_users enable row level security;
alter table public.reviews enable row level security;
alter table public.custom_locations enable row level security;
-- No policies: only the service role (used in Next.js server code) can access by default.
-- The anon key cannot read or write these tables.
