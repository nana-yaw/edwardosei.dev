import type { ReactElement } from "react";
import type { SymbolId } from "@/data/buildFlow";

/* ── Adinkra symbols ── */
// Six original redraws of the traditional forms, each in a 100 by 100 box and
// in one colour (currentColor). They were drawn from scratch against published
// depictions, not traced, so keep any change faithful to the form: a symbol
// that reads as a different one is worse than no symbol.

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const round = (value: number) => Math.round(value * 100) / 100;

/* Nkyimu: the guide lines sit just under the frame so no gap shows. */
const GUIDE_LOW = 8;
const GUIDE_HIGH = 92;
// Four fine lines to a band, as the cloth is ruled.
const GUIDE_OFFSETS = [-6.9, -2.3, 2.3, 6.9];

// A line falling left to right: y = x + shift.
function fallingGuide(shift: number): Segment {
  return shift >= 0
    ? { x1: GUIDE_LOW, y1: GUIDE_LOW + shift, x2: GUIDE_HIGH - shift, y2: GUIDE_HIGH }
    : { x1: GUIDE_LOW - shift, y1: GUIDE_LOW, x2: GUIDE_HIGH, y2: GUIDE_HIGH + shift };
}

// A line rising left to right: x + y = sum.
function risingGuide(sum: number): Segment {
  return sum <= 100
    ? { x1: GUIDE_LOW, y1: sum - GUIDE_LOW, x2: sum - GUIDE_LOW, y2: GUIDE_LOW }
    : { x1: sum - GUIDE_HIGH, y1: GUIDE_HIGH, x2: GUIDE_HIGH, y2: sum - GUIDE_HIGH };
}

// One band down the main diagonal with a short one in each far corner,
// crossed by two bands the other way.
const NKYIMU_GUIDES: readonly Segment[] = [
  ...[-54, 0, 54].flatMap((band) => GUIDE_OFFSETS.map((offset) => fallingGuide(band + offset))),
  ...[73, 127].flatMap((band) => GUIDE_OFFSETS.map((offset) => risingGuide(band + offset))),
];

function Nkyimu() {
  return (
    <>
      <rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" strokeWidth="10" />
      <g stroke="currentColor" strokeWidth="1.6">
        {NKYIMU_GUIDES.map((guide, index) => (
          <line
            key={index}
            x1={round(guide.x1)}
            y1={round(guide.y1)}
            x2={round(guide.x2)}
            y2={round(guide.y2)}
          />
        ))}
      </g>
    </>
  );
}

/* Ananse Ntontan: seven wedges, one pointing straight down, round a ring. */
const SPOKE_ANGLES = Array.from({ length: 7 }, (_, index) => round((index * 360) / 7));

