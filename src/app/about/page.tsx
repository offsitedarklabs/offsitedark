import Link from "next/link";

import { AsciiBlock } from "@/components/ascii-block";
import { SITE } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="grid items-stretch md:grid-cols-[auto_1fr]">
      <div className="cell relative w-full border-l-0 border-t-0 md:h-full md:w-fit md:min-h-0">
        <AsciiBlock file="manifesto.txt" sizeToContent />
      </div>
      <div className="cell border-r-0 border-t-0 p-6 md:p-12 md:pr-20">
        <h1 className="font-display mb-10 text-6xl md:text-8xl">ABOUT</h1>
        <div className="space-y-6 text-justify font-serif text-lg leading-relaxed">
          <p>
            <span className="text-red">OFFSITE.DARK</span>{" "}
            is an open source security research lab. It&apos;s also just a guy on X.
            We publish offensive
            and defensive cybersecurity research, malware analysis, and tooling —
            freely.
          </p>
          <p className="border-l-2 border-red pl-6 italic text-white/70">
            They want you afraid. We want you awake. They want you dependent. We
            want you free.
          </p>
          <p>
            Understanding the machine — its flaws, its defenses, its soul — is the
            first step toward true liberation.
          </p>
          <p className="border-l-2 border-red pl-6 italic text-white/60">
            Man is an individual only because of his intangible memory. But memory
            cannot be defined, yet it defines mankind.
          </p>
          <p className="font-mono text-sm text-gray">
            @offsitedark · Idea thinktank
          </p>
        </div>
        <div className="red-grid-2 mt-12">
          <div className="bg-black p-6">
            <p className="meta mb-2">Email</p>
            <a href={`mailto:${SITE.email}`} className="font-mono text-sm">
              {SITE.email}
            </a>
          </div>
          <div className="bg-black p-6">
            <p className="meta mb-2">Nodes</p>
            <Link href="/feed.xml" className="font-mono text-sm hover:text-red">
              → RSS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = { title: "About" };
