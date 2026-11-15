import Image from "next/image";

interface Shot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ScreenshotPairProps {
  desktop: Shot;
  mobile: Shot;
  /** True for the pair at the top of a page, so it is not lazy-loaded. */
  priority?: boolean;
}

/* ── Screenshot pair ── */
// A real desktop capture with the phone capture set over its corner.
// Plain hairline frames: no drawn browser bar, no device shell.
export function ScreenshotPair({ desktop, mobile, priority = false }: ScreenshotPairProps) {
  return (
    <figure data-pair className="relative pb-[9%] pr-[5%]">
      <Image
        src={desktop.src}
        alt={desktop.alt}
        width={desktop.width}
        height={desktop.height}
        priority={priority}
        sizes="(min-width: 1024px) 54vw, 95vw"
        className="h-auto w-full border border-border"
      />
      <Image
        src={mobile.src}
        alt={mobile.alt}
        width={mobile.width}
        height={mobile.height}
        data-pair-mobile
        sizes="(min-width: 1024px) 13vw, 23vw"
        className="absolute bottom-0 right-0 h-auto w-[23%] border border-border bg-background"
      />
    </figure>
  );
}
