import Link from "next/link";

import { NODES, SITE } from "@/lib/constants";

export function Nodes() {
  return (
    <footer className="mt-auto border-t border-red">
      <div className="grid md:grid-cols-[1fr_2fr]">
        <div className="cell flex items-stretch justify-between gap-4 border-t-0 border-l-0 p-6 md:p-10">
          <div>
            <p className="font-display text-4xl tracking-wider md:text-5xl">
              {SITE.name}
            </p>
            <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-gray">
              {SITE.tagline}
            </p>
          </div>
          <p className="vertical-label max-h-[14rem] shrink-0 self-center py-4 pl-2 pr-0 text-[0.7rem] text-white/60 md:pl-3">
            The other side is overcrowded, the dead will have nowhere to go.
          </p>
        </div>
        <div className="cell border-t-0 border-r-0 p-6 md:p-10">
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
          <p className="meta mt-8">OUTPUT 317 · SEED: 3396188657</p>
        </div>
      </div>
    </footer>
  );
}
