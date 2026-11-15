/* ── Stage geometry ───────────────────────────────── */
// The numbers behind the clay model: where each part stands, how the pipes
// run, where the bulb floats and where it comes to rest. What the stage
// frames and where the labels hang is measured from these in framing.ts.
// How any of it looks is the style preset's business.

import { type Point, type Slab, type Vec3 } from "./projection";

/** The pixels a screen is painted in. */
export interface ScreenSize {
  width: number;
  height: number;
}

/** A made-up screen and the slab that carries it, in world units. */
export interface Device {
  layout: ScreenSize;
  imageWidth: number;
  imageHeight: number;
  bodyWidth: number;
  bodyHeight: number;
  thickness: number;
}

function device(imageWidth: number, layout: ScreenSize, bezel: number, thickness: number): Device {
  const imageHeight = (imageWidth * layout.height) / layout.width;
  return {
    layout,
    imageWidth,
    imageHeight,
    bodyWidth: imageWidth + bezel * 2,
    bodyHeight: imageHeight + bezel * 2,
    thickness,
  };
}

// Each screen is laid out in the pixels of its own texture, so its text and
// rules can be painted on whole pixels.
export const WALL = device(3.4, { width: 2048, height: 1266 }, 0.05, 0.08);
// Wide enough that a notification's words can be read at this size, short
// enough to leave the top of the wall in view, and thin like a phone.
export const PHONE = device(0.86, { width: 640, height: 1120 }, 0.026, 0.045);

/* ── Foundation: two plates with the plumbing between them ── */
export const FOUNDATION = {
  width: 3.64,
  depth: 1.9,
  thickness: 0.09,
  /** Air between the plates. Tall enough to see the pipes through from this camera. */
  gap: 0.52,
} as const;

/** The underside of the lower plate. */
export const GROUND = -FOUNDATION.thickness / 2;
/** The top of the lower plate: the pipes run just above it. */
export const DECK = FOUNDATION.thickness / 2;
/** Centre height of the upper plate once it has risen. */
export const UPPER_Y = FOUNDATION.thickness + FOUNDATION.gap;
/** The top of the foundation: the house stands on it. */
export const FLOOR = UPPER_Y + FOUNDATION.thickness / 2;
const FRONT = FOUNDATION.depth / 2;

export function foundationSlab(upper: boolean): Slab {
  return {
    size: [FOUNDATION.width, FOUNDATION.thickness, FOUNDATION.depth],
    position: [0, upper ? UPPER_Y : 0, 0],
    pitch: 0,
  };
}

// What holds the upper plate up: a block set well back, behind every pipe.
// A lit slab hanging in mid air reads as a mistake; a recess reads as built.
const CORE_FRONT = 0.16;
export const CORE_SLAB: Slab = {
  size: [FOUNDATION.width - 0.5, FOUNDATION.gap, FRONT - 0.2 + CORE_FRONT],
  position: [0, DECK + FOUNDATION.gap / 2, (CORE_FRONT - FRONT + 0.2) / 2],
  pitch: 0,
};

/* ── The house ── */
export const HOUSE = {
  halfWidth: WALL.bodyWidth / 2,
  front: FRONT,
  back: -FRONT + 0.14,
  eave: FLOOR + WALL.bodyHeight,
  /** A low pitch: a steep one turns the outline into a cartoon. */
  apex: FLOOR + WALL.bodyHeight + 0.84,
} as const;

/** The front wall: a dark screen, then the finished one. Flush with the foundation's front. */
export const WALL_SLAB: Slab = {
  size: [WALL.bodyWidth, WALL.bodyHeight, WALL.thickness],
  position: [0, FLOOR + WALL.bodyHeight / 2, FRONT - WALL.thickness / 2],
  pitch: 0,
};

/** How thick the house's walls and its gable are. The window openings are cut to this depth. */
export const HOUSE_WALL = 0.08;
const SIDE_WALL_DEPTH = FRONT - WALL.thickness - HOUSE.back;

function sideWall(side: -1 | 1): Slab {
  return {
    size: [HOUSE_WALL, WALL.bodyHeight, SIDE_WALL_DEPTH],
    position: [
      side * (HOUSE.halfWidth - HOUSE_WALL / 2),
      FLOOR + WALL.bodyHeight / 2,
      HOUSE.back + SIDE_WALL_DEPTH / 2,
    ],
    pitch: 0,
  };
}

