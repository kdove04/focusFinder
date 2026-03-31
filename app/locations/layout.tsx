import { LiveMetricsProvider } from "@/components/LiveMetricsProvider";

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LiveMetricsProvider>{children}</LiveMetricsProvider>;
}
