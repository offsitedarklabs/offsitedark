import Image from "next/image";
import Link from "next/link";

import { AsciiBlock } from "@/components/ascii-block";
import { EntryRow } from "@/components/entry-row";
import { SectionBlock } from "@/components/section-block";
import { SlashMark } from "@/components/slash-mark";
import { getLatestNews, getLatestResearch } from "@/lib/content";
import { PROJECTS } from "@/lib/constants";

export default function HomePage() {
  const research = getLatestResearch(4);
  const news = getLatestNews(4);

  return (
    <div>
      {/* brutalist hero grid */}
      <div className="grid items-stretch border-b border-red md:grid-cols-[1.2fr_1fr]">
        {/* left — oversized title block */}
        <div className="cell relative border-l-0 border-t-0 p-6 pt-2 md:p-10 md:pl-8">
          <figure
            className="absolute top-6 right-6 z-10 shrink-0 border border-red bg-black shadow-[6px_6px_0_0_var(--red)] md:top-10 md:right-10 md:shadow-[8px_8px_0_0_var(--red)]"
            aria-hidden
          >
            <Image
              src="/images/character.png"
              alt=""
              width={400}
              height={400}
              priority
              className="block h-[clamp(8.5rem,32vw,13rem)] w-[clamp(8.5rem,32vw,13rem)] object-cover object-top contrast-[1.15] md:h-[16rem] md:w-[16rem] lg:h-[18rem] lg:w-[18rem]"
            />
          </figure>
          <p className="meta mb-8 flex gap-6">
            <span>Think</span>
            <span>Of</span>
            <span>Yourself</span>
          </p>
          <div className="relative w-full overflow-visible">
            <h1 className="min-w-0 font-display text-[clamp(4rem,15vw,11rem)] leading-[0.85] tracking-tight text-white">
              OFFSITE
              <br />
              DARK
            </h1>
          </div>
          <p className="mt-8 max-w-lg text-justify font-serif text-xl leading-relaxed text-white/70 md:max-w-xl md:text-2xl">
            Open source security research lab. Malware analysis, offensive tooling,
            and the relentless pursuit of understanding the machine.
          </p>
          <p className="meta mt-10 text-xl md:text-2xl">
            あなただけが重要です | Только ты важен
          </p>
          <p className="mt-16 ml-auto max-w-sm text-right font-serif text-sm italic leading-relaxed text-white/55 md:max-w-md md:text-base">
            The physical body exists at a less evolved plane only to verify one&apos;s
            existence in the universe
          </p>
        </div>

        {/* right — ascii fills cell */}
        <div className="cell relative flex min-h-[320px] h-full border-r-0 border-t-0 md:min-h-0">
          <p className="vertical-label absolute left-2 top-6 z-10 text-red md:left-4">
            Signal
          </p>
          <div className="h-full min-h-0 w-full pl-10 md:pl-14">
            <AsciiBlock />
          </div>
        </div>
      </div>

      <div className="cell border-x-0 px-6 py-3 md:px-10">
        <p className="font-mono text-[0.65rem] tracking-widest text-gray">
          Don&apos;t talk to me like I&apos;m a machine, I&apos;m not that.
        </p>
      </div>

      {/* pride bar — full bleed red */}
      <div className="bg-red px-4 py-4 md:px-8 md:py-6">
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <p className="font-display text-[clamp(3rem,12vw,8rem)] leading-none tracking-tight text-black">
            RESEARCH
          </p>
          <p className="font-mono leading-tight tracking-wider text-black/70 md:pb-2 md:text-right">
            <span className="block text-sm md:text-base">present day</span>
            <span className="block text-xl md:text-3xl">PRESENT TIME HAHAHAHAHAHA</span>
          </p>
        </div>
      </div>

      {/* asymmetric two-column content */}
      <div className="grid md:grid-cols-[2fr_3fr]">
        <div className="cell border-l-0 border-t-0 p-0">
          <div className="border-b border-red px-6 py-8 md:px-10">
            <p className="vertical-label mb-6 text-red md:hidden">Archive</p>
            <p className="meta mb-4">Latest Research</p>
            {research.map((post) => (
              <EntryRow key={post.slug} post={post} />
            ))}
            <Link
              href="/research"
              className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-red hover:text-white"
            >
              → All research
            </Link>
            <p className="mt-10 -mr-2 max-w-sm font-serif text-lg italic leading-relaxed text-white/70 md:ml-8 md:text-xl">
              If you&apos;re not remembered, then you never existed
            </p>
          </div>
          <div className="px-6 py-8 md:px-10">
            <p className="meta mb-4">Signals</p>
            {news.map((post) => (
              <EntryRow key={post.slug} post={post} />
            ))}
            <Link
              href="/news"
              className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-red hover:text-white"
            >
              → All signals
            </Link>
            <p className="meta mt-8 text-white/40">
              I promise you I&apos;ll always be right here. I&apos;m right next to you,
              forever.
            </p>
          </div>
        </div>

        <div className="cell border-r-0 border-t-0">
          <p className="border-b border-red px-6 py-4 font-serif text-sm italic text-red md:px-10">
            Why are you crying, Human?
          </p>
          <SectionBlock
            label="Language Models"
            title="Security Research"
            output={96}
            seed={3573860127}
            className="border-0"
          >
            <p>
              OFFSITE.DARK aims to be a leader in open source offensive security research.
              We publish malware analysis, reversing techniques, and tooling —
              supporting unrestricted availability and use for education and defense.
            </p>
          </SectionBlock>

          <p className="border-t border-red px-6 py-6 text-justify font-lain text-xl leading-relaxed text-white/70 md:px-10 md:text-2xl">
            What isn&apos;t remembered never happened; memory is merely a record, you
            just need to rewrite that record.
          </p>

          <div className="border-t border-red px-6 py-8 md:px-10">
            <p className="meta mb-6">Projects</p>
            <div className="grid gap-px bg-red md:grid-cols-3">
              {PROJECTS.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects#${p.slug}`}
                  className="bg-black p-5 hover:bg-red group"
                >
                  <p className="font-display text-2xl group-hover:text-black">
                    {p.name}
                  </p>
                  <p className="meta mt-2 group-hover:text-black">{p.status}</p>
                </Link>
              ))}
            </div>
            <p className="mt-6 max-w-md font-mono text-[0.65rem] leading-relaxed text-gray">
              It&apos;s a new club that plays really great hardcore techno for a
              really hip young crowd!
            </p>
          </div>
        </div>
      </div>

      <p className="cell border-x-0 px-6 py-4 text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-red md:px-10">
        no matter where you are, every one is always CONNECTED
      </p>

      <SectionBlock
        label="Commitment to Development"
        title="Artificial Intelligence Made Human"
        output={288}
        seed={2226809351}
        className="border-x-0"
      >
        <p>
          Our mission is to advance understanding of systems — their flaws, their
          defenses, their soul — by creating and proliferating open source security
          research and furthering its scientific understanding.
        </p>
        <p className="mt-4 text-justify text-sm text-white/60">
          Idea thinktank of @offsitedark. Firewall, World, AI — work in progress.
          Forum incoming.
        </p>
      </SectionBlock>
    </div>
  );
}