/** The left wall: the side this camera sees. */
export const SIDE_WALL_SLAB: Slab = sideWall(-1);
/** The right and back walls. Only seen while the house is open, before the roof goes on. */
export const FAR_WALL_SLABS: readonly Slab[] = [
  sideWall(1),
  {
    size: [WALL.bodyWidth - HOUSE_WALL * 2, WALL.bodyHeight, HOUSE_WALL],
    position: [0, FLOOR + WALL.bodyHeight / 2, HOUSE.back + HOUSE_WALL / 2],
    pitch: 0,
  },
];

/* ── The roof: two slabs, a gable at the front, a cap on the ridge ── */
const ROOF_RISE = HOUSE.apex - HOUSE.eave;
const ROOF_FRONT = FRONT + 0.11;
const ROOF_BACK = HOUSE.back - 0.05;

export const ROOF = {
  /** Radians above level. */
  slope: Math.atan2(ROOF_RISE, HOUSE.halfWidth),
  /** Eave to ridge, measured up the slope. */
  length: Math.hypot(ROOF_RISE, HOUSE.halfWidth),
  thickness: 0.09,
  /** How far each slab runs on below the eave. */
  overhang: 0.14,
  /** The board that closes the slab's lower edge. */
  fascia: { width: 0.032, height: 0.125 },
  depth: ROOF_FRONT - ROOF_BACK,
  /** Where the middle of that depth sits. */
  centreZ: (ROOF_FRONT + ROOF_BACK) / 2,
  front: ROOF_FRONT,
} as const;

export const RIDGE = { width: 0.085, height: 0.042, length: ROOF.depth + 0.024 } as const;

/** A gable end: a triangle standing on the eave line, as thick as the walls. */
export interface Gable {
  halfBase: number;
  rise: number;
}

// Set in from the rafter line by half the roof's thickness, so the gable
// ends inside the slabs above it and never shares a surface with them.
const GABLE_INSET = ROOF.thickness / 2;

/** The front gable. It is the only one built: one at the back would be hidden behind the roof once the house is finished. */
export const GABLE: Gable = {
  halfBase: HOUSE.halfWidth - GABLE_INSET / Math.sin(ROOF.slope),
  rise: ROOF_RISE - GABLE_INSET / Math.cos(ROOF.slope),
};

/* ── The phone: standing on a ledge, leaning on the wall ── */
const LEDGE_THICKNESS = 0.075;
/** A hair under the floor, so the ledge hides inside the upper plate until it slides out. */
const LEDGE_TOP = FLOOR - 0.012;
/** How far the ledge slides out from under the front wall. */
export const LEDGE_REACH = 0.46;
export const LEDGE_SLAB: Slab = {
  size: [1.12, LEDGE_THICKNESS, LEDGE_REACH],
  position: [1.2, LEDGE_TOP - LEDGE_THICKNESS / 2, FRONT + LEDGE_REACH / 2],
  pitch: 0,
};
/** How far out from the wall the phone's foot stands. */
const PHONE_FOOT = 0.3;
// It leans back until its top edge rests against the wall: nothing floats.
const LEANING = -Math.asin((PHONE_FOOT - 0.006) / PHONE.bodyHeight);
export const PHONE_RAISED: Slab = {
  size: [PHONE.bodyWidth, PHONE.bodyHeight, PHONE.thickness],
  position: [
    LEDGE_SLAB.position[0],
    LEDGE_TOP + (PHONE.bodyHeight / 2) * Math.cos(LEANING) - (PHONE.thickness / 2) * Math.sin(LEANING),
    FRONT + PHONE_FOOT + (PHONE.bodyHeight / 2) * Math.sin(LEANING) + (PHONE.thickness / 2) * Math.cos(LEANING),
  ],
  pitch: LEANING,
};
/** The middle of the phone's foot: what it grows from as it arrives. */
export const PHONE_FOOT_POINT: Vec3 = [LEDGE_SLAB.position[0], LEDGE_TOP, FRONT + PHONE_FOOT + PHONE.thickness / 2];

/* ── The doorstep: where the address is ── */
const DOORSTEP_THICKNESS = 0.06;
/** How far it slides out from under the foundation. */
export const DOORSTEP_REACH = 0.5;
// Thinner than the lower plate, so it hides inside it until it slides out.
export const DOORSTEP_SLAB: Slab = {
  size: [0.72, DOORSTEP_THICKNESS, DOORSTEP_REACH],
  position: [-0.67, GROUND + DOORSTEP_THICKNESS / 2, FRONT + DOORSTEP_REACH / 2],
  pitch: 0,
};

