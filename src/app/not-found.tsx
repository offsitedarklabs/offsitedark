import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <div className="grid md:grid-cols-2">
      <div className="cell flex min-h-[50vh] flex-col justify-between border-x-0 border-t-0 p-6 md:p-10 md:pl-8">
        <div>
          <p className="meta mb-6 flex gap-4">
            <span>Route</span>
            <span>Null</span>
          </p>
          <h1
            className="not-found-code font-display text-[clamp(5rem,18vw,12rem)] leading-[0.85] tracking-tight text-red"
            aria-label="404"
          >
            404
          </h1>
          <p className="mt-6 max-w-md font-serif text-xl leading-relaxed text-white/80 md:text-2xl">
            The address you entered resolves to nothing.
          </p>
          <p className="mt-4 max-w-md font-serif text-base italic leading-relaxed text-white/50">
            Or it did. The network remembers paths that no longer exist.
          </p>
        </div>

        <div className="mt-12 md:mt-0">
          <p className="font-lain text-2xl text-red/80 md:text-3xl">
            あなたはここにいない
          </p>
          <p className="meta mt-6 text-sm">
            STATUS::UNREACHABLE · SIGNAL::LOST
          </p>
          <Link href="/" className="meta mt-8 inline-block hover:text-white">
            → Return to surface
          </Link>
        </div>
      </div>

      <div className="cell flex items-center justify-center border-r-0 border-t-0 p-6 md:p-10">
        <img src="/images/not-found.png" alt="" className="max-w-full h-auto" />
      </div>
      </div>

      <div className="cell border-x-0 px-6 py-3 md:px-10">
        <p className="font-mono text-[0.65rem] tracking-widest text-gray">
          No matter where you go, everyone&apos;s connected.
        </p>
      </div>
    </div>
  );
}
