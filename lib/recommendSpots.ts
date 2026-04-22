import type { StudyLocation } from "./locations";
import type { UserStudyPreferences } from "./userPreferences";
import { defaultUserStudyPreferences } from "./userPreferences";

/** Ideals for baseline noise (0–100) and busyness (0–100) by preference. */
const NOISE_IDEAL: Record<UserStudyPreferences["preferredNoise"], number> = {
  quiet: 32,
  moderate: 50,
  loud: 68,
};

const BUSY_IDEAL: Record<UserStudyPreferences["preferredBusyness"], number> = {
  low: 40,
  medium: 60,
  high: 78,
};

export type RecommendedSpot = {
  location: StudyLocation;
  /** Higher is a better match (roughly 0–100). */
  score: number;
  blurb: string;
};

/**
 * Pick study locations that best match saved preferences (baseline vs ideal noise/busyness).
 */
export function recommendStudyLocations(
  locations: StudyLocation[],
  prefs: UserStudyPreferences | null,
  userId: string,
  topN = 6,
): RecommendedSpot[] {
  const p = prefs ?? defaultUserStudyPreferences(userId);
  const iN = NOISE_IDEAL[p.preferredNoise];
  const iB = BUSY_IDEAL[p.preferredBusyness];

  const withScores = locations.map((location) => {
    const dN = Math.abs(location.baselineNoise - iN);
    const dB = Math.abs(location.baselineBusyness - iB);
    let score = 100 - dN * 0.45 - dB * 0.35;
    if (p.studyStyle === "solo" && location.typicalCapacity > 70) {
      score -= 4;
    }
    if (p.studyStyle === "group" && location.typicalCapacity < 35) {
      score -= 3;
    }
    score = Math.max(0, Math.min(100, Math.round(score)));
    const blurb = buildBlurb(p, dN, dB, location);
    return { location, score, blurb };
  });

  return withScores
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

function buildBlurb(
  prefs: UserStudyPreferences,
  dN: number,
  dB: number,
  loc: StudyLocation,
): string {
  const bits: string[] = [];
  if (dN < 12 && dB < 15) {
    bits.push("Close match to your ideal noise and busyness.");
  } else if (dN < 15) {
    bits.push("Noise level fits what you look for.");
  } else if (dB < 15) {
    bits.push("Crowd level lines up with your preference.");
  } else {
    bits.push("Reasonable option given your study settings.");
  }
  if (prefs.studyStyle === "group" && loc.amenities.some((a) => /group|table|whiteboard/i.test(a))) {
    bits.push("Has space that works for partner or group work.");
  }
  if (prefs.studyStyle === "solo" && (loc.baselineNoise < 40 || /quiet|carrel|silent/i.test(loc.description))) {
    bits.push("Tends to suit solo, heads-down work.");
  }
  return bits.slice(0, 2).join(" ");
}
