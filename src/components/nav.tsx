import Link from "next/link";

import { SiteSearch } from "@/components/site-search";
import { buildSearchIndex } from "@/lib/build-search-index";
import { NAV, SITE } from "@/lib/constants";

export function Nav() {
  const searchIndex = buildSearchIndex();

  return (
    <header className="relative z-30 border border-red px-4 py-4 md:px-8 md:py-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 md:flex-nowrap md:gap-x-6 lg:gap-x-8">
        <Link
          href="/"
          className="order-1 shrink-0 font-display text-2xl tracking-[0.2em] md:text-3xl"
        >
          {SITE.name}
        </Link>

        <nav className="order-2 ml-auto shrink-0 flex flex-col items-end gap-1 md:order-3 md:flex-row md:gap-6">
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

        <SiteSearch
          items={searchIndex}
          inputId="header-search-input"
          className="site-search--header order-3 w-full min-w-0 basis-full md:order-2 md:w-auto md:max-w-md md:basis-auto md:flex-1 lg:max-w-lg xl:max-w-xl"
        />
      </div>
    </header>
  );
}
