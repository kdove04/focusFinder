"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { StudyLocation } from "@/lib/locations";
import type { Review } from "@/lib/reviews";

const ADD_NEW_VALUE = "__add_new__";

export function ContributeClient() {
  const searchParams = useSearchParams();
  const presetId = searchParams.get("location") ?? "";

  const [locations, setLocations] = useState<StudyLocation[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  const [locationId, setLocationId] = useState("");
  const [addingLocation, setAddingLocation] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBuilding, setNewBuilding] = useState("");
  const [newFloor, setNewFloor] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAmenities, setNewAmenities] = useState("");
  const [addLocationMsg, setAddLocationMsg] = useState<string | null>(null);
  const [addLocationSubmitting, setAddLocationSubmitting] = useState(false);

  const [rating, setRating] = useState(5);
  const [noiseReported, setNoiseReported] = useState<"quiet" | "moderate" | "loud">("moderate");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [recent, setRecent] = useState<Review[]>([]);

  const loadLocations = useCallback(async () => {
    setLocationsLoading(true);
    try {
      const res = await fetch("/api/locations", { cache: "no-store" });
      const data = (await res.json()) as { locations?: StudyLocation[] };
      setLocations(data.locations ?? []);
    } catch {
      setLocations([]);
    } finally {
      setLocationsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    if (!presetId || locations.length === 0) return;
    if (locations.some((l) => l.id === presetId)) {
      setLocationId(presetId);
      setAddingLocation(false);
    }
  }, [presetId, locations]);

  const loadRecent = useCallback(async () => {
    const res = await fetch("/api/reviews", { cache: "no-store" });
    const data = (await res.json()) as { reviews: Review[] };
    setRecent((data.reviews ?? []).slice(0, 8));
  }, []);

  useEffect(() => {
    void loadRecent();
  }, [loadRecent]);

  async function handleAddLocation() {
    setAddLocationMsg(null);
    const name = newName.trim();
    const building = newBuilding.trim();
    if (!name || !building) {
      setAddLocationMsg("Spot name and building are required.");
      return;
    }
    setAddLocationSubmitting(true);
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          building,
          floor: newFloor.trim() || undefined,
          description: newDescription.trim() || undefined,
          amenities: newAmenities.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { error?: string; location?: StudyLocation };
      if (!res.ok) {
        setAddLocationMsg(data.error ?? "Could not add location.");
        return;
      }
      if (data.location) {
        await loadLocations();
        setLocationId(data.location.id);
        setAddingLocation(false);
        setNewName("");
        setNewBuilding("");
        setNewFloor("");
        setNewDescription("");
        setNewAmenities("");
        setAddLocationMsg("Added. You can submit your review below.");
      }
    } catch {
      setAddLocationMsg("Network error.");
    } finally {
      setAddLocationSubmitting(false);
    }
  }

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

  const selectValue = addingLocation ? ADD_NEW_VALUE : locationId;

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h1 className="text-3xl font-bold text-jsu-navy">Share feedback</h1>
        <p className="mt-2 text-muted">
          Quick ratings keep the map honest. Add a missing study spot from the dropdown, then tell
          everyone how it felt.
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
              required={!addingLocation}
              disabled={locationsLoading}
              value={selectValue}
              onChange={(e) => {
                const v = e.target.value;
                if (v === ADD_NEW_VALUE) {
                  setAddingLocation(true);
                  setLocationId("");
                  setAddLocationMsg(null);
                  return;
                }
                setAddingLocation(false);
                setLocationId(v);
                setAddLocationMsg(null);
              }}
              className="mt-1 w-full rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm disabled:opacity-60"
            >
              <option value="">{locationsLoading ? "Loading spots…" : "Select…"}</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
              <option value={ADD_NEW_VALUE}>+ Add new study spot…</option>
            </select>
          </div>

          {addingLocation && (
            <div className="rounded-xl border border-jsu-gold/40 bg-jsu-cream/40 p-4">
              <p className="text-sm font-medium text-jsu-navy">New study spot</p>
              <p className="mt-1 text-xs text-muted">
                This saves to the shared list so it appears on Study spots and in this menu for
                everyone.
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="new-name" className="block text-xs font-medium text-jsu-navy">
                    Spot name <span className="text-red-700">*</span>
                  </label>
                  <input
                    id="new-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. 3rd floor window carrels"
                    maxLength={120}
                    className="mt-1 w-full rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="new-building" className="block text-xs font-medium text-jsu-navy">
                    Building <span className="text-red-700">*</span>
                  </label>
                  <input
                    id="new-building"
                    value={newBuilding}
                    onChange={(e) => setNewBuilding(e.target.value)}
                    placeholder="e.g. H.T. Sampson Library"
                    maxLength={120}
                    className="mt-1 w-full rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="new-floor" className="block text-xs font-medium text-jsu-navy">
                    Floor / area
                  </label>
                  <input
                    id="new-floor"
                    value={newFloor}
                    onChange={(e) => setNewFloor(e.target.value)}
                    placeholder="e.g. 3 or Ground"
                    maxLength={40}
                    className="mt-1 w-full rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="new-desc" className="block text-xs font-medium text-jsu-navy">
                    Short description
                  </label>
                  <textarea
                    id="new-desc"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                    maxLength={500}
                    placeholder="What should people know before they go?"
                    className="mt-1 w-full rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="new-amenities" className="block text-xs font-medium text-jsu-navy">
                    Amenities (comma-separated)
                  </label>
                  <input
                    id="new-amenities"
                    value={newAmenities}
                    onChange={(e) => setNewAmenities(e.target.value)}
                    placeholder="Wi‑Fi, Outlets, Whiteboards"
                    className="mt-1 w-full rounded-lg border border-jsu-navy/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="button"
                  disabled={addLocationSubmitting}
                  onClick={() => void handleAddLocation()}
                  className="rounded-lg bg-jsu-gold px-4 py-2 text-sm font-semibold text-jsu-navy transition hover:brightness-95 disabled:opacity-60"
                >
                  {addLocationSubmitting ? "Adding…" : "Add to campus list"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingLocation(false);
                    setAddLocationMsg(null);
                  }}
                  className="ml-2 text-sm font-medium text-jsu-blue underline"
                >
                  Cancel
                </button>
                {addLocationMsg && <p className="text-sm text-jsu-navy">{addLocationMsg}</p>}
              </div>
            </div>
          )}

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
            disabled={submitting || addingLocation || !locationId}
            className="rounded-xl bg-jsu-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-jsu-blue disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Submit review"}
          </button>
          {message && <p className="text-sm text-jsu-navy">{message}</p>}
        </form>
      </div>
      <aside className="lg:col-span-2">
        <h2 className="text-lg font-semibold text-jsu-navy">Latest across campus</h2>
        <ul className="mt-4 space-y-3">
          {recent.map((r) => {
            const loc = locations.find((l) => l.id === r.locationId);
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
