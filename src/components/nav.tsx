import Link from "next/link";

import { NAV, SITE } from "@/lib/constants";

export function Nav() {
  return (
    <header className="relative z-10 flex items-center justify-between px-4 py-6 md:px-8 md:py-10">
      <Link href="/" className="font-display text-2xl tracking-[0.2em] md:text-3xl">
        {SITE.name}
      </Link>
      <nav className="flex flex-col items-end gap-1 md:flex-row md:gap-6">
        {NAV.map((item) =>
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.65rem] uppercase tracking-widest text-gray hover:text-red"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="font-mono text-[0.65rem] uppercase tracking-widest text-gray hover:text-red"
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>
    </header>
  );
}
