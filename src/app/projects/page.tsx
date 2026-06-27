import { SlashMark } from "@/components/slash-mark";
import { PROJECTS, SITE } from "@/lib/constants";

export default function ProjectsPage() {
  return (
    <div>
      <div className="grid md:grid-cols-[3fr_1fr]">
        <div className="bg-red px-6 py-8 md:px-12">
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none text-black">
            PROJECTS
          </h1>
        </div>
        <div className="cell flex items-end border-r-0 border-t-0 p-6">
          <p className="font-mono text-xs text-justify text-white/50">
            {`my Future is Under construction`}
          </p>
        </div>
      </div>

      <SlashMark rows={2} className="px-4 py-4" />

      <div className="grid gap-px bg-red md:grid-cols-3">
        {PROJECTS.map((project) => (
          <article
            key={project.slug}
            id={project.slug}
            className="scroll-mt-20 bg-black p-8 md:p-10"
          >
            <div className="mb-6 flex items-start justify-between">
              <h2 className="font-display text-3xl md:text-4xl">{project.name}</h2>
              <span className="meta">{project.status}</span>
            </div>
            <p className="mb-6 text-justify font-serif text-white/80">
              {project.description}
            </p>
            <ul className="space-y-2">
              {project.features.map((f) => (
                <li key={f} className="font-mono text-xs text-gray">
                  → {f}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="cell border-x-0 p-8 md:p-12">
        <p className="meta mb-2">Contact</p>
        <a href={`mailto:${SITE.email}`} className="font-mono text-red hover:text-white">
          {SITE.email}
        </a>
      </div>
    </div>
  );
}

export const metadata = { title: "Projects" };
