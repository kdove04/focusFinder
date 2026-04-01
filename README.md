# Focus Finder

Focus Finder is a web application for **Jackson State University** students to discover study-friendly spots on campus. It combines **live-style busyness and noise indicators** (demo simulation, ready to swap for real feeds), **on-device microphone analysis** for a focus suitability score, and **student reviews** stored via the API.

The default app is **open to everyone** (no sign-in). Add authentication later if you need verified JSU accounts or moderation.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

| Area | Purpose |
|------|---------|
| `app/locations` | Study spots list with polling live metrics |
| `app/locations/[id]` | Detail, reviews, submit feedback |
| `app/noise` | Browser-based noise / stability analysis |
| `app/contribute` | Global feedback form |
| `app/api/locations` | GET merged list; POST adds a spot → `data/custom-locations.json` |
| `app/api/locations/status` | JSON metrics (replace with campus data) |
| `app/api/reviews` | GET/POST reviews → `data/reviews.json` |
| `data/custom-locations.json` | Student-added study spots (seed `[]`) |
| `lib/locations.ts` | Seed locations (edit for real campus POIs) |

## Production notes

- Persist reviews and custom locations in a database instead of `data/reviews.json` / `data/custom-locations.json` for multi-instance hosting.
- Replace simulated metrics in `lib/liveMetrics.ts` with Wi‑Fi density, room bookings, or sensor APIs.
- Optional: add a trained audio classifier (e.g. TensorFlow.js) while keeping processing on-device for privacy.
