import { STACK, plateY, project } from "@/lib/stackGeometry";
import { layers } from "@/data/breakIt";

/* ── Stage geometry ── */
// Six plates drawn through the shared stack projection. Every plate has to
// be addressable on its own, and requests need a rail to travel down and
// somewhere to park.

export const STAGE_LAYERS = layers.length;

/** SVG pixels per world unit. */
const UNIT = 100;
/** How far above the top plate a request appears. */
const RAIL_LEAD = 150;
/** Room under the base plate for a request that is let through. */
const EXIT_ROOM = 22;

export const STAGE_VIEW = {
  width: STACK.view.width * UNIT,
  height: STACK.view.height * UNIT + EXIT_ROOM,
} as const;

export const DOT_RADIUS = 12;
/** Dots drawn into the SVG for the choreography to reuse. A flood uses them all. */
export const DOT_POOL = 24;

export interface StagePoint {
  x: number;
  y: number;
}

const halfWidth = STACK.width / 2;
const halfDepth = STACK.depth / 2;
const halfThickness = STACK.thickness / 2;

function toStage(x: number, y: number, z: number): StagePoint {
  const [screenX, screenY] = project(x, y, z);
  return {
    x: STAGE_VIEW.width / 2 + screenX * UNIT,
    y: (STACK.view.height / 2 - screenY) * UNIT,
  };
}

function pointList(corners: readonly StagePoint[]): string {
  return corners.map((corner) => `${corner.x.toFixed(1)},${corner.y.toFixed(1)}`).join(" ");
}

function plateHeight(index: number): number {
  return plateY(index, STAGE_LAYERS, 0);
}

export interface PlateFaces {
  front: string;
  side: string;
  top: string;
}

/** Polygon points for the three visible faces of plate `index` (0 is the top plate). */
export function plateFaces(index: number): PlateFaces {
  const up = plateHeight(index) + halfThickness;
  const down = plateHeight(index) - halfThickness;
  return {
    front: pointList([
      toStage(-halfWidth, up, halfDepth),
      toStage(halfWidth, up, halfDepth),
      toStage(halfWidth, down, halfDepth),
      toStage(-halfWidth, down, halfDepth),
    ]),
    side: pointList([
      toStage(halfWidth, up, -halfDepth),
      toStage(halfWidth, up, halfDepth),
      toStage(halfWidth, down, halfDepth),
      toStage(halfWidth, down, -halfDepth),
    ]),
    top: pointList([
      toStage(-halfWidth, up, -halfDepth),
      toStage(halfWidth, up, -halfDepth),
      toStage(halfWidth, up, halfDepth),
      toStage(-halfWidth, up, halfDepth),
    ]),
  };
}

/** Where a request meets layer `index`: the near corner of its top face. */
export function plateCorner(index: number): StagePoint {
  return toStage(halfWidth, plateHeight(index) + halfThickness, halfDepth);
}

const firstCorner = plateCorner(0);
const baseUnderside = toStage(
  halfWidth,
  plateHeight(STAGE_LAYERS - 1) - halfThickness,
  halfDepth,
);

/** The vertical line every request falls along, through each plate's near corner. */
export const RAIL = {
  x: firstCorner.x,
  top: firstCorner.y - RAIL_LEAD,
  bottom: baseUnderside.y + EXIT_ROOM - DOT_RADIUS,
} as const;

/**
 * A waiting spot on layer `index`: spots fan out from the near corner along
 * the plate's two front edges, alternating sides, and stop short of the tips.
 */
export function parkingSpot(index: number, slot: number, slots: number): StagePoint {
  const corner = plateCorner(index);
  const up = plateHeight(index) + halfThickness;
  const tip =
    slot % 2 === 0
      ? toStage(halfWidth, up, -halfDepth)
      : toStage(-halfWidth, up, halfDepth);
  const rank = Math.floor(slot / 2) + 1;
  const share = rank / (Math.ceil(slots / 2) + 0.5);
  return {
    x: corner.x + (tip.x - corner.x) * share,
    y: corner.y + (tip.y - corner.y) * share,
  };
}

/** Where plate `index` sits down the figure, 0..100, for its HTML label. */
export function labelTopPercent(index: number): number {
  const tip = toStage(halfWidth, plateHeight(index), -halfDepth);
  return (tip.y / STAGE_VIEW.height) * 100;
}
