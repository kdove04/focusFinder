"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LocationCard } from "@/components/LocationCard";
import { LocationFilters } from "@/components/LocationFilters";
import { useLiveMetrics } from "@/components/LiveMetricsProvider";
import {
  DEFAULT_LOCATION_FILTER_PREFS,
  LOCATION_FILTER_PREFS_STORAGE_KEY,
  locationMatchesFilters,
  parseStoredLocationFilterPrefs,
  type LocationFilterPrefs,
} from "@/lib/locationFilters";
import type { StudyLocation } from "@/lib/locations";

const LocationsMap = dynamic(
  () => import("@/components/LocationsMap").then((m) => ({ default: m.LocationsMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(420px,55vh)] items-center justify-center rounded-2xl border border-jsu-navy/10 bg-white/80 text-sm text-muted">
        Loading campus map…
      </div>
    ),
  },
);

export default function LocationsPage() {
  const { byId, lastError, refresh } = useLiveMetrics();
  const [locations, setLocations] = useState<StudyLocation[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [filterPrefs, setFilterPrefs] = useState<LocationFilterPrefs>(DEFAULT_LOCATION_FILTER_PREFS);
  /** When false, skip persisting so we never overwrite localStorage before the read effect applies. */
  const [filterPrefsHydrated, setFilterPrefsHydrated] = useState(false);

  useEffect(() => {
    const stored = parseStoredLocationFilterPrefs(
      typeof window !== "undefined"
        ? localStorage.getItem(LOCATION_FILTER_PREFS_STORAGE_KEY)
        : null,
    );
    if (stored) setFilterPrefs(stored);
    setFilterPrefsHydrated(true);
  }, []);

  useEffect(() => {
    if (!filterPrefsHydrated) return;
    try {
      localStorage.setItem(LOCATION_FILTER_PREFS_STORAGE_KEY, JSON.stringify(filterPrefs));
    } catch {
      /* ignore quota / private mode */
    }
  }, [filterPrefs, filterPrefsHydrated]);

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

  const filteredLocations = useMemo(
    () =>
      locations.filter((loc) => locationMatchesFilters(loc, byId[loc.id], filterPrefs)),
    [locations, byId, filterPrefs],
  );

  const sortedFiltered = useMemo(
    () =>
      [...filteredLocations].sort((a, b) => {
        const ma = byId[a.id];
        const mb = byId[b.id];
        const na = ma?.noiseLevel ?? a.baselineNoise;
        const nb = mb?.noiseLevel ?? b.baselineNoise;
        return na - nb;
      }),
    [filteredLocations, byId],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-jsu-navy">Study locations</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Cards refresh every few seconds with demo live metrics. Use your filters and sort—quieter
          floors score higher on Focus. Spots students add from{" "}
          <a href="/contribute" className="font-medium text-jsu-blue hover:underline">
            Share feedback
          </a>{" "}
          show up here too.
        </p>
        {lastError && (
          <p className="mt-3 text-sm text-amber-800">
            {lastError}{" "}
            <button
              type="button"
              onClick={() => void refresh()}
              className="font-semibold underline"
            >
              Retry
            </button>
          </p>
        )}
      </div>
      <section aria-labelledby="campus-map-heading" className="space-y-3">
        <div>
          <h2 id="campus-map-heading" className="text-lg font-semibold text-jsu-navy">
            Campus map
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            OpenStreetMap view centered on the main JSU campus. Pan and zoom to orient yourself
            alongside the location list below.
          </p>
        </div>
        <LocationsMap />
      </section>
      {locationsLoading ? (
        <p className="text-sm text-muted">Loading locations…</p>
      ) : locations.length === 0 ? (
        <p className="text-sm text-muted">No locations loaded.</p>
      ) : (
        <>
          <LocationFilters prefs={filterPrefs} onChange={setFilterPrefs} />
          <p className="text-sm text-muted">
            Showing{" "}
            <span className="font-medium text-jsu-navy">
              {sortedFiltered.length}
            </span>{" "}
            of {locations.length} spots.
          </p>
          {sortedFiltered.length === 0 ? (
            <p className="rounded-2xl border border-jsu-navy/10 bg-white/80 px-4 py-8 text-center text-sm text-muted">
              No study locations match these preferences. Raise the noise or crowd limits, or turn
              off Wi‑Fi / outlets requirements.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sortedFiltered.map((loc) => (
                <LocationCard key={loc.id} location={loc} metric={byId[loc.id]} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
