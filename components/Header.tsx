import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { jsuLogo } from "@/lib/brandAssets";
import { SignOutButton } from "@/components/SignOutButton";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

const nav = [
  { href: "/home", label: "Home" },
  { href: "/user", label: "Profile" },
  { href: "/locations", label: "Spots" },
  { href: "/noise", label: "Noise" },
  { href: "/contribute", label: "Feedback" },
];

export async function Header() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  return (
    <header className="border-b border-jsu-navy/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href={session ? "/home" : "/"}
          className="group flex min-w-0 flex-1 items-center gap-3 sm:gap-4"
        >
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
        {session ? (
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
            <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2" aria-label="Main">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md border border-transparent px-2.5 py-1.5 text-sm font-medium text-jsu-navy/80 transition hover:border-jsu-navy/10 hover:bg-jsu-cream hover:text-jsu-navy"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <SignOutButton />
          </div>
        ) : (
          <p className="text-sm text-muted">
            <span className="hidden sm:inline">Sign in below to use the app.</span>
          </p>
        )}
      </div>
    </header>
  );
}
