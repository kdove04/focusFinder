# Focus Finder

Focus Finder is a web application for **Jackson State University** students to discover study-friendly spots on campus. It combines **live-style busyness and noise indicators** (demo simulation, ready to swap for real feeds), **on-device microphone analysis** for a focus suitability score, and **student reviews** stored via the API.

**Access:** Students sign in with **JSU Microsoft 365** (the same account as student email: `JNumber@students.jsums.edu`), implemented via [Auth.js](https://authjs.dev/) and **Microsoft Entra ID**.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Auth.js / `next-auth` v5](https://authjs.dev/) + Microsoft Entra ID (OAuth)

## Run locally

Copy `.env.example` to `.env.local` and fill in values from the section below, then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sign-in (JSU Microsoft 365)

1. In the [Microsoft Entra admin center](https://entra.microsoft.com/), register an app (**App registrations** → **New registration**). Choose **Accounts in this organizational directory only** (single tenant) for Jackson State, unless IT specifies otherwise.
2. Under **Authentication**, add a **Web** redirect URI:
   - Local: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
   - Production: `https://<your-domain>/api/auth/callback/microsoft-entra-id`
3. Create a **client secret** under **Certificates & secrets**.
4. Set **Application (client) ID**, secret, and issuer in `.env.local`:
   - `AUTH_MICROSOFT_ENTRA_ID_ISSUER` is typically `https://login.microsoftonline.com/<Directory (tenant) ID>/v2.0`
5. Set `AUTH_SECRET` to a long random string (for example `openssl rand -base64 32`). **Production will not start without it.** Local development uses a temporary built-in secret until you add `AUTH_SECRET` to `.env.local` (you should still set your own for consistent sessions across restarts).

Only email addresses whose domain is allowed can complete sign-in. By default that is **`students.jsums.edu`**. To allow additional domains (for example staff), set `ALLOWED_EMAIL_DOMAINS` to a comma-separated list.

Ensure the Entra app requests **sign-in and read user profile** so Auth.js receives `email` and `name`. If the email claim is missing, adjust **Token configuration** → optional claims in Entra or the app’s API permissions per [Microsoft’s OAuth documentation](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow).

### Sign-in fails after Duo or “Microsoft has trouble signing you in”

- **UPN without `email` claim:** The app allows `@students.jsums.edu` using `email`, `preferred_username`, or `upn` from the token. If IT has not added the `email` optional claim, sign-in should still work; if it does not, ask IT to add the `email` claim for the app registration.
- **Long MFA flows:** OAuth `state` / PKCE cookies are set to **30 minutes** so slow Duo prompts are less likely to expire the login attempt.
- **Redirect URI:** Must exactly match Entra (including `http://localhost:3000` vs another port, `https` in production, and path `/api/auth/callback/microsoft-entra-id`).
- **`AUTH_URL`:** In production, set `AUTH_URL` (or `NEXTAUTH_URL`) to the public origin of this app so the OAuth callback matches what Entra expects.

## Project layout

| Area | Purpose |
|------|---------|
| `app/locations` | Study spots list with polling live metrics |
| `app/locations/[id]` | Detail, reviews, submit feedback |
| `app/noise` | Browser-based noise / stability analysis |
| `app/contribute` | Global feedback form |
| `app/login` | Microsoft 365 sign-in |
| `auth.ts` | Auth.js config (Entra provider + email domain check) |
| `middleware.ts` | Sends unauthenticated users to `/login` (pages); APIs use session in route handlers |
| `app/api/locations/status` | JSON metrics (replace with campus data) |
| `app/api/reviews` | GET/POST reviews → `data/reviews.json` |
| `lib/locations.ts` | Seed locations (edit for real campus POIs) |

## Production notes

- Set the same auth environment variables on your host (for example Vercel project settings). Use the production redirect URI in Entra.
- Persist reviews in a database instead of `data/reviews.json` for multi-instance hosting.
- Replace simulated metrics in `lib/liveMetrics.ts` with Wi‑Fi density, room bookings, or sensor APIs.
- Optional: add a trained audio classifier (e.g. TensorFlow.js) while keeping processing on-device for privacy.
