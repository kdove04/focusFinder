import type { StudyLocation } from "./locations";

export type LiveMetric = {
  locationId: string;
  noiseLevel: number;
  busyness: number;
  occupancyEstimate: number;
  updatedAt: string;
};

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** Deterministic-ish fluctuation around baselines for demo “real-time” without a sensor network */
export function computeLiveMetrics(
  locations: StudyLocation[],
  tick: number,
): LiveMetric[] {
  const now = new Date().toISOString();
  return locations.map((loc, i) => {
    const s = tick + i * 17;
    const nJitter = (pseudoRandom(s) - 0.5) * 18;
    const bJitter = (pseudoRandom(s + 3) - 0.5) * 22;
    const noiseLevel = Math.round(
      Math.max(5, Math.min(95, loc.baselineNoise + nJitter)),
    );
    const busyness = Math.round(
      Math.max(5, Math.min(95, loc.baselineBusyness + bJitter)),
    );
    const cap = loc.typicalCapacity;
    const occupancyEstimate = Math.round((busyness / 100) * cap);
    return {
      locationId: loc.id,
      noiseLevel,
      busyness,
      occupancyEstimate,
      updatedAt: now,
    };
  });
}

export function focusScoreFromMetrics(noiseLevel: number, busyness: number): number {
  // Weight quiet and low traffic; output 0–100 “focus fit”
  const n = noiseLevel / 100;
  const b = busyness / 100;
  const raw = 100 * (1 - 0.45 * n - 0.55 * b);
  return Math.round(Math.max(0, Math.min(100, raw)));
}
