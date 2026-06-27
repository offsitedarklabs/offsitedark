import { ReactNode } from "react";

interface SectionBlockProps {
  label: string;
  title: string;
  children: ReactNode;
  output: number;
  seed: number;
  className?: string;
}

export function SectionBlock({
  label,
  title,
  children,
  output,
  seed,
  className = "",
}: SectionBlockProps) {
  return (
    <section className={`cell p-6 md:p-10 ${className}`}>
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <p className="meta">{label}</p>
        <p className="meta">
          OUTPUT {output} · SEED: {seed}
        </p>
      </div>
      <h2 className="font-display mb-8 text-5xl leading-none tracking-wide text-white md:text-7xl lg:text-8xl">
        {title}
      </h2>
      <div className="max-w-prose font-serif text-base leading-relaxed text-white/90 md:text-lg">
        {children}
      </div>
    </section>
  );
}
