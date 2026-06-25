import Link from "next/link";
import type { ReactNode } from "react";

import {
  getToolBySlug,
  type RegistryTool,
} from "@/lib/tools-registry";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <h2>{title}</h2>
      {children}
    </>
  );
}

function RelatedTools({ slugs }: { slugs: string[] }) {
  const tools = slugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is RegistryTool => Boolean(t));

  if (tools.length === 0) return null;

  return (
    <ul>
      {tools.map((t) => (
        <li key={t.slug}>
          <Link href={`/tools/${t.slug}`}>{t.name}</Link>
          <span className="text-white/50"> — {t.description}</span>
        </li>
      ))}
    </ul>
  );
}

export function ToolDetailSections({ tool }: { tool: RegistryTool }) {
  const hasEnrichment =
    (tool.overview?.length ?? 0) > 0 ||
    (tool.useCases?.length ?? 0) > 0 ||
    (tool.commands?.length ?? 0) > 0 ||
    (tool.features?.length ?? 0) > 0 ||
    (tool.defense?.length ?? 0) > 0 ||
    (tool.related?.length ?? 0) > 0;

  return (
    <>
      {!hasEnrichment && <p>{tool.description}</p>}

      {hasEnrichment && (
        <>
          {tool.overview && tool.overview.length > 0 ? (
            <Section title="Overview">
              {tool.overview.map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </Section>
          ) : (
            <p>{tool.description}</p>
          )}

          {tool.useCases && tool.useCases.length > 0 && (
            <Section title="Primary use cases">
              <ul>
                {tool.useCases.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {tool.commands && tool.commands.length > 0 && (
            <Section title="Key commands">
              {tool.commands.map((cmd) => (
                <div key={cmd.label}>
                  <h3>{cmd.label}</h3>
                  <pre>
                    <code>{cmd.code}</code>
                  </pre>
                </div>
              ))}
            </Section>
          )}

          {tool.features && tool.features.length > 0 && (
            <Section title="Notable modules / features">
              <ul>
                {tool.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {tool.defense && tool.defense.length > 0 && (
            <Section title="Detection / defense notes">
              <ul>
                {tool.defense.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {tool.related && tool.related.length > 0 && (
            <Section title="Related tools">
              <RelatedTools slugs={tool.related} />
            </Section>
          )}
        </>
      )}

      {tool.metasploit && (
        <>
          <Section title="Modules">
            <div className="not-prose red-grid-2 my-8">
              {tool.metasploit.modules.map((mod) => (
                <div key={mod.type} className="bg-black p-6">
                  <p className="meta mb-2">{mod.type}</p>
                  <p className="font-serif text-sm leading-relaxed text-white/75">
                    {mod.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Interfaces">
            <dl className="not-prose grid border border-red md:grid-cols-2">
              {tool.metasploit.interfaces.map((iface) => (
                <div
                  key={iface.name}
                  className="border-b border-red p-6 md:border-b-0 md:odd:border-r"
                >
                  <dt className="font-mono text-sm uppercase tracking-wide text-red">
                    {iface.name}
                  </dt>
                  <dd className="mt-2 font-serif text-sm leading-relaxed text-white/75">
                    {iface.description}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        </>
      )}
    </>
  );
}
