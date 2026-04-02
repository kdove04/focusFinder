import Link from "next/link";
import { jsuLogo } from "@/lib/brandAssets";

export function SiteFooter() {
  return (
    <footer className="border-t border-jsu-navy/10 bg-white/70 py-8 text-center text-xs text-muted sm:text-sm">
      <p className="mx-auto max-w-3xl px-4">
        Built for JSU students. Live metrics are simulated for demo; plug in campus sensors or
        reservations data when available.
      </p>
      <p className="mx-auto mt-4 max-w-3xl px-4 leading-relaxed">
        Campus photos:{" "}
        <span className="text-jsu-navy/80">2C2K Photography</span> (
        <Link
          href="https://creativecommons.org/licenses/by/2.0/"
          className="text-jsu-blue underline hover:no-underline"
        >
          CC BY 2.0
        </Link>
        ) and <span className="text-jsu-navy/80">Comingdeer</span> (
        <Link
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          className="text-jsu-blue underline hover:no-underline"
        >
          CC BY-SA 4.0
        </Link>
        ) via{" "}
        <Link
          href="https://commons.wikimedia.org/wiki/Category:Jackson_State_University"
          className="text-jsu-blue underline hover:no-underline"
        >
          Wikimedia Commons
        </Link>
        . University wordmark:{" "}
        <Link href={jsuLogo.commonsUrl} className="text-jsu-blue underline hover:no-underline">
          Commons file page
        </Link>
        ; may be subject to trademark—see{" "}
        <Link
          href="https://www.jsums.edu/universitycommunications/"
          className="text-jsu-blue underline hover:no-underline"
        >
          University Communications
        </Link>{" "}
        for official use.
      </p>
    </footer>
  );
}
