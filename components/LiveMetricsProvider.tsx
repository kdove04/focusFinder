"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LiveMetric } from "@/lib/liveMetrics";

type Ctx = {
  byId: Record<string, LiveMetric>;
  refresh: () => Promise<void>;
  lastError: string | null;
};

const LiveMetricsContext = createContext<Ctx | null>(null);

export function LiveMetricsProvider({ children }: { children: ReactNode }) {
  const [byId, setById] = useState<Record<string, LiveMetric>>({});
  const [lastError, setLastError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/locations/status", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load live status");
      const data = (await res.json()) as { metrics: LiveMetric[] };
      const next: Record<string, LiveMetric> = {};
      for (const m of data.metrics) next[m.locationId] = m;
      setById(next);
      setLastError(null);
    } catch {
      setLastError("Could not refresh live data.");
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), 8000);
    return () => clearInterval(id);
  }, [refresh]);

  const value = useMemo(() => ({ byId, refresh, lastError }), [byId, refresh, lastError]);

  return (
    <LiveMetricsContext.Provider value={value}>{children}</LiveMetricsContext.Provider>
  );
}

export function useLiveMetrics() {
  const ctx = useContext(LiveMetricsContext);
  if (!ctx) {
    throw new Error("useLiveMetrics must be used within LiveMetricsProvider");
  }
  return ctx;
}
