import Link from "next/link";

import { HomeCharacter } from "@/components/home-character";
import { OutputSeedMeta } from "@/components/output-seed-meta";
import { NODES, SITE } from "@/lib/constants";

export function Nodes() {
  return (
    <footer className="mt-auto border-t border-red">
      <div className="grid md:grid-cols-[1fr_2fr]">
        <div className="cell relative flex items-stretch justify-between gap-4 overflow-hidden border-t-0 border-l-0 p-6 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/images/ddac0c7dc3e43217f48aeae9a967eb9d.gif')",
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-black/55" aria-hidden />
          <div className="relative z-10">
            <p className="font-display text-4xl tracking-wider md:text-5xl">
              {SITE.name}
            </p>
            <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-gray">
              {SITE.tagline}
            </p>
          </div>
          <p className="vertical-label relative z-10 max-h-[14rem] shrink-0 self-center py-4 pl-2 pr-0 text-[0.7rem] text-white/70 md:pl-3">
            The other side is overcrowded, the dead will have nowhere to go.
          </p>
        </div>
        <div className="cell border-t-0 border-r-0 p-6 md:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="meta mb-4">Nodes</p>
              <div className="flex flex-col gap-2">
                {NODES.map((node) => (
                  <Link
                    key={node.label}
                    href={node.href}
                    className="font-mono text-sm hover:text-red"
                  >
                    → {node.label}
                  </Link>
                ))}
              </div>
              <OutputSeedMeta />
            </div>
            <HomeCharacter />
          </div>
        </div>
      </div>
    </footer>
  );
}
