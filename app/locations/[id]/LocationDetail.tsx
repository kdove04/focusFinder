"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { StudyLocation } from "@/lib/locations";
import type { LiveMetric } from "@/lib/liveMetrics";
import { focusScoreFromMetrics } from "@/lib/liveMetrics";
import type { Review } from "@/lib/reviews";

type Props = { location: StudyLocation };

export function LocationDetail({ location }: Props) {
  const [metric, setMetric] = useState<LiveMetric | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [rating, setRating] = useState(5);
  const [noiseReported, setNoiseReported] = useState<"quiet" | "moderate" | "loud">("moderate");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(
        `/api/reviews?locationId=${encodeURIComponent(location.id)}`,
        { cache: "no-store" },
      );
      const data = (await res.json()) as { reviews: Review[] };
      setReviews(data.reviews ?? []);
    } finally {
      setLoadingReviews(false);
    }
  }, [location.id]);

  const loadMetric = useCallback(async () => {
    try {
      const res = await fetch("/api/locations/status", { cache: "no-store" });
      const data = (await res.json()) as { metrics: LiveMetric[] };
      const m = data.metrics?.find((x) => x.locationId === location.id);
      setMetric(m ?? null);
    } catch {
      setMetric(null);
    }
  }, [location.id]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    void loadMetric();
    const id = setInterval(() => void loadMetric(), 8000);
    return () => clearInterval(id);
  }, [loadMetric]);

  const noise = metric?.noiseLevel ?? location.baselineNoise;
  const busy = metric?.busyness ?? location.baselineBusyness;
  const focus = focusScoreFromMetrics(noise, busy);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: location.id,
          rating,
          noiseReported,
          comment,
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setSubmitMsg(err.error ?? "Could not save review.");
        return;
      }
      setComment("");
      setSubmitMsg("Thanks—your feedback was saved.");
      await loadReviews();
    } catch {
      setSubmitMsg("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/locations"
          className="text-sm font-medium text-jsu-blue hover:underline"
        >
          ← All locations
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-jsu-navy">{location.name}</h1>
        <p className="mt-1 text-muted">
          {location.building} · Floor {location.floor}
        </p>
        <p className="mt-4 max-w-2xl text-jsu-navy/85">{location.description}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-xl bg-jsu-cream px-4 py-3">
            <p className="text-xs font-medium text-jsu-navy/60">Live focus score</p>
            <p className="text-2xl font-bold text-jsu-navy">{focus}</p>
          </div>
          <div className="rounded-xl border border-jsu-navy/10 px-4 py-3">
            <p className="text-xs text-muted">Noise / busyness</p>
            <p className="text-lg font-semibold text-jsu-navy">
              {noise} / {busy}
            </p>
          </div>
          {avg != null && (
            <div className="rounded-xl border border-jsu-navy/10 px-4 py-3">
              <p className="text-xs text-muted">Student avg rating</p>
              <p className="text-lg font-semibold text-jsu-navy">{avg.toFixed(1)} / 5</p>
            </div>
          )}
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {location.amenities.map((a) => (
            <li
              key={a}
              className="rounded-md bg-white px-2 py-1 text-xs font-medium text-jsu-navy/80 shadow-sm"
            >
              {a}
            </li>
          ))}
        </ul>
      </div>

      <section className="rounded-2xl border border-jsu-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-jsu-navy">Share your visit</h2>
        <p className="mt-1 text-sm text-muted">
          Ratings and noise tags help others choose a spot that fits.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-jsu-navy">
              Overall rating
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 w-full max-w-xs rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} — {n === 5 ? "Excellent" : n === 1 ? "Poor" : "Good"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="block text-sm font-medium text-jsu-navy">How loud was it?</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["quiet", "Quiet"],
                  ["moderate", "Moderate"],
                  ["loud", "Loud"],
                ] as const
              ).map(([val, lab]) => (
                <label
                  key={val}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
                    noiseReported === val
                      ? "border-jsu-navy bg-jsu-navy text-white"
                      : "border-jsu-navy/15 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="noise"
                    value={val}
                    checked={noiseReported === val}
                    onChange={() => setNoiseReported(val)}
                    className="sr-only"
                  />
                  {lab}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-jsu-navy">
              Comment (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={2000}
              className="mt-1 w-full rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm"
              placeholder="Outlets by the window, crowded after 4pm…"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-jsu-gold px-5 py-2.5 text-sm font-semibold text-jsu-navy transition hover:brightness-95 disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Submit feedback"}
          </button>
          {submitMsg && <p className="text-sm text-jsu-navy">{submitMsg}</p>}
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-jsu-navy">Recent student notes</h2>
        {loadingReviews ? (
          <p className="mt-4 text-sm text-muted">Loading…</p>
        ) : reviews.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No reviews yet. Be the first.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-jsu-navy/10 bg-white/90 p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-jsu-navy">{r.rating}/5</span>
                  <span className="text-muted">·</span>
                  <span className="capitalize text-muted">{r.noiseReported}</span>
                  <span className="text-muted">·</span>
                  <time dateTime={r.createdAt} className="text-muted">
                    {new Date(r.createdAt).toLocaleString()}
                  </time>
                </div>
                {r.comment ? (
                  <p className="mt-2 text-sm text-jsu-navy/90">{r.comment}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
