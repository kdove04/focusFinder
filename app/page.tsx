import { Suspense } from "react";
import { AuthLanding } from "@/components/AuthLanding";

export default function LandingPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-muted" aria-live="polite">
          Loading…
        </p>
      }
    >
      <AuthLanding />
    </Suspense>
  );
}
