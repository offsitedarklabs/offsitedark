import { SlashMark } from "@/components/slash-mark";
import { PROJECTS, SITE } from "@/lib/constants";

export default function ProjectsPage() {
  return (
    <div>
      <div className="bg-red px-6 py-8 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none text-black">
            PROJECTS
          </h1>
          <p className="meta text-black normal-case">my FUTURE is under development</p>
        </div>
      </div>

      <SlashMark rows={2} className="px-4 py-4" />

      <div className="red-grid-3">
        {PROJECTS.map((project) => (
          <article
            key={project.slug}
            id={project.slug}
            className={`scroll-mt-20 bg-black p-8 md:p-10${
              project.gif ? " group relative overflow-hidden" : ""
            }`}
          >
            {project.gif && (
              <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 transition-opacity group-hover:opacity-0"
                style={{ backgroundImage: `url('${project.gif}')` }}
                aria-hidden
              />
            )}
            <div className="relative z-10">
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
            </div>
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