function AnanseNtontan() {
  return (
    <>
      {SPOKE_ANGLES.map((angle) => (
        <path key={angle} d="M45 63 L55 63 L62.5 98 L37.5 98 Z" transform={`rotate(${angle} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="11.5" fill="none" stroke="currentColor" strokeWidth="8" />
    </>
  );
}

/* Fihankra: one crescent wall drawn once and placed four times. The slit
   between neighbouring horns ends in a round and the walls join just inside
   it. The top and bottom walls carry the small feet in the courtyard corners. */
const FIHANKRA_WALL =
  "M12 2.4 Q50 23 88 2.4 Q90.8 3 90.2 5.8 Q85.5 11.6 81.6 15.2 L77.9 18.9 Q76.6 20.5 77.9 22.1 L79.5 26 L75 25.6 Q50 27.4 25 25.6 L20.5 26 L22.1 22.1 Q23.4 20.5 22.1 18.9 L18.4 15.2 Q14.5 11.6 9.8 5.8 Q9.2 3 12 2.4 Z";
const FIHANKRA_FEET = "M35 26 L32.6 30.8 M65 26 L67.4 30.8";

function FihankraWallWithFeet() {
  return (
    <>
      <path d={FIHANKRA_WALL} />
      <path d={FIHANKRA_FEET} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </>
  );
}

function Fihankra() {
  return (
    <>
      <FihankraWallWithFeet />
      <g transform="rotate(180 50 50)">
        <FihankraWallWithFeet />
      </g>
      {/* Swapping x and y turns the top wall into the left one. */}
      <path d={FIHANKRA_WALL} transform="matrix(0 1 1 0 0 0)" />
      <path d={FIHANKRA_WALL} transform="rotate(180 50 50) matrix(0 1 1 0 0 0)" />
    </>
  );
}

/* Bese Saka: four petals on the diagonals, each with a stalk and a seed,
   round a ring. The petal is drawn pointing up and turned into place. */
const PETAL =
  "M50 36.5 C44 34 33 28 32.5 16 C32 4.5 39 -7.5 50 -7.5 C61 -7.5 68 4.5 67.5 16 C67 28 56 34 50 36.5 Z";

function BeseSaka() {
  return (
    <>
      {[45, 135, 225, 315].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <path d={PETAL} fill="none" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" />
          <path d="M50 38 L50 13" fill="none" stroke="currentColor" strokeWidth="3.8" />
          <circle cx="50" cy="12" r="5.4" />
        </g>
      ))}
      <circle cx="50" cy="50" r="11.2" fill="none" stroke="currentColor" strokeWidth="5.4" />
    </>
  );
}

/* Hwemudua: a T-shaped rod standing in a squared base. Plain bars only. */
function Hwemudua() {
  return (
    <>
      <rect x="15" y="0" width="70" height="13" />
      <rect x="43.5" y="0" width="13" height="77" />
      <rect x="0" y="31" width="100" height="13" />
      <rect x="0" y="31" width="13" height="46" />
      <rect x="87" y="31" width="13" height="46" />
      <rect x="21" y="31" width="13" height="69" />
      <rect x="66" y="31" width="13" height="69" />
      <rect x="9" y="87" width="82" height="13" />
    </>
  );
}

/* Pempamsie: the left half runs up the neck, over a rounded shoulder, round
   the lobe and straight in to a point, then the same again below. The right
   half is its mirror. The spindle between them carries the four barbs. */
const PEMPAMSIE_HALF =
  "M46 26 L46 17 C46 8 38 5 24.8 5 A19.8 19.8 0 0 0 14.3 41.6 L28.5 50 L14.3 58.4 A19.8 19.8 0 0 0 24.8 95 C38 95 46 92 46 83 L46 74";
const PEMPAMSIE_SPINDLE =
  "M43 5 L50 10 L57 5 L58 18.5 Q64.5 28.5 74.5 26.5 Q68.5 34.5 60.5 33.5 C58.4 39 57 45 57 50 C57 55 58.4 61 60.5 66.5 Q68.5 65.5 74.5 73.5 Q64.5 71.5 58 81.5 L57 95 L50 90 L43 95 L42 81.5 Q35.5 71.5 25.5 73.5 Q31.5 65.5 39.5 66.5 C41.6 61 43 55 43 50 C43 45 41.6 39 39.5 33.5 Q31.5 34.5 25.5 26.5 Q35.5 28.5 42 18.5 Z";

function Pempamsie() {
  return (
    <>
      <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinejoin="miter">
        <path d={PEMPAMSIE_HALF} />
        <path d={PEMPAMSIE_HALF} transform="translate(100 0) scale(-1 1)" />
      </g>
      <path d={PEMPAMSIE_SPINDLE} />
    </>
  );
}

const GLYPHS: Record<SymbolId, () => ReactElement> = {
  nkyimu: Nkyimu,
  "ananse-ntontan": AnanseNtontan,
  fihankra: Fihankra,
  "bese-saka": BeseSaka,
  hwemudua: Hwemudua,
  pempamsie: Pempamsie,
};

interface AdinkraSymbolProps {
  id: SymbolId;
  /** The symbol's Twi name, read out as the image's label. */
  label: string;
  className?: string;
}

export function AdinkraSymbol({ id, label, className }: AdinkraSymbolProps) {
  const Glyph = GLYPHS[id];
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={label} fill="currentColor" className={className}>
      <Glyph />
    </svg>
  );
}
