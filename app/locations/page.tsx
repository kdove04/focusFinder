"use client";

import { LocationCard } from "@/components/LocationCard";
import { useLiveMetrics } from "@/components/LiveMetricsProvider";
import { studyLocations } from "@/lib/locations";

export default function LocationsPage() {
  const { byId, lastError, refresh } = useLiveMetrics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-jsu-navy">Study locations</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Cards refresh every few seconds with demo live metrics. Sort by what matters to you—quieter
          floors score higher on Focus.
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
      <div className="grid gap-6 md:grid-cols-2">
        {[...studyLocations]
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
    </div>
  );
}
