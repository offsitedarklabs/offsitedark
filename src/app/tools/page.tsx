import { ToolsIndex } from "@/components/tools-index";
import { getKaliTools } from "@/lib/kali-tools";
import { METASPLOIT_SECTION } from "@/lib/tools-data";
import {
  getExternalToolListItems,
  getPopularToolListItems,
} from "@/lib/tools-registry";

export default function ToolsPage() {
  const kali = getKaliTools();
  const popularTools = getPopularToolListItems();
  const externalTools = getExternalToolListItems();

  return (
    <div>
      <div className="bg-red px-4 py-6 md:px-8">
        <p className="meta text-black/60">Reference Index</p>
        <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none text-black">
          TOOLS
        </h1>
      </div>

      <div className="cell border-x-0 px-6 py-4 md:px-10">
        <p className="max-w-3xl font-serif text-base italic leading-relaxed text-white/60 md:text-lg">
          Field reference for offensive and defensive tooling. Curated market
          tools, framework internals, external archives, and a practitioner
          shortlist of Kali Linux essentials.
        </p>
      </div>

      <ToolsIndex
        popularTools={popularTools}
        externalTools={externalTools}
        kaliCategories={kali.categories}
        kaliToolCount={kali.toolCount}
        metasploitSection={METASPLOIT_SECTION}
      />
    </div>
  );
}

export const metadata = {
  title: "Tools",
  description:
    "Cybersecurity tools reference: popular market tools, Metasploit internals, research archives, and curated Kali Linux essentials.",
};