/** The point the pointer tilt and the turn-in turn about. */
export const PIVOT: Vec3 = [0, FLOOR + 0.9, 0];

/* ── The bulb: the idea ── */
const BULB_SEAT: Vec3 = [0.28, DECK, FRONT - 0.2];
export const BULB = {
  /** Where its foot is while it floats over the empty plot: level with its label. */
  float: [0.45, FLOOR + 1.53, 0.45] as Vec3,
  // It comes down in front of the foundation and slides in under the upper
  // plate, so it never passes through anything on its way.
  front: [BULB_SEAT[0], DECK, FRONT + 0.52] as Vec3,
  // Its seat: on the lower plate, at the front of the gap where this camera
  // sees it whole, between the second riser and the third and clear of both.
  seat: BULB_SEAT,
  /** Foot to crown, seated. It has to stand in the gap. */
  height: 0.46,
  /** How much larger it is while it floats: it is the only thing on the stage then. */
  floatScale: 1.3,
} as const;

/* ── The plot: a low kerb on the ground, there before anything is built ── */
// Close round the foundation: every unit of margin here is a unit the model
// cannot use on the page.
const PLOT_MARGIN = 0.06;
export const PLOT = {
  halfWidth: FOUNDATION.width / 2 + PLOT_MARGIN,
  halfDepth: FRONT + PLOT_MARGIN,
} as const;

/* ── The plumbing ── */
export const PIPE = {
  /** Low in the gap: the lower a pipe lies, the further back it stays in view. */
  y: DECK + 0.075,
  /** The canvas lays each run down in pieces this long. */
  piece: 0.1,
} as const;

const EDGE_X = FOUNDATION.width / 2 + 0.03;
/** The two depths the runs lie at: under the front wall, and well behind it. */
const FRONT_RUN = FRONT - 0.07;
const BACK_RUN = FRONT - 0.42;

/** A run of pipe, corner to corner: its junction first, the top of its riser last. */
export type PipeRun = readonly Vec3[];

function pipeRun(plan: readonly Point[]): PipeRun {
  const flat = plan.map(([x, z]): Vec3 => [x, PIPE.y, z]);
  const [riserX, , riserZ] = flat[flat.length - 1];
  return [...flat, [riserX, FLOOR, riserZ]];
}

// Seen from above as [x, z]. Each run is one straight leg across the gap and
// one riser straight up through the floor: an L and nothing else. A leg
// toward the viewer draws as a diagonal in this camera, and a diagonal next
// to a riser reads as a V, so no run has one. The three differ in where they
// start, how far they reach and how deep they lie; the two at the front come
// up directly under the wall.
export const PIPE_RUNS: readonly PipeRun[] = [
  pipeRun([[-EDGE_X, FRONT_RUN], [-1.15, FRONT_RUN]]),
  pipeRun([[-EDGE_X, BACK_RUN], [-0.2, BACK_RUN]]),
  pipeRun([[EDGE_X, FRONT_RUN], [0.75, FRONT_RUN]]),
];

export function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
}

export function runLength(run: PipeRun): number {
  let total = 0;
  for (let index = 1; index < run.length; index += 1) total += distance(run[index - 1], run[index]);
  return total;
}

/** The share of a run (0..1) at which its riser starts. */
export function riserShare(run: PipeRun): number {
  return 1 - distance(run[run.length - 2], run[run.length - 1]) / runLength(run);
}

/** Writes the point `share` of the way along a run into `out`. Allocates nothing: the frame loop calls it. */
export function pointAlong(run: PipeRun, share: number, out: number[]): void {
  let left = Math.min(1, Math.max(0, share)) * runLength(run);
  for (let index = 1; index < run.length; index += 1) {
    const from = run[index - 1];
    const to = run[index];
    const leg = distance(from, to);
    if (left <= leg || index === run.length - 1) {
      const along = leg === 0 ? 0 : Math.min(1, left / leg);
      out[0] = from[0] + (to[0] - from[0]) * along;
      out[1] = from[1] + (to[1] - from[1]) * along;
      out[2] = from[2] + (to[2] - from[2]) * along;
      return;
    }
    left -= leg;
  }
}

