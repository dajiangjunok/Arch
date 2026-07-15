import Image from "next/image";
import Link from "next/link";

type BrandLockupProps = {
  className?: string;
  priority?: boolean;
  size?: "compact" | "hero";
};

const sizes = {
  compact: {
    root: "w-[min(66vw,21rem)]",
    icon: "w-10 sm:w-14",
    divider: "h-14 sm:h-[4.5rem]",
    word: "text-[0.72rem] sm:text-base",
    rule: "mt-2 h-[3px] w-9 sm:mt-3 sm:w-12",
    tagline: "mt-2 text-[0.68rem] sm:text-sm",
  },
  hero: {
    root: "w-[min(84vw,22rem)] sm:w-[21rem] md:w-[25rem] lg:w-[32rem]",
    icon: "w-14 sm:w-16 md:w-20 lg:w-24",
    divider: "h-[4.5rem] sm:h-20 md:h-24 lg:h-28",
    word: "text-base sm:text-lg md:text-2xl lg:text-3xl",
    rule: "mt-3 h-1 w-12 sm:mt-4 sm:w-16",
    tagline: "mt-3 text-sm sm:text-base md:text-lg lg:text-xl",
  },
} as const;

export function BrandLockup({ className = "", priority = false, size = "compact" }: BrandLockupProps) {
  const style = sizes[size];

  return (
    <Link
      href="/"
      aria-label="The Arch home"
      className={`group inline-flex min-w-0 items-center gap-4 text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold focus-visible:ring-offset-4 sm:gap-5 ${style.root} ${className}`}
    >
      <Image
        src="/logo.png"
        alt=""
        aria-hidden="true"
        width={504}
        height={600}
        priority={priority}
        className={`h-auto shrink-0 mix-blend-multiply transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none ${style.icon}`}
      />
      <span className={`block w-px shrink-0 bg-navy ${style.divider}`} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className={`block whitespace-nowrap font-sans font-semibold uppercase leading-none tracking-[0.46em] ${style.word}`}>
          The Arch
        </span>
        <span className={`block bg-marigold ${style.rule}`} aria-hidden="true" />
        <span className={`block font-serif font-normal leading-none tracking-normal ${style.tagline}`}>
          A bridge is worth what crosses it.
        </span>
      </span>
    </Link>
  );
}
