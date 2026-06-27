import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-start justify-center px-8 md:px-20">
      <p className="font-display text-[10rem] leading-none text-red">404</p>
      <p className="mt-4 font-serif text-xl">Signal lost.</p>
      <Link href="/" className="meta mt-8 hover:text-white">
        → Home
      </Link>
    </div>
  );
}
