import { NoiseMeter } from "@/components/NoiseMeter";

export default function NoisePage() {
  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-jsu-navy">Noise check</h1>
        <p className="mt-2 text-muted">
          Use this before you settle in—especially if you are deciding between the lounge and the
          library stacks.
        </p>
      </div>
      <NoiseMeter />
    </div>
  );
}
