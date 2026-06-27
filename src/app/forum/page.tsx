import Link from "next/link";

export default function ForumPage() {
  return (
    <div className="grid min-h-[60vh] md:grid-cols-2">
      <div className="bg-red flex flex-col justify-end p-8 md:p-12">
        <p className="meta text-black/50">Phase 2</p>
        <h1 className="font-display text-[clamp(4rem,12vw,9rem)] leading-none text-black">
          FORUM
        </h1>
      </div>
      <div className="cell flex flex-col justify-center border-r-0 border-t-0 p-8 md:p-16">
        <p className="font-serif text-xl italic text-white/70">
          Signal not yet established. Threaded boards and ranked posts — incoming.
        </p>
        <p className="meta mt-6">STATUS: POSTGRES + AUTH TBD</p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/research"
            className="border border-red px-5 py-3 font-mono text-xs uppercase tracking-widest hover:bg-red"
          >
            Research
          </Link>
          <Link
            href="/news"
            className="font-mono text-xs uppercase tracking-widest text-gray hover:text-red"
          >
            Signals
          </Link>
        </div>
      </div>
    </div>
  );
}

export const metadata = { title: "Forum" };
