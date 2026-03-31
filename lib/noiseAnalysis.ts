/**
 * On-device noise scoring from normalized RMS (0–1).
 * Uses smoothing and variance to approximate “study suitability” without sending audio off-device.
 */
export type NoiseLabel = "ideal" | "good" | "elevated" | "loud";

export function rmsToDbApprox(rms: number): number {
  const floor = 1e-7;
  const safe = Math.max(rms, floor);
  // Rough dBFS-style scale for visualization (not calibrated SPL)
  return 20 * Math.log10(safe);
}

export function scoreFocusFromSamples(
  rmsValues: number[],
  varianceWeight = 0.35,
): { score: number; label: NoiseLabel; stability: number } {
  if (rmsValues.length === 0) {
    return { score: 50, label: "good", stability: 0.5 };
  }
  const mean = rmsValues.reduce((a, b) => a + b, 0) / rmsValues.length;
  const varSum = rmsValues.reduce((s, v) => s + (v - mean) ** 2, 0);
  const variance = varSum / rmsValues.length;
  // Lower RMS and lower variance (stable) → higher focus score
  const loudPenalty = Math.min(1, mean * 4);
  const unstablePenalty = Math.min(1, variance * varianceWeight * 80);
  const raw = 100 * (1 - 0.55 * loudPenalty - 0.45 * unstablePenalty);
  const score = Math.round(Math.max(0, Math.min(100, raw)));
  const label: NoiseLabel =
    score >= 78 ? "ideal" : score >= 58 ? "good" : score >= 38 ? "elevated" : "loud";
  const stability = Math.max(0, Math.min(1, 1 - unstablePenalty));
  return { score, label, stability };
}
