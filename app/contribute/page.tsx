import { Suspense } from "react";
import { ContributeClient } from "./ContributeClient";

function ContributeFallback() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded bg-jsu-navy/10" />
      <div className="h-4 max-w-md rounded bg-jsu-navy/10" />
      <div className="h-64 rounded-2xl bg-jsu-navy/5" />
    </div>
  );
}

export default function ContributePage() {
  return (
    <Suspense fallback={<ContributeFallback />}>
      <ContributeClient />
    </Suspense>
  );
}
