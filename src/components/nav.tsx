import Link from "next/link";

import { NavScroll } from "@/components/nav-scroll";
import { SiteSearch } from "@/components/site-search";
import { buildSearchIndex } from "@/lib/build-search-index";
import { NAV, SITE } from "@/lib/constants";

// Was: text-[0.65rem] tracking-widest, no vertical padding.
// py-2 + leading-5 gives ~36px tap targets; on phones the links flow in a
// wrapping row under the logo instead of a tall stacked column.
const NAV_LINK_CLASS =
  "py-2 font-mono text-sm leading-5 uppercase tracking-[0.12em] text-gray hover:text-red md:text-[0.8125rem] md:tracking-widest xl:text-sm xl:tracking-[0.12em]";

export function Nav() {
  const searchIndex = buildSearchIndex();

  return (
    <header className="site-header sticky top-0 z-40 border border-red px-4 py-4 md:px-8 md:py-6">
      <NavScroll />
      <div className="site-header-inner flex flex-wrap items-center gap-x-4 gap-y-3 md:gap-x-6 lg:flex-nowrap lg:gap-x-8">
        <Link
          href="/"
          className="site-header-logo order-1 shrink-0 font-display text-2xl tracking-[0.2em] md:text-3xl"
        >
          {SITE.name}
        </Link>

        <nav className="site-header-nav order-3 w-full basis-full shrink-0 flex flex-row flex-wrap items-end gap-x-3.5 gap-y-0 md:order-2 md:ml-auto md:w-auto md:basis-auto md:flex-nowrap md:gap-4 lg:order-3 lg:gap-5 xl:gap-7">
          {NAV.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={NAV_LINK_CLASS}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={NAV_LINK_CLASS}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <SiteSearch
          items={searchIndex}
          inputId="header-search-input"
          className="site-search--header order-3 w-full min-w-0 basis-full lg:order-2 lg:w-auto lg:max-w-lg lg:basis-auto lg:flex-1 xl:max-w-xl"
        />
      </div>
    </header>
  );
}
