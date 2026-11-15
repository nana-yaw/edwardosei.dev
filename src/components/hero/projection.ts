/* ── Camera and slab maths ────────────────────────── */
// The camera is orthographic, so a world point lands on screen through a
// plain affine map. The stage is measured and the labels are placed through
// `project`, which keeps the HTML labels level with their parts in the
// canvas.

const DEGREES = Math.PI / 180;

export type Vec3 = readonly [number, number, number];
export type Point = readonly [number, number];

/** A box: its size, where its centre sits, and how far it leans. */
export interface Slab {
  size: Vec3;
  position: Vec3;
  /** Radians about the x axis: 0 stands upright facing the viewer. */
  pitch: number;
}

/* ── Camera ── */
// Lower and more head-on than true isometric, so the front wall keeps over
// nine tenths of its width and the screen on it stays readable.
const AZIMUTH = -23 * DEGREES;
const ELEVATION = 23 * DEGREES;

const sinA = Math.sin(AZIMUTH);
const cosA = Math.cos(AZIMUTH);
const sinE = Math.sin(ELEVATION);
const cosE = Math.cos(ELEVATION);

/** Unit vector from the scene toward the camera. */
export const VIEW_DIRECTION: Vec3 = [sinA * cosE, sinE, cosA * cosE];
/** The screen's horizontal axis as a world vector; pointer tilt pitches about it. */
export const VIEW_RIGHT: Vec3 = [cosA, 0, -sinA];
export const VIEW_UP: Vec3 = [-sinA * sinE, cosE, -cosA * sinE];

/** World point to flat view coordinates, in world units with y up. */
export function project([x, y, z]: Vec3): Point {
  return [
    x * VIEW_RIGHT[0] + z * VIEW_RIGHT[2],
    x * VIEW_UP[0] + y * VIEW_UP[1] + z * VIEW_UP[2],
  ];
}

/* ── Slab maths ── */
function rotateX([x, y, z]: Vec3, angle: number): Vec3 {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  return [x, y * cos - z * sin, y * sin + z * cos];
}

/** A point given in the slab's own axes, as a world point. */
export function slabPoint(slab: Slab, local: Vec3): Vec3 {
  const [x, y, z] = rotateX(local, slab.pitch);
  return [x + slab.position[0], y + slab.position[1], z + slab.position[2]];
}

/** All eight corners of a slab, for measuring the view. */
export function slabCorners(slab: Slab): Vec3[] {
  const [w, h, d] = slab.size.map((n) => n / 2);
  const corners: Vec3[] = [];
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) corners.push(slabPoint(slab, [sx * w, sy * h, sz * d]));
    }
  }
  return corners;
}
