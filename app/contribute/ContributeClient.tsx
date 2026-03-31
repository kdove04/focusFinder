"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { studyLocations } from "@/lib/locations";
import type { Review } from "@/lib/reviews";

export function ContributeClient() {
  const searchParams = useSearchParams();
  const presetId = searchParams.get("location") ?? "";

  const [locationId, setLocationId] = useState(presetId);
  const [rating, setRating] = useState(5);
  const [noiseReported, setNoiseReported] = useState<"quiet" | "moderate" | "loud">("moderate");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [recent, setRecent] = useState<Review[]>([]);

  useEffect(() => {
    if (presetId && studyLocations.some((l) => l.id === presetId)) {
      setLocationId(presetId);
    }
  }, [presetId]);

  const loadRecent = useCallback(async () => {
    const res = await fetch("/api/reviews", {
      cache: "no-store",
      credentials: "same-origin",
    });
    const data = (await res.json()) as { reviews: Review[] };
    setRecent((data.reviews ?? []).slice(0, 8));
  }, []);

  useEffect(() => {
    void loadRecent();
  }, [loadRecent]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!locationId) {
      setMessage("Pick a location first.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ locationId, rating, noiseReported, comment }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setMessage(err.error ?? "Could not save.");
        return;
      }
      setComment("");
      setMessage("Saved. Thank you for helping other Tigers focus.");
      await loadRecent();
    } catch {
      setMessage("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h1 className="text-3xl font-bold text-jsu-navy">Share feedback</h1>
        <p className="mt-2 text-muted">
          Quick ratings keep the map honest. You can also add detail from each location&apos;s page.
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-jsu-navy/10 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="loc" className="block text-sm font-medium text-jsu-navy">
              Location
            </label>
            <select
              id="loc"
              required
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm"
            >
              <option value="">Select…</option>
              {studyLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-jsu-navy">
              Rating
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 w-full max-w-xs rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="block text-sm font-medium text-jsu-navy">Noise level</span>
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
              Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-jsu-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-jsu-blue disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Submit"}
          </button>
          {message && <p className="text-sm text-jsu-navy">{message}</p>}
        </form>
      </div>
      <aside className="lg:col-span-2">
        <h2 className="text-lg font-semibold text-jsu-navy">Latest across campus</h2>
        <ul className="mt-4 space-y-3">
          {recent.map((r) => {
            const loc = studyLocations.find((l) => l.id === r.locationId);
            return (
              <li
                key={r.id}
                className="rounded-xl border border-jsu-navy/10 bg-white/90 p-3 text-sm shadow-sm"
              >
                <Link
                  href={`/locations/${r.locationId}`}
                  className="font-medium text-jsu-blue hover:underline"
                >
                  {loc?.name ?? "Location"}
                </Link>
                <p className="text-muted">
                  {r.rating}/5 · <span className="capitalize">{r.noiseReported}</span>
                </p>
                {r.comment ? <p className="mt-1 text-jsu-navy/90">{r.comment}</p> : null}
              </li>
            );
          })}
        </ul>
        {recent.length === 0 && (
          <p className="mt-4 text-sm text-muted">No submissions yet.</p>
        )}
      </aside>
    </div>
  );
}
