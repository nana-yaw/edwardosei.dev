import type { ReactElement } from "react";

/* ── Kente-inspired strip geometry ── */
// Bands of blocks, stripes, steps and zigzags in the site's own colours.
// These are made-up arrangements in the manner of strip weaving. They do not
// reproduce any named cloth, and they should stay that way.
// Decorative throughout: every element here is hidden from assistive tech.

type KenteMotif =
  | "warp"
  | "weft"
  | "steps"
  | "zigzag"
  | "checker"
  | "squares"
  | "comb"
  | "teeth";

export type KenteBand = "a" | "b" | "c";

type Ink = "accent" | "bone" | "ground";

const FILL: Record<Ink, string> = {
  accent: "fill-accent",
  bone: "fill-foreground",
  ground: "fill-background",
};

const STROKE: Record<Ink, string> = {
  accent: "stroke-accent",
  bone: "stroke-foreground",
  ground: "stroke-background",
};

/* A run of stripes across one 100-unit tile: [start, width, ink]. */
const STRIPES: readonly (readonly [number, number, Ink])[] = [
  [0, 8, "accent"],
  [12, 3, "bone"],
  [19, 3, "bone"],
  [26, 48, "accent"],
  [44, 3, "ground"],
  [53, 3, "ground"],
  [78, 3, "bone"],
  [85, 3, "bone"],
  [92, 8, "accent"],
];

function Warp() {
  return (
    <>
      {STRIPES.map(([start, width, ink]) => (
        <rect key={start} x={start} y="0" width={width} height="100" className={FILL[ink]} />
      ))}
    </>
  );
}

function Weft() {
  return (
    <>
      {STRIPES.map(([start, width, ink]) => (
        <rect key={start} x="0" y={start} width="100" height={width} className={FILL[ink]} />
      ))}
    </>
  );
}

/* Ten rows that widen then narrow make a stepped diamond; a smaller one in
   the ground colour and a bone core sit inside it. */
const STEP_ROWS = Array.from({ length: 10 }, (_, row) => row);
const stepHalfWidth = (row: number, inset: number) =>
  Math.max(0, (row < 5 ? row + 1 : 10 - row) * 10 - inset);

function Steps() {
  const layers: readonly (readonly [number, Ink])[] = [
    [0, "accent"],
    [20, "ground"],
    [40, "bone"],
  ];
  return (
    <>
      {layers.map(([inset, ink]) =>
        STEP_ROWS.map((row) => {
          const half = stepHalfWidth(row, inset);
          return half > 0 ? (
            <rect
              key={`${inset}-${row}`}
              x={50 - half}
              y={row * 10}
              width={half * 2}
              height="10"
              className={FILL[ink]}
            />
          ) : null;
        }),
      )}
    </>
  );
}

const ZIGZAG_POINTS = (centre: number) =>
  Array.from({ length: 9 }, (_, index) => `${index * 12.5},${centre + (index % 2 === 0 ? 9 : -9)}`).join(" ");

function Zigzag() {
  const rows: readonly (readonly [number, Ink])[] = [
    [18, "accent"],
    [50, "bone"],
    [82, "accent"],
  ];
  return (
    <>
      {rows.map(([centre, ink]) => (
        <polyline
          key={centre}
          points={ZIGZAG_POINTS(centre)}
          fill="none"
          strokeWidth="9"
          strokeLinejoin="miter"
          className={STROKE[ink]}
        />
      ))}
    </>
  );
}

const CHECKER_CELLS = Array.from({ length: 16 }, (_, index) => ({ column: index % 4, row: Math.floor(index / 4) }));

function Checker() {
  return (
    <>
      {CHECKER_CELLS.map(({ column, row }) =>
        (column + row) % 2 === 0 ? (
          <rect key={`${column}-${row}`} x={column * 25} y={row * 25} width="25" height="25" className={FILL.accent} />
        ) : (
          <rect
            key={`${column}-${row}`}
            x={column * 25 + 9}
            y={row * 25 + 9}
            width="7"
            height="7"
            className={FILL.bone}
          />
        ),
      )}
    </>
  );
}

function Squares() {
  const rings: readonly (readonly [number, Ink])[] = [
    [0, "accent"],
    [12, "ground"],
    [24, "bone"],
    [30, "ground"],
    [40, "accent"],
  ];
  return (
    <>
      {rings.map(([inset, ink]) => (
        <rect key={inset} x={inset} y={inset} width={100 - inset * 2} height={100 - inset * 2} className={FILL[ink]} />
      ))}
    </>
  );
}

const COMB_TEETH = Array.from({ length: 8 }, (_, index) => 5 + index * 12.5);

function Comb() {
  return (
    <>
      {COMB_TEETH.map((x) => (
        <rect key={x} x={x} y="0" width="3" height="100" className={FILL.bone} />
      ))}
      <rect x="0" y="36" width="100" height="28" className={FILL.accent} />
      <rect x="0" y="48" width="100" height="4" className={FILL.ground} />
    </>
  );
}

function Teeth() {
  return (
    <>
      <path d="M0 50 L25 4 L50 50 Z M50 50 L75 4 L100 50 Z" className={FILL.accent} />
      <path d="M0 50 L50 50 L25 96 Z M50 50 L100 50 L75 96 Z" className={FILL.bone} />
    </>
  );
}

const MOTIFS: Record<KenteMotif, () => ReactElement> = {
  warp: Warp,
  weft: Weft,
  steps: Steps,
  zigzag: Zigzag,
  checker: Checker,
  squares: Squares,
  comb: Comb,
  teeth: Teeth,
};

/* The long bands: a run of motifs with a gap of ground between each. */
const BANDS: Record<KenteBand, readonly KenteMotif[]> = {
  a: ["steps", "warp", "zigzag", "weft", "checker"],
  b: ["teeth", "comb", "squares", "zigzag", "warp"],
  c: ["checker", "weft", "steps", "comb", "teeth"],
};

const BAND_PITCH = 112;
const bandId = (band: KenteBand) => `kente-band-${band}`;

/* Defines each band once as an SVG pattern. Render this a single time, before
   any strip. It takes no space; it is not display:none because some browsers
   will not paint a pattern that lives in a hidden SVG. */
export function KenteBandDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {(Object.keys(BANDS) as KenteBand[]).map((band) => (
          <pattern
            key={band}
            id={bandId(band)}
            width={BANDS[band].length * BAND_PITCH}
            height="100"
            patternUnits="userSpaceOnUse"
          >
            {BANDS[band].map((motif, index) => {
              const Motif = MOTIFS[motif];
              return (
                <g key={motif} transform={`translate(${index * BAND_PITCH} 0)`}>
                  <Motif />
                </g>
              );
            })}
          </pattern>
        ))}
      </defs>
    </svg>
  );
}

interface KenteStripProps {
  band: KenteBand;
  /** Sets the strip's height; the pattern scales to it and repeats along the width. */
  className?: string;
}

/* A strip of any width filled with one band. The viewBox pins the tile
   height to the element's height, and the rect runs far past the right edge
   so the pattern repeats however wide the strip is laid. */
export function KenteStrip({ band, className }: KenteStripProps) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMid meet" aria-hidden="true" className={className}>
      <rect width="12000" height="100" fill={`url(#${bandId(band)})`} />
    </svg>
  );
}
