import Link from "next/link";
import type { StudyLocation } from "@/lib/locations";
import type { LiveMetric } from "@/lib/liveMetrics";
import { focusScoreFromMetrics } from "@/lib/liveMetrics";

type Props = {
  location: StudyLocation;
  metric?: LiveMetric;
};

function MeterBar({ value }: { value: number }) {
  const hue =
    value > 66 ? "bg-rose-500" : value > 33 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-jsu-navy/10">
      <div
        className={`h-full rounded-full transition-all duration-500 ${hue}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function LocationCard({ location, metric }: Props) {
  const noise = metric?.noiseLevel ?? location.baselineNoise;
  const busy = metric?.busyness ?? location.baselineBusyness;
  const focus = focusScoreFromMetrics(noise, busy);

  return (
    <article className="flex flex-col rounded-2xl border border-jsu-navy/10 bg-white p-5 shadow-sm transition hover:border-jsu-gold/40 hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-jsu-navy">{location.name}</h2>
          <p className="text-sm text-muted">
            {location.building} · Floor {location.floor}
          </p>
        </div>
        <div
          className="rounded-full bg-jsu-cream px-3 py-1 text-xs font-semibold text-jsu-navy"
          title="Combined live focus score"
        >
          Focus {focus}
        </div>
      </div>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-jsu-navy/85">
        {location.description}
      </p>
      {metric && (
        <div className="mb-4 space-y-2 text-xs text-muted">
          <div>
            <div className="mb-1 flex justify-between font-medium text-jsu-navy/70">
              <span>Noise (live)</span>
              <span>{noise}</span>
            </div>
            <MeterBar value={noise} />
          </div>
          <div>
            <div className="mb-1 flex justify-between font-medium text-jsu-navy/70">
              <span>Busyness</span>
              <span>{busy}</span>
            </div>
            <MeterBar value={busy} />
          </div>
          <p className="pt-1 text-[11px] text-muted">
            ~{metric.occupancyEstimate} students (estimate) · updated live
          </p>
        </div>
      )}
      <ul className="mb-4 flex flex-wrap gap-2">
        {location.amenities.map((a) => (
          <li
            key={a}
            className="rounded-md bg-jsu-navy/5 px-2 py-0.5 text-xs text-jsu-navy/80"
          >
            {a}
          </li>
        ))}
      </ul>
      <Link
        href={`/locations/${location.id}`}
        className="inline-flex items-center justify-center rounded-xl bg-jsu-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-jsu-blue"
      >
        View details & reviews
      </Link>
    </article>
  );
}
