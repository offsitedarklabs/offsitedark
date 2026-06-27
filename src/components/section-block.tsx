import { ReactNode } from "react";

import { OutputSeedMeta } from "@/components/output-seed-meta";

interface SectionBlockProps {
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function SectionBlock({
  label,
  title,
  children,
  className = "",
}: SectionBlockProps) {
  return (
    <section className={`cell p-6 md:p-10 ${className}`}>
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <p className="meta">{label}</p>
        <OutputSeedMeta className="meta" />
      </div>
      <h2 className="section-title mb-8 text-white">
        {title}
      </h2>
      <div className="max-w-prose font-serif text-lg leading-relaxed text-white/90 md:text-xl">
        {children}
      </div>
    </section>
  );
}
