/* ── Framing ──────────────────────────────────────── */
// What the stage shows and where the labels hang. The view box is measured
// from the finished model and drawn tight round it, so the model fills the
// stage. The canvas itself is larger than the stage by `OVERSCAN`, which is
// where the camera's move, the pointer tilt, the floor and the shadows find
// their room.

import { clayPreset } from "./presets/clay";
import { VIEW_RIGHT, VIEW_UP, project, slabCorners, slabPoint, type Vec3 } from "./projection";
import {
  BULB,
  DOORSTEP_REACH,
  DOORSTEP_SLAB,
  FOUNDATION,
  GROUND,
  HOUSE,
  LEDGE_SLAB,
  PHONE,
  PHONE_RAISED,
  PIPE_RUNS,
  PLOT,
  UPPER_Y,
  WALL,
  WALL_SLAB,
  foundationSlab,
} from "./stage";

const VIEW_MARGIN = 0.04;
/** How far a junction box hangs past its own middle: the view is measured with this much room for it. */
const JUNCTION_ROOM = clayPreset.plumbing.junction / 2;
/** How far the canvas and the still reach past the stage on each side, as a share of the stage's width and height. */
export const OVERSCAN = { x: 0.14, y: 0.1 } as const;

function measureView() {
  const { halfWidth, front, back, eave, apex } = HOUSE;
  const points: Vec3[] = [
    ...[-1, 1].flatMap((x) => [-1, 1].map((z): Vec3 => [x * PLOT.halfWidth, GROUND, z * PLOT.halfDepth])),
    ...[-halfWidth, halfWidth].flatMap((x) => [front, back].map((z): Vec3 => [x, eave, z])),
    [0, apex, front],
    [0, apex, back],
    ...PIPE_RUNS.map(([junction]): Vec3 => [
      junction[0] + Math.sign(junction[0]) * JUNCTION_ROOM,
      junction[1],
      junction[2],
    ]),
    ...[foundationSlab(true), WALL_SLAB, PHONE_RAISED, LEDGE_SLAB, DOORSTEP_SLAB].flatMap(slabCorners),
  ];
  let left = Infinity;
  let right = -Infinity;
  let bottom = Infinity;
  let top = -Infinity;
  for (const point of points) {
    const [x, y] = project(point);
    left = Math.min(left, x);
    right = Math.max(right, x);
    bottom = Math.min(bottom, y);
    top = Math.max(top, y);
  }
  return {
    left: left - VIEW_MARGIN,
    top: top + VIEW_MARGIN,
    width: right - left + VIEW_MARGIN * 2,
    height: top - bottom + VIEW_MARGIN * 2,
  };
}

/** What the stage shows, in world units. */
export const VIEW = measureView();

const centreX = VIEW.left + VIEW.width / 2;
const centreY = VIEW.top - VIEW.height / 2;
/** The world point at the middle of the stage; the canvas camera looks at it. */
export const VIEW_CENTRE: Vec3 = [
  centreX * VIEW_RIGHT[0] + centreY * VIEW_UP[0],
  centreY * VIEW_UP[1],
  centreX * VIEW_RIGHT[2] + centreY * VIEW_UP[2],
];

/* ── Label anchors ── */
export interface LabelAnchor {
  left: string;
  top: string;
  /** The same position as shares of the stage (0..1), for the canvas to hold the label to. */
  x: number;
  y: number;
  /** From the anchor to the shared text column, as a share of the stage's width (0..1). */
  reach: number;
}

function percent(share: number): string {
  return `${(share * 100).toFixed(3)}%`;
}

/** The labels on the right line up here: just past the widest part of the picture. */
const LABEL_COLUMN = VIEW.left + VIEW.width - VIEW_MARGIN;

function labelAnchor(point: Vec3, toColumn = true): LabelAnchor {
  const [x, y] = project(point);
  return {
    left: percent((x - VIEW.left) / VIEW.width),
    top: percent((VIEW.top - y) / VIEW.height),
    x: (x - VIEW.left) / VIEW.width,
    y: (VIEW.top - y) / VIEW.height,
    reach: toColumn ? Math.max(0, (LABEL_COLUMN - x) / VIEW.width) : 0,
  };
}

/** How far above the front wall's middle the idea's label hangs, as a share of the wall's height. */
const IDEA_RISE = 0.38;
const IDEA_ANCHOR = slabPoint(WALL_SLAB, [WALL.bodyWidth / 2, WALL.bodyHeight * IDEA_RISE, WALL.thickness / 2]);
/** The same height measured from the wall's foot (0) to its top (1): the wall has to rise this far before the label has it to point at. */
export const IDEA_WALL_SHARE = 0.5 + IDEA_RISE;
/** The floating bulb's right-hand side, at the height of its globe. */
const BULB_SIDE: Vec3 = [
  BULB.float[0] + BULB.height * BULB.floatScale * 0.36,
  BULB.float[1] + BULB.height * BULB.floatScale * 0.66,
  BULB.float[2],
];

/** Before the house is up the idea's leader runs on from the wall's edge back to the bulb: this far, as a share of the stage's width. */
export const IDEA_LEAD = (project(IDEA_ANCHOR)[0] - project(BULB_SIDE)[0]) / VIEW.width;

/** The points in the model each label hangs from. The canvas keeps every label on its point while the camera moves. */
export const ANCHOR_POINTS = {
  /** High on the front wall's right-hand edge, above the phone. */
  idea: IDEA_ANCHOR,
  /** On the phone's right-hand edge: the screens are what the housing holds. */
  housing: slabPoint(PHONE_RAISED, [PHONE.bodyWidth / 2, PHONE.bodyHeight * 0.22, 0]),
  /** Level with the gap, at the foundation's front right corner. */
  plumbing: [FOUNDATION.width / 2, UPPER_Y - FOUNDATION.thickness / 2 - 0.02, HOUSE.front] as Vec3,
  /** Beside the doorstep, under the front edge. */
  launch: [DOORSTEP_SLAB.position[0] + DOORSTEP_SLAB.size[0] / 2, GROUND, HOUSE.front + DOORSTEP_REACH] as Vec3,
} as const;

export type AnchorName = keyof typeof ANCHOR_POINTS;

export const LABEL_ANCHORS: Record<AnchorName, LabelAnchor> = {
  idea: labelAnchor(ANCHOR_POINTS.idea),
  housing: labelAnchor(ANCHOR_POINTS.housing),
  plumbing: labelAnchor(ANCHOR_POINTS.plumbing),
  launch: labelAnchor(ANCHOR_POINTS.launch, false),
};
