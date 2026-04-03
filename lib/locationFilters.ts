import type { StudyLocation } from "./locations";
import type { LiveMetric } from "./liveMetrics";

export type LocationFilterPrefs = {
  /** Show locations at or below this noise score (0–100). 100 = no limit. */
  maxNoise: number;
  /** Show locations at or below this busyness score (0–100). 100 = no limit. */
  maxCrowd: number;
  requireWifi: boolean;
  requireOutlets: boolean;
};

export const DEFAULT_LOCATION_FILTER_PREFS: LocationFilterPrefs = {
  maxNoise: 100,
  maxCrowd: 100,
  requireWifi: false,
  requireOutlets: false,
};

export const LOCATION_FILTER_PREFS_STORAGE_KEY = "focusFinder:locationFilters";

function normalizeAmenity(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\u2011|\u2010|\u2013|\u2014/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function amenitiesIncludeWifi(amenities: string[]): boolean {
  return amenities.some((a) => {
    const n = normalizeAmenity(a);
    return n.includes("wi-fi") || n.includes("wifi");
  });
}

export function amenitiesIncludeOutlets(amenities: string[]): boolean {
  return amenities.some((a) => normalizeAmenity(a).includes("outlet"));
}

function clamp01to100(n: number): number {
  if (Number.isNaN(n)) return 100;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function parseStoredLocationFilterPrefs(raw: string | null): LocationFilterPrefs | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Partial<LocationFilterPrefs>;
    return {
      maxNoise: clamp01to100(typeof o.maxNoise === "number" ? o.maxNoise : 100),
      maxCrowd: clamp01to100(typeof o.maxCrowd === "number" ? o.maxCrowd : 100),
      requireWifi: Boolean(o.requireWifi),
      requireOutlets: Boolean(o.requireOutlets),
    };
  } catch {
    return null;
  }
}

export function locationMatchesFilters(
  location: StudyLocation,
  metric: LiveMetric | undefined,
  prefs: LocationFilterPrefs,
): boolean {
  const noise = metric?.noiseLevel ?? location.baselineNoise;
  const crowd = metric?.busyness ?? location.baselineBusyness;

  if (noise > prefs.maxNoise) return false;
  if (crowd > prefs.maxCrowd) return false;
  if (prefs.requireWifi && !amenitiesIncludeWifi(location.amenities)) return false;
  if (prefs.requireOutlets && !amenitiesIncludeOutlets(location.amenities)) return false;

  return true;
}
