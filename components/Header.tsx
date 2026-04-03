import Image from "next/image";
import Link from "next/link";
import { jsuLogo } from "@/lib/brandAssets";

const nav = [
  { href: "/locations", label: "Study spots" },
  { href: "/noise", label: "Noise check" },
  { href: "/contribute", label: "Share feedback" },
];

export function Header() {
  return (
    <header className="border-b border-jsu-navy/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <Image
            src={jsuLogo.src}
            alt={jsuLogo.alt}
            width={jsuLogo.width}
            height={jsuLogo.height}
            className="h-9 w-auto shrink-0 object-contain object-left sm:h-10"
            priority
            sizes="(max-width: 640px) 200px, 240px"
          />
          <div className="min-w-0 leading-tight">
            <span className="block font-semibold text-jsu-navy">Focus Finder</span>
            <span className="text-xs text-muted">Study spaces on campus</span>
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
