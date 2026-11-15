/* ── Windows ──────────────────────────────────────── */
// Where the house's windows are. Each is a real opening cut through its
// wall, with the glass set back inside it, a mullion across the glass and a
// sill under it: the wall's thickness shows in the reveal, and the reveal
// and the sill cast their own small shadows. What a window looks like, off
// and on, is the style preset's business.

import { BoxGeometry, PlaneGeometry, type BufferGeometry } from "three";
import { type Opening } from "./clayParts";
import { HOUSE_WALL } from "./stage";

/** A window in its wall's own flat space: x along the wall, y up from the wall's foot. */
export type Pane = Opening;

/** How far back in an opening the glass sits: most of the way through the wall. */
const GLASS_SETBACK = 0.058;
/** Mullions and sills, in world units. */
const MULLION = 0.022;
const SILL = { proud: 0.045, height: 0.03, past: 0.035 } as const;

/** Two tall windows in the left wall, the side this camera sees. x runs front to back from the wall's middle. */
export const SIDE_PANES: readonly Pane[] = [
  { x: 0.2, y: 0.82, width: 0.42, height: 0.8 },
  { x: -0.62, y: 0.82, width: 0.42, height: 0.8 },
];

/** One small window in the front gable, above the screen. y is up from the eave. */
export const GABLE_PANE: Pane = { x: -0.24, y: 0.17, width: 0.48, height: 0.28 };

/** The glass: a flat sheet filling the opening, `GLASS_SETBACK` behind the wall's outer face (z = 0, looking down +z). */
export function glass({ x, y, width, height }: Pane): BufferGeometry {
  return new PlaneGeometry(width, height).translate(x + width / 2, y + height / 2, -GLASS_SETBACK);
}

/** A soft sheet on the wall's face under and round a window: where a lit pane's light lands. */
export function spillSheet({ x, y, width, height }: Pane, reach: number): BufferGeometry {
  return new PlaneGeometry(width + reach * 2, height + reach * 2).translate(x + width / 2, y + height / 2 - reach * 0.4, 0.003);
}

/** The clay that dresses an opening: a cross of mullions just in front of the glass, and a sill under it. */
export function dressing({ x, y, width, height }: Pane): BufferGeometry[] {
  const midX = x + width / 2;
  const midY = y + height / 2;
  const bars = [
    new BoxGeometry(MULLION, height, MULLION).translate(midX, midY, -GLASS_SETBACK + MULLION / 2),
    new BoxGeometry(width, MULLION, MULLION).translate(midX, y + height * 0.62, -GLASS_SETBACK + MULLION / 2),
  ];
  const sill = new BoxGeometry(width + SILL.past * 2, SILL.height, SILL.proud + HOUSE_WALL * 0.5).translate(
    midX,
    y - SILL.height / 2,
    (SILL.proud - HOUSE_WALL * 0.5) / 2,
  );
  return [...bars, sill];
}
