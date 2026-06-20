import Image from "next/image";

export function HomeCharacter() {
  return (
    <figure
      className="shrink-0 self-end border border-red bg-black shadow-[6px_6px_0_0_var(--red)] md:shadow-[8px_8px_0_0_var(--red)]"
      aria-hidden
    >
      <Image
        src="/images/character.png"
        alt=""
        width={400}
        height={400}
        className="block h-[clamp(8.5rem,32vw,13rem)] w-[clamp(8.5rem,32vw,13rem)] object-cover object-top contrast-[1.15] md:h-[16rem] md:w-[16rem] lg:h-[18rem] lg:w-[18rem]"
      />
    </figure>
  );
}
