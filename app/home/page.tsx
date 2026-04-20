import Image from "next/image";
import Link from "next/link";
import { campusPhotos } from "@/lib/brandAssets";

const [heroPhoto, ...galleryPhotos] = campusPhotos;

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="overflow-hidden rounded-3xl border border-jsu-navy/10 bg-gradient-to-br from-white via-white to-jsu-cream/50 shadow-sm">
        <div className="grid gap-0 lg:grid-cols-2 lg:gap-0">
          <div className="px-6 py-10 sm:px-10 sm:py-14 lg:flex lg:flex-col lg:justify-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-jsu-gold">
              Jackson State University
            </p>
            <h1 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-jsu-navy sm:text-4xl">
              Find your next deep-work spot on campus
            </h1>
            <p className="mt-4 max-w-xl text-lg text-jsu-navy/80">
              Focus Finder combines live busyness and noise signals with student feedback so you can
              pick a study location that matches how you work today.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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
            </div>
          </div>
          <div className="relative min-h-[220px] lg:min-h-[320px]">
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jsu-navy/50 via-transparent to-transparent lg:bg-gradient-to-l" />
            <p className="absolute bottom-3 left-3 right-3 text-left text-xs font-medium text-white drop-shadow sm:bottom-4 sm:left-4 sm:text-sm">
              {heroPhoto.caption}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="campus-gallery-heading">
        <h2 id="campus-gallery-heading" className="text-xl font-semibold text-jsu-navy">
          Campus in view
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Real places Tigers pass every day—same spirit as the spots you rate inside Focus Finder.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {galleryPhotos.map((photo) => (
            <figure
              key={photo.src}
              className="overflow-hidden rounded-2xl border border-jsu-navy/10 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <figcaption className="border-t border-jsu-navy/10 px-4 py-3 text-sm">
                <span className="font-medium text-jsu-navy">{photo.caption}</span>
                <span className="mt-1 block text-xs text-muted">
                  {photo.credit} · {photo.license}
                </span>
              </figcaption>
            </figure>
          ))}
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
