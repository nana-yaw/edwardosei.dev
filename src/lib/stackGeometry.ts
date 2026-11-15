/* ── Stack geometry ──────────────────────────────── */
// One set of numbers for both renderings of the hero stack: the
// server-rendered SVG and the WebGL canvas that mounts over it. Sharing the
// maths is what lets the canvas replace the SVG without a visible jump.

export const STACK = {
  /** Plate footprint and thickness, in world units. */
  width: 3.6,
  depth: 3.6,
  thickness: 0.2,
  /** Centre-to-centre spacing between plates when exploded. */
  gap: 1.1,
  /** How far the request line starts above the top plate. */
  lead: 0.6,
  /** World units the figure shows; also the SVG viewBox at 100px per unit. */
  view: { width: 5.6, height: 8.2 },
} as const;

const SQRT2 = Math.SQRT2;
const SQRT6 = Math.sqrt(6);

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Height of plate `index` (0 is the top plate) at seal progress 0..1.
 * The gaps close one at a time from the top, so the stack zips shut in the
 * order a request meets the layers. The base plate never moves.
 */
export function plateY(index: number, layers: number, progress: number): number {
  const gaps = layers - 1;
  const baseY = -(gaps * STACK.gap) / 2;
  let y = baseY;
  for (let gapIndex = index; gapIndex < gaps; gapIndex += 1) {
    const closed = clamp01(progress * gaps - gapIndex);
    y += STACK.gap + (STACK.thickness - STACK.gap) * closed;
  }
  return y;
}

/**
 * How many layers have locked at this progress (drives the label state).
 * A layer locks when the gap under it has closed; the last gap locks the
 * final two together.
 */
export function sealedCount(layers: number, progress: number): number {
  if (progress >= 1) return layers;
  return Math.floor(clamp01(progress) * (layers - 1) + 1e-6);
}

/** How far the top plate falls on screen from exploded to sealed, in world units. */
export function sealTravel(layers: number): number {
  return ((layers - 1) * (STACK.gap - STACK.thickness) * 2) / SQRT6;
}

/** Isometric projection: the view from (1, 1, 1), in world units. */
export function project(x: number, y: number, z: number): [number, number] {
  return [(x - z) / SQRT2, (-x + 2 * y - z) / SQRT6];
}

/** The same point in SVG viewBox pixels (y grows downward). */
export function toSvg(x: number, y: number, z: number): [number, number] {
  const [sx, sy] = project(x, y, z);
  return [
    (STACK.view.width / 2 + sx) * 100,
    (STACK.view.height / 2 - sy) * 100,
  ];
}

/** Where plate `index` sits down the figure, 0..100, for its HTML label. */
export function labelTopPercent(index: number, layers: number): number {
  const [, y] = toSvg(STACK.width / 2, plateY(index, layers, 0), -STACK.depth / 2);
  return (y / (STACK.view.height * 100)) * 100;
}
