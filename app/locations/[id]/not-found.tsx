import Link from "next/link";

export default function LocationNotFound() {
  return (
    <div className="rounded-2xl border border-jsu-navy/10 bg-white p-10 text-center shadow-sm">
      <h1 className="text-xl font-semibold text-jsu-navy">Location not found</h1>
      <p className="mt-2 text-sm text-muted">That study spot is not in our list yet.</p>
      <Link
        href="/locations"
        className="mt-6 inline-block rounded-xl bg-jsu-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-jsu-blue"
      >
        Back to all locations
      </Link>
    </div>
  );
}
