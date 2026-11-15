import { showAdinkra } from "@/data/culture";
import { KenteStrip, type KenteBand } from "./KenteStrip";

const HEIGHTS = {
  thin: "h-3 sm:h-4",
  wide: "h-5 sm:h-7",
} as const;

interface SeamProps {
  /** One band for a single strip, two for a pair sewn edge to edge. */
  bands: readonly KenteBand[];
  weight?: keyof typeof HEIGHTS;
  /** Spacing above the seam; the section after it brings its own. */
  className?: string;
}

/* ── Seam ── */
// A full-width strip between two sections, the way strips of cloth are sewn
// side by side. With the strips switched off it is one hairline in the same
// place. Decorative either way, so hidden from assistive tech.
export function Seam({ bands, weight = "wide", className = "" }: SeamProps) {
  if (!showAdinkra) {
    return <div aria-hidden="true" data-seam className={`border-t border-border ${className}`} />;
  }

  return (
    <div aria-hidden="true" data-seam className={className}>
      {bands.map((band) => (
        <KenteStrip key={band} band={band} className={`block w-full ${HEIGHTS[weight]}`} />
      ))}
    </div>
  );
}
