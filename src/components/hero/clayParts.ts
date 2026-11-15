/* ── Clay parts ───────────────────────────────────── */
// The shapes the model is made of: boxes with softly rounded edges, and
// outlines pushed out into slabs (a plate with round corners, a wall with
// real window openings, a gable). Each carries its clay in vertex colours,
// so parts of different tones can be merged into one mesh and one draw
// call, and each is mapped so the clay's tooth runs at one size everywhere.

import {
  BoxGeometry,
  BufferAttribute,
  ExtrudeGeometry,
  Path,
  Shape,
  type BufferGeometry,
  type Color,
} from "three";
import { mergeGeometries, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { type Vec3 } from "./projection";

/** A rectangular opening in an outline: its lower left corner, then its size. */
export interface Opening {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Edges sharper than this stay edges when an extruded shape's faces are smoothed. */
const CREASE = Math.PI / 5;
/** Segments round each corner of an outline. */
const CORNER_STEPS = 10;

/**
 * A box with rounded edges and shared vertices. three's own rounded box is
 * unindexed, which costs several times the vertices for the same shape. The
 * normals are smooth, so the light does the rounding.
 */
export function roundedBox([width, height, depth]: Vec3, radius: number, steps = 3): BufferGeometry {
  const cuts = steps * 2 + 1;
  const round = Math.min(radius, width / 2, height / 2, depth / 2);
  const geometry = new BoxGeometry(1, 1, 1, cuts, cuts, cuts);
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  const inner = [width / 2 - round, height / 2 - round, depth / 2 - round];
  const halfCut = 0.5 / cuts;
  for (let index = 0; index < positions.count; index += 1) {
    const unit = [positions.getX(index), positions.getY(index), positions.getZ(index)];
    // Pulling every vertex half a cut toward the middle leaves the flat of a
    // face pointing straight out and fans the rest round the edge.
    const out = unit.map((n) => n - Math.sign(n) * halfCut);
    const length = Math.hypot(out[0], out[1], out[2]);
    const normal = out.map((n) => n / length);
    positions.setXYZ(
      index,
      inner[0] * Math.sign(unit[0]) + normal[0] * round,
      inner[1] * Math.sign(unit[1]) + normal[1] * round,
      inner[2] * Math.sign(unit[2]) + normal[2] * round,
    );
    normals.setXYZ(index, normal[0], normal[1], normal[2]);
  }
  return geometry;
}

/** A rectangle with round corners, centred on the origin. */
export function roundedOutline(width: number, height: number, radius: number): Shape {
  const x = width / 2;
  const y = height / 2;
  const r = Math.min(radius, x, y);
  const shape = new Shape();
  shape.moveTo(-x + r, -y);
  shape.lineTo(x - r, -y);
  shape.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x, y - r);
  shape.absarc(x - r, y - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-x + r, y);
  shape.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-x, -y + r);
  shape.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

/** Cuts rectangular openings out of an outline. */
export function withOpenings(shape: Shape, openings: readonly Opening[]): Shape {
  for (const { x, y, width, height } of openings) {
    const hole = new Path();
    hole.moveTo(x, y);
    hole.lineTo(x, y + height);
    hole.lineTo(x + width, y + height);
    hole.lineTo(x + width, y);
    hole.closePath();
    shape.holes.push(hole);
  }
  return shape;
}

/**
 * Pushes an outline out into a slab `thickness` deep along z, from z = 0,
 * with its edges eased by `bevel` (one step is a chamfer, more is a round).
 * The outline keeps its size: the bevel is cut into it, not added.
 */
export function slab(shape: Shape, thickness: number, bevel: number, bevelSteps: number): BufferGeometry {
  const extruded = new ExtrudeGeometry(shape, {
    depth: thickness - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: -bevel,
    bevelSegments: bevelSteps,
    curveSegments: CORNER_STEPS,
  });
  extruded.translate(0, 0, bevel);
  // Smooth across the bevel and round the corners, but keep true edges crisp.
  const smoothed = toCreasedNormals(extruded, CREASE);
  extruded.dispose();
  return smoothed;
}

/**
 * Gives a part its clay. `footShade` darkens it toward its foot, by that
 * share at the very bottom: a little of the soft dark where a wall meets
 * what it stands on. The real shadows do the rest.
 */
export function tint(geometry: BufferGeometry, color: Color, footShade = 0): BufferGeometry {
  const positions = geometry.getAttribute("position");
  let foot = Infinity;
  let head = -Infinity;
  for (let index = 0; index < positions.count; index += 1) {
    foot = Math.min(foot, positions.getY(index));
    head = Math.max(head, positions.getY(index));
  }
  const colors = new Float32Array(positions.count * 3);
  for (let index = 0; index < positions.count; index += 1) {
    const height = head === foot ? 1 : (positions.getY(index) - foot) / (head - foot);
    const shade = 1 - footShade * (1 - height);
    colors.set([color.r * shade, color.g * shade, color.b * shade], index * 3);
  }
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  return geometry;
}

/**
 * Maps a part for the clay's tooth: each vertex is laid flat along whichever
 * axis its face looks down, at `tile` world units per repeat. Every part
 * then shows the same grain at the same size, whatever its own shape.
 */
export function skin(geometry: BufferGeometry, tile: number): BufferGeometry {
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  const uvs = new Float32Array(positions.count * 2);
  for (let index = 0; index < positions.count; index += 1) {
    const [x, y, z] = [positions.getX(index), positions.getY(index), positions.getZ(index)];
    const [nx, ny, nz] = [Math.abs(normals.getX(index)), Math.abs(normals.getY(index)), Math.abs(normals.getZ(index))];
    const flat = nx >= ny && nx >= nz ? [z, y] : ny >= nz ? [x, z] : [x, y];
    uvs.set([flat[0] / tile, flat[1] / tile], index * 2);
  }
  geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
  return geometry;
}

/** A tinted rounded box whose middle sits at `centre`. */
export function clayBox(size: Vec3, centre: Vec3, radius: number, color: Color, steps = 3, footShade = 0): BufferGeometry {
  return tint(roundedBox(size, radius, steps), color, footShade).translate(centre[0], centre[1], centre[2]);
}

/** Several parts as one mesh. The parts are thrown away. */
export function merge(parts: BufferGeometry[]): BufferGeometry {
  // Boxes share vertices and extruded slabs do not: one mesh needs one kind.
  // Only unshare the boxes when a slab is in the mix: it multiplies their vertices.
  const mixed = parts.some((part) => !part.index);
  const loose = mixed ? parts.map((part) => (part.index ? part.toNonIndexed() : part)) : parts;
  loose.forEach((part) => part.clearGroups());
  const merged = mergeGeometries(loose, false);
  new Set([...parts, ...loose]).forEach((part) => part.dispose());
  if (!merged) throw new Error("The hero's clay parts could not be merged: their attributes differ.");
  return merged;
}
