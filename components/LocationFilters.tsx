"use client";

import type { LocationFilterPrefs } from "@/lib/locationFilters";
import { DEFAULT_LOCATION_FILTER_PREFS } from "@/lib/locationFilters";

type Props = {
  prefs: LocationFilterPrefs;
  onChange: (next: LocationFilterPrefs) => void;
};

function SliderRow({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-jsu-navy">
          {label}
        </label>
        <span className="tabular-nums text-sm text-muted" aria-live="polite">
          {value >= 100 ? "Any" : `≤ ${value}`}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-jsu-navy"
      />
      <p className="text-xs text-muted">{hint}</p>
    </div>
  );
}

export function LocationFilters({ prefs, onChange }: Props) {
  const setField = <K extends keyof LocationFilterPrefs>(key: K, v: LocationFilterPrefs[K]) => {
    onChange({ ...prefs, [key]: v });
  };

  const reset = () => onChange({ ...DEFAULT_LOCATION_FILTER_PREFS });

  const isDefault =
    prefs.maxNoise === DEFAULT_LOCATION_FILTER_PREFS.maxNoise &&
    prefs.maxCrowd === DEFAULT_LOCATION_FILTER_PREFS.maxCrowd &&
    prefs.requireWifi === DEFAULT_LOCATION_FILTER_PREFS.requireWifi &&
    prefs.requireOutlets === DEFAULT_LOCATION_FILTER_PREFS.requireOutlets;

  return (
    <section
      aria-labelledby="location-filters-heading"
      className="rounded-2xl border border-jsu-navy/10 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="location-filters-heading" className="text-lg font-semibold text-jsu-navy">
            Your filters
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Tune the list using live-style noise and busyness, plus amenities. Preferences are saved
            in this browser.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          disabled={isDefault}
          className="text-sm font-medium text-jsu-blue underline decoration-jsu-blue/30 underline-offset-2 hover:no-underline disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <SliderRow
            id="filter-max-noise"
            label="Noise ceiling"
            hint="Only show spots at or below this noise level (uses live estimate when available)."
            value={prefs.maxNoise}
            onChange={(v) => setField("maxNoise", v)}
          />
          <SliderRow
            id="filter-max-crowd"
            label="Crowd / busyness ceiling"
            hint="Hide busier spots above this level (uses live estimate when available)."
            value={prefs.maxCrowd}
            onChange={(v) => setField("maxCrowd", v)}
          />
        </div>
        <fieldset className="min-w-0 space-y-3 border-0 p-0">
          <legend className="text-sm font-medium text-jsu-navy">Amenities</legend>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-jsu-navy/10 bg-jsu-cream/40 px-4 py-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jsu-gold">
            <input
              type="checkbox"
              checked={prefs.requireWifi}
              onChange={(e) => setField("requireWifi", e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-jsu-navy/30 text-jsu-navy focus:ring-jsu-gold"
            />
            <span>
              <span className="font-medium text-jsu-navy">Wi‑Fi</span>
              <span className="mt-0.5 block text-xs text-muted">
                Spot must list Wi‑Fi or “Wi‑Fi nearby” in amenities.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-jsu-navy/10 bg-jsu-cream/40 px-4 py-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-jsu-gold">
            <input
              type="checkbox"
              checked={prefs.requireOutlets}
              onChange={(e) => setField("requireOutlets", e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-jsu-navy/30 text-jsu-navy focus:ring-jsu-gold"
            />
            <span>
              <span className="font-medium text-jsu-navy">Outlets</span>
              <span className="mt-0.5 block text-xs text-muted">
                Amenities must mention outlets (e.g. “Outlets”, “Outlets nearby”).
              </span>
            </span>
          </label>
        </fieldset>
      </div>
    </section>
  );
}
