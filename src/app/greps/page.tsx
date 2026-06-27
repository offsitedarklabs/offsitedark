import { GrepsLedger } from "@/components/greps-ledger";
import { getGrepPosts } from "@/lib/content";

export default function GrepsPage() {
  const posts = getGrepPosts();

  return (
    <div>
      <div className="bg-red px-4 py-6 md:px-8">
        <p className="meta text-black/60">Community Index</p>
        <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none text-black">
          GREPS
        </h1>
      </div>

      <div className="cell border-x-0 px-6 py-4 md:px-10">
        <p className="max-w-3xl font-serif text-base italic leading-relaxed text-white/60 md:text-lg">
          Third-party models indexed from Hugging Face — including releases from
          research labs such as Kanti Labs — for security research inquiry.
          OFFSITE.DARK does not upload, release, or endorse these artifacts — we
          track what the community publishes and ask whether it has research
          value.
        </p>
      </div>

      <GrepsLedger
        posts={posts.map(
          ({
            slug,
            title,
            date,
            excerpt,
            author,
            category,
            tags,
            hfModelId,
            hfUrl,
            downloads,
            likes,
            pipelineTag,
          }) => ({
            slug,
            title,
            date,
            excerpt,
            author,
            category,
            tags,
            hfModelId,
            hfUrl,
            downloads,
            likes,
            pipelineTag,
          }),
        )}
      />
    </div>
  );
}

export const metadata = {
  title: "Greps",
  description:
    "Community Hugging Face uploads indexed for security research inquiry.",
};
