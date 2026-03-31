import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="space-y-14">
      <section className="rounded-3xl border border-jsu-navy/10 bg-gradient-to-br from-white via-white to-jsu-cream/50 px-6 py-12 shadow-sm sm:px-10 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-jsu-gold">
          Jackson State University
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-jsu-navy sm:text-4xl">
          Find your next deep-work spot on campus
        </h1>
        <p className="mt-4 max-w-xl text-lg text-jsu-navy/80">
          Focus Finder combines live busyness and noise signals with student feedback so you can pick
          a study location that matches how you work today.
        </p>
        {!session && (
          <p className="mt-4 max-w-xl rounded-lg border border-jsu-navy/10 bg-white/80 px-4 py-3 text-sm text-jsu-navy/90">
            Sign in with your <strong>JSU Microsoft 365</strong> account (
            <span className="whitespace-nowrap">JNumber@students.jsums.edu</span>) to browse spots,
            run the noise check, and share feedback.
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          {session ? (
            <>
              <Link
                href="/locations"
                className="rounded-xl bg-jsu-navy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-jsu-blue"
              >
                Browse study locations
              </Link>
              <Link
                href="/noise"
                className="rounded-xl border border-jsu-navy/20 bg-white px-6 py-3 text-sm font-semibold text-jsu-navy transition hover:bg-jsu-cream"
              >
                Check noise where you are
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-jsu-navy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-jsu-blue"
            >
              Sign in with JSU
            </Link>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-jsu-navy">How it works</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          <li className="rounded-2xl border border-jsu-navy/10 bg-white p-5 shadow-sm">
            <span className="text-2xl" aria-hidden>
              📡
            </span>
            <h3 className="mt-3 font-semibold text-jsu-navy">Real-time signals</h3>
            <p className="mt-2 text-sm text-muted">
              See updating noise and busyness estimates per location (demo uses smart simulation;
              swap in Wi‑Fi, sensors, or room booking feeds later).
            </p>
          </li>
          <li className="rounded-2xl border border-jsu-navy/10 bg-white p-5 shadow-sm">
            <span className="text-2xl" aria-hidden>
              🎧
            </span>
            <h3 className="mt-3 font-semibold text-jsu-navy">Noise analysis</h3>
            <p className="mt-2 text-sm text-muted">
              Use your device microphone for on-device analysis—levels and stability inform a focus
              score without uploading audio.
            </p>
          </li>
          <li className="rounded-2xl border border-jsu-navy/10 bg-white p-5 shadow-sm">
            <span className="text-2xl" aria-hidden>
              ✍️
            </span>
            <h3 className="mt-3 font-semibold text-jsu-navy">Student input</h3>
            <p className="mt-2 text-sm text-muted">
              Rate spots and note how loud it felt so classmates see recent, human context—not just
              numbers.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
