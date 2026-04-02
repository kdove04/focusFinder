"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { LocationCard } from "@/components/LocationCard";
import { useLiveMetrics } from "@/components/LiveMetricsProvider";
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-jsu-navy">Study locations</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Cards refresh every few seconds with demo live metrics. Sort by what matters to you—quieter
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
      {locationsLoading ? (
        <p className="text-sm text-muted">Loading locations…</p>
      ) : locations.length === 0 ? (
        <p className="text-sm text-muted">No locations loaded.</p>
      ) : (
        <>
          <section aria-labelledby="campus-map-heading" className="space-y-3">
            <div>
              <h2 id="campus-map-heading" className="text-lg font-semibold text-jsu-navy">
                Campus map
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted">
                Pins group study spots by building (approximate locations). Open a pin to jump to a
                location page.
              </p>
            </div>
            <LocationsMap locations={locations} />
          </section>
          <div className="grid gap-6 md:grid-cols-2">
          {[...locations]
            .sort((a, b) => {
              const ma = byId[a.id];
              const mb = byId[b.id];
              const na = ma?.noiseLevel ?? a.baselineNoise;
              const nb = mb?.noiseLevel ?? b.baselineNoise;
              return na - nb;
            })
            .map((loc) => (
              <LocationCard key={loc.id} location={loc} metric={byId[loc.id]} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
