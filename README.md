# Focus Finder

Focus Finder is a web application for **Jackson State University** students to discover study-friendly spots on campus. It combines **live-style busyness and noise indicators** (demo simulation, ready to swap for real feeds), **on-device microphone analysis** for a focus suitability score, and **student reviews** backed by a database.

**Imagery:** The header wordmark and home page photos are sourced from [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Jackson_State_University) and official JSU site assets in `lib/brandAssets.ts` and `public/`. The site footer credits photographers and licenses. For **official** JSU marks, follow [University Communications](https://www.jsums.edu/universitycommunications/) guidance.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Supabase](https://supabase.com/) (Postgres) for users, reviews, and custom study locations
- [jose](https://github.com/panva/jose) + httpOnly cookies for sessions; [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashes

## Environment variables

Create **`.env.local`** in the project root (or set the same in your host, e.g. Render). Do not commit real secrets.

| Variable | Where to get it | Required |
|----------|------------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → **service_role** (secret) | Yes (server only) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page → anon public (optional; reserved for client-side Supabase later) | No |
| `AUTH_SECRET` | Long random string (e.g. `openssl rand -base64 32`) | **Required in production**; dev falls back to a default |

The app uses the **service role** key only in server code (`lib/supabase/server.ts` and API routes) so the Next.js API can read/write your tables. The anon key alone is not sufficient for that pattern.

## Database

1. In Supabase, open **SQL** → **New query**.
2. Paste and run the contents of [`supabase/migrations/20260120120000_init.sql`](supabase/migrations/20260120120000_init.sql).

That creates `app_users`, `reviews`, and `custom_locations` with RLS enabled (access from this app is via the service role in server code).

For the **You** profile page (saved study preferences), also run
[`supabase/migrations/20260122100000_user_preferences.sql`](supabase/migrations/20260122100000_user_preferences.sql), which creates `user_study_preferences` (one row per user after first save).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Restart the dev server after changing `.env.local`.

## Health check

- `GET /api/health` — returns `{ ok: true, supabase: "ok" }` when env is set and Supabase responds. Use for uptime checks (e.g. Render). Returns `503` with a `reason` code if env is missing or the database query fails. No secrets in the response.

## Project layout

| Area | Purpose |
|------|---------|
| `app/locations` | Study spots list with polling live metrics |
| `app/locations/[id]` | Detail, reviews, submit feedback |
| `app/noise` | Browser-based noise / stability analysis |
| `app/contribute` | Global feedback form |
| `app/api/locations` | GET merged list; POST adds a spot (stored in Supabase `custom_locations`) |
| `app/api/reviews` | GET/POST reviews (Supabase `reviews`) |
| `app/api/auth/*` | Register, login, session, logout |
| `app/user` | Sign-in only: study preferences, your reviews, recommended spots |
| `app/api/user/preferences` | GET/PUT saved preferences (server session) |
| `lib/locations.ts` | Default study spots (named from the [JSU campus map / directory](https://www.jsums.edu/campusmap)), merged in code with `custom_locations` from Supabase |

## Production notes

- Set all required env vars on your host and redeploy after changes.
- Replace simulated metrics in `lib/liveMetrics.ts` with Wi‑Fi density, room bookings, or sensor APIs if you have them.
- Optional: on-device model for noise classification; keep processing local for privacy.
