"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { rmsToDbApprox, scoreFocusFromSamples, type NoiseLabel } from "@/lib/noiseAnalysis";

const labelCopy: Record<NoiseLabel, { title: string; detail: string }> = {
  ideal: { title: "Ideal for deep focus", detail: "Levels look steady and low." },
  good: { title: "Good for studying", detail: "Typical indoor background." },
  elevated: { title: "Elevated activity", detail: "Consider earplugs or a quieter zone." },
  loud: { title: "Challenging for focus", detail: "Short bursts only, or move." },
};

export function NoiseMeter() {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbApprox, setDbApprox] = useState<number | null>(null);
  const [focusScore, setFocusScore] = useState<number | null>(null);
  const [label, setLabel] = useState<NoiseLabel | null>(null);
  const [stability, setStability] = useState<number | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const samplesRef = useRef<number[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
    analyserRef.current = null;
    samplesRef.current = [];
    setRunning(false);
    setDbApprox(null);
    setFocusScore(null);
    setLabel(null);
    setStability(null);
  }, []);

  const loop = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    setDbApprox(Math.round(rmsToDbApprox(rms) * 10) / 10);
    const arr = samplesRef.current;
    arr.push(rms);
    if (arr.length > 45) arr.shift();
    const { score, label: lab, stability: stab } = scoreFocusFromSamples([...arr]);
    setFocusScore(score);
    setLabel(lab);
    setStability(stab);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.65;
      source.connect(analyser);
      analyserRef.current = analyser;
      setRunning(true);
      rafRef.current = requestAnimationFrame(loop);
    } catch {
      setError("Microphone access was denied or is unavailable.");
    }
  }, [loop]);

  useEffect(() => () => stop(), [stop]);

  return (
    <div className="rounded-2xl border border-jsu-navy/10 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-jsu-navy">On-device noise analysis</h2>
      <p className="mt-2 text-sm text-muted">
        Audio stays in your browser. We analyze level and stability to suggest how suitable
        your current spot is for studying—no recording is uploaded.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {!running ? (
          <button
            type="button"
            onClick={() => void start()}
            className="rounded-xl bg-jsu-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-jsu-blue"
          >
            Start microphone
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="rounded-xl border border-jsu-navy/20 bg-white px-5 py-2.5 text-sm font-semibold text-jsu-navy transition hover:bg-jsu-cream"
          >
            Stop
          </button>
        )}
      </div>
      {error && (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {running && focusScore != null && label && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-jsu-cream/80 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-jsu-navy/60">
              Focus suitability
            </p>
            <p className="mt-1 text-3xl font-bold text-jsu-navy">{focusScore}</p>
            <p className="mt-1 font-medium text-jsu-blue">{labelCopy[label].title}</p>
            <p className="text-sm text-muted">{labelCopy[label].detail}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-jsu-navy/10 p-4">
              <p className="text-xs text-muted">Level (dBFS-style)</p>
              <p className="text-xl font-semibold text-jsu-navy">{dbApprox ?? "—"}</p>
            </div>
            <div className="rounded-xl border border-jsu-navy/10 p-4">
              <p className="text-xs text-muted">Stability</p>
              <p className="text-xl font-semibold text-jsu-navy">
                {stability != null ? `${Math.round(stability * 100)}%` : "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
