import Link from "next/link";

const nav = [
  { href: "/locations", label: "Study spots" },
  { href: "/noise", label: "Noise check" },
  { href: "/contribute", label: "Share feedback" },
];

export function Header() {
  return (
    <header className="border-b border-jsu-navy/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-jsu-navy text-sm font-bold text-jsu-gold shadow-sm transition group-hover:bg-jsu-blue"
            aria-hidden
          >
            FF
          </span>
          <div className="leading-tight">
            <span className="block font-semibold text-jsu-navy">Focus Finder</span>
            <span className="text-xs text-muted">Jackson State University</span>
          </div>
        </Link>
        <nav className="flex flex-wrap gap-1 sm:gap-2" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-jsu-navy/80 transition hover:bg-jsu-cream hover:text-jsu-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
