import { redirect } from "next/navigation";
import Link from "next/link";
import { getAppSession } from "@/lib/appSession";
import { getAllStudyLocations } from "@/lib/allLocations";
import { readReviewsBySubmitterEmail } from "@/lib/reviews";
import { recommendStudyLocations } from "@/lib/recommendSpots";
import { defaultUserStudyPreferences, getUserPreferences } from "@/lib/userPreferences";
import { PreferencesForm } from "./PreferencesForm";

export const metadata = {
  title: "You | Focus Finder",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function UserPage() {
  const session = await getAppSession();
  if (!session) redirect("/?next=/user");

  const [storedPrefs, myReviews, locations] = await Promise.all([
    getUserPreferences(session.userId),
    readReviewsBySubmitterEmail(session.email),
    getAllStudyLocations(),
  ]);

  const preferences = storedPrefs ?? defaultUserStudyPreferences(session.userId);
  const recommended = recommendStudyLocations(locations, storedPrefs, session.userId, 6);
  const byId = new Map(locations.map((l) => [l.id, l]));

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-jsu-navy sm:text-3xl">You</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Your study preferences, reviews you have shared, and spots we think fit how you work.
        </p>
        <p className="mt-1 text-sm text-jsu-navy/70">Signed in as {session.email}</p>
      </div>

      <section
        className="rounded-2xl border border-jsu-navy/10 bg-white/90 p-6 shadow-sm sm:p-8"
        aria-labelledby="prefs-heading"
      >
        <h2 id="prefs-heading" className="text-lg font-semibold text-jsu-navy">
          Study preferences
        </h2>
        <p className="mt-1 text-sm text-muted">
          These tune recommendations below. You can change them anytime.
        </p>
        <div className="mt-6">
          <PreferencesForm initial={preferences} />
        </div>
      </section>

      <section
        className="rounded-2xl border border-jsu-navy/10 bg-white/90 p-6 shadow-sm sm:p-8"
        aria-labelledby="reviews-heading"
      >
        <h2 id="reviews-heading" className="text-lg font-semibold text-jsu-navy">
          Your reviews
        </h2>
        <p className="mt-1 text-sm text-muted">
          Reviews you submit while signed in are listed here. Older feedback may be missing if it was
          sent before you had an account.
        </p>
        {myReviews.length === 0 ? (
          <p className="mt-6 text-sm text-jsu-navy/75">
            No reviews yet. Open a study spot and leave a rating to see it here.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {myReviews.map((r) => {
              const place = byId.get(r.locationId);
              return (
                <li
                  key={r.id}
                  className="rounded-xl border border-jsu-navy/10 bg-jsu-cream/30 px-4 py-3"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link
                      href={`/locations/${encodeURIComponent(r.locationId)}`}
                      className="font-medium text-jsu-blue hover:underline"
                    >
                      {place?.name ?? r.locationId}
                    </Link>
                    <time className="text-xs text-muted" dateTime={r.createdAt}>
                      {formatDate(r.createdAt)}
                    </time>
                  </div>
                  <p className="mt-1 text-sm text-jsu-navy/85">
                    {r.rating}★ · Noise: {r.noiseReported}
                    {r.comment ? ` · ${r.comment}` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section
        className="rounded-2xl border border-jsu-navy/10 bg-white/90 p-6 shadow-sm sm:p-8"
        aria-labelledby="rec-heading"
      >
        <h2 id="rec-heading" className="text-lg font-semibold text-jsu-navy">
          Recommended for you
        </h2>
        <p className="mt-1 text-sm text-muted">
          Based on your preferences and each location’s typical noise and busyness. Live numbers on
          each spot’s page can still differ day to day.
        </p>
        {recommended.length === 0 ? (
          <p className="mt-6 text-sm text-jsu-navy/75">No locations to show.</p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {recommended.map(({ location, score, blurb }) => (
              <li key={location.id}>
                <Link
                  href={`/locations/${encodeURIComponent(location.id)}`}
                  className="block h-full rounded-xl border border-jsu-navy/10 bg-jsu-cream/20 p-4 transition hover:border-jsu-gold/40 hover:bg-white"
                >
                  <p className="text-xs font-medium text-jsu-gold">Match ~{score}%</p>
                  <p className="mt-1 font-semibold text-jsu-navy">{location.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {location.building} · Floor {location.floor}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-jsu-navy/80">{blurb}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-sm">
          <Link href="/locations" className="font-medium text-jsu-blue hover:underline">
            Browse all study spots
          </Link>
        </p>
      </section>
    </div>
  );
}
