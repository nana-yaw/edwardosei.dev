/* ── The plumbing, in clay ────────────────────────── */
// Round tubes with a swept bend where each run turns up, and a collar at
// every joint: where a pipe leaves its junction box, either side of the
// bend, and where the riser goes into the floor. All three runs are one
// mesh. Its triangles are stored in the order the pieces are laid, so the
// frame loop lays pipe by widening a draw range and nothing else. Sizes come
// from the style preset; routes from the stage.

import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  TorusGeometry,
  type Color,
} from "three";
import { merge, roundedBox } from "./clayParts";
import { type Plumbing } from "./presets/types";
import { type Vec3 } from "./projection";
import { FLOOR, FOUNDATION, PIPE, PIPE_RUNS, distance, runLength } from "./stage";
import { pipeRevealTime } from "./timeline";

export interface PipeParts {
  geometry: BufferGeometry;
  /** The moment each piece is laid, earliest first. */
  times: Float32Array;
  /** How many indices are drawn once each piece is laid. */
  ends: Uint32Array;
}

interface Piece {
  time: number;
  indices: number[];
}

interface Raw {
  positions: number[];
  normals: number[];
  colors: number[];
}

/** Steps round a bend. */
const BEND_STEPS = 12;

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

/** Adds a ready-made shape at `centre` and returns its triangles, renumbered. The shape is thrown away. */
function addShape(raw: Raw, shape: BufferGeometry, centre: Vec3, color: Color): number[] {
  const base = raw.positions.length / 3;
  const positions = shape.getAttribute("position");
  const normals = shape.getAttribute("normal");
  for (let index = 0; index < positions.count; index += 1) {
    raw.positions.push(
      positions.getX(index) + centre[0],
      positions.getY(index) + centre[1],
      positions.getZ(index) + centre[2],
    );
    raw.normals.push(normals.getX(index), normals.getY(index), normals.getZ(index));
    raw.colors.push(color.r, color.g, color.b);
  }
  const indices = Array.from(shape.getIndex()?.array ?? [], (index) => index + base);
  shape.dispose();
  return indices;
}

/** Adds one ring of a tube round `centre`, facing along `along`, and returns its first vertex. */
function addRing(raw: Raw, centre: Vec3, along: Vec3, color: Color, { radius, sides }: Plumbing): number {
  const base = raw.positions.length / 3;
  const [sx, sy, sz] = cross(along, Math.abs(along[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0]);
  const sideLength = Math.hypot(sx, sy, sz);
  const side: Vec3 = [sx / sideLength, sy / sideLength, sz / sideLength];
  const up = cross(along, side);
  for (let step = 0; step < sides; step += 1) {
    const angle = (step / sides) * Math.PI * 2;
    const out = [0, 1, 2].map((axis) => Math.cos(angle) * side[axis] + Math.sin(angle) * up[axis]);
    raw.positions.push(centre[0] + out[0] * radius, centre[1] + out[1] * radius, centre[2] + out[2] * radius);
    raw.normals.push(out[0], out[1], out[2]);
    raw.colors.push(color.r, color.g, color.b);
  }
  return base;
}

/** The wall of tube between two rings, wound so it faces outward. */
function tubeBetween(from: number, to: number, sides: number): number[] {
  const indices: number[] = [];
  for (let step = 0; step < sides; step += 1) {
    const next = (step + 1) % sides;
    indices.push(from + step, from + next, to + next, from + step, to + next, to + step);
  }
  return indices;
}

/** A collar: a short fat ring round the pipe, lying along x or standing along y. */
function collar({ collar: ring, sides }: Plumbing, upright: boolean): BufferGeometry {
  const shape = new CylinderGeometry(ring.radius, ring.radius, ring.length, sides, 1, false);
  return upright ? shape : shape.rotateZ(Math.PI / 2);
}

/** Every run cut into short pieces, each stamped with the moment it is laid. */
export function buildPipes(plumbing: Plumbing, pipe: Color, collars: Color): PipeParts {
  const raw: Raw = { positions: [], normals: [], colors: [] };
  const pieces: Piece[] = [];
  const { bend, radius, sides } = plumbing;
  PIPE_RUNS.forEach((run, runIndex) => {
    const [start, corner, top] = run;
    const total = runLength(run);
    // Which way the leg runs across the gap: toward the middle from its junction box.
    const heading = Math.sign(corner[0] - start[0]);
    const legEnd: Vec3 = [corner[0] - heading * bend, corner[1], corner[2]];
    const riserFoot: Vec3 = [corner[0], corner[1] + bend, corner[2]];
    const at = (share: number) => pipeRevealTime(runIndex, share);
    const lay = (from: Vec3, to: Vec3, travelled: number) => {
      const leg = distance(from, to);
      const along: Vec3 = [(to[0] - from[0]) / leg, (to[1] - from[1]) / leg, (to[2] - from[2]) / leg];
      const count = Math.max(1, Math.ceil(leg / PIPE.piece));
      let ring = addRing(raw, from, along, pipe, plumbing);
      for (let piece = 0; piece < count; piece += 1) {
        const reach = (leg * (piece + 1)) / count;
        const next = addRing(raw, [from[0] + along[0] * reach, from[1] + along[1] * reach, from[2] + along[2] * reach], along, pipe, plumbing);
        pieces.push({ time: at((travelled + (leg * piece) / count) / total), indices: tubeBetween(ring, next, sides) });
        ring = next;
      }
    };

    // Out of the junction box, with a collar where it leaves.
    const boxFace = plumbing.junction / 2 + plumbing.collar.length / 2;
    pieces.push({ time: at(0), indices: addShape(raw, collar(plumbing, false), [start[0] + heading * boxFace, start[1], start[2]], collars) });
    lay(start, legEnd, 0);

    // The bend: a quarter of a ring, swept from the leg's end up into the riser, a collar either side.
    const legLength = distance(start, corner);
    const sweep = new TorusGeometry(bend, radius, sides, BEND_STEPS, Math.PI / 2).rotateZ(heading > 0 ? -Math.PI / 2 : Math.PI);
    pieces.push({ time: at((legLength - bend) / total), indices: addShape(raw, collar(plumbing, false), legEnd, collars) });
    pieces.push({ time: at((legLength - bend * 0.5) / total), indices: addShape(raw, sweep, [legEnd[0], riserFoot[1], corner[2]], pipe) });
    pieces.push({ time: at(legLength / total), indices: addShape(raw, collar(plumbing, true), riserFoot, collars) });

    // Up through the floor, with a collar where it goes in.
    lay(riserFoot, top, legLength + bend);
    const ceiling = FLOOR - FOUNDATION.thickness - plumbing.collar.length / 2;
    pieces.push({ time: at(0.94), indices: addShape(raw, collar(plumbing, true), [top[0], ceiling, top[2]], collars) });
  });
  pieces.sort((a, b) => a.time - b.time);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(raw.positions), 3));
  geometry.setAttribute("normal", new BufferAttribute(new Float32Array(raw.normals), 3));
  geometry.setAttribute("color", new BufferAttribute(new Float32Array(raw.colors), 3));
  // The clay's material samples its tooth by uv. A tube is too thin to show any, so one texel will do.
  geometry.setAttribute("uv", new BufferAttribute(new Float32Array((raw.positions.length / 3) * 2), 2));
  geometry.setIndex(pieces.flatMap((piece) => piece.indices));
  let drawn = 0;
  return {
    geometry,
    times: Float32Array.from(pieces, (piece) => piece.time),
    ends: Uint32Array.from(pieces, (piece) => (drawn += piece.indices.length)),
  };
}

/** One junction box about its own middle. The scene draws one per run and grows each in as its run starts. */
export function junctionBox({ junction }: Plumbing, bevel: number, steps: number): BufferGeometry {
  return roundedBox([junction, junction, junction], bevel, steps);
}

/** The lamp on a junction box, on the face the camera sees, about the box's middle. */
export function junctionLamp({ junction, lamp }: Plumbing): BufferGeometry {
  return new BoxGeometry(...lamp).translate(0, 0, junction / 2 + lamp[2] / 2 - 0.004);
}

/**
 * One loose sleeve per run, round its whole length: what glows when that
 * run's label is hovered or focused. Open tubes, a few times the pipe's
 * radius, drawn additively by the scene.
 */
export function buildSheaths({ radius, sides }: Plumbing, scale: number): BufferGeometry[] {
  return PIPE_RUNS.map((run) =>
    merge(
      run.slice(1).map((to, index) => {
        const from = run[index];
        const leg = new CylinderGeometry(radius * scale, radius * scale, distance(from, to), sides, 1, true);
        // A cylinder stands along y: a leg across the gap is laid on its side.
        if (from[1] === to[1]) leg.rotateZ(Math.PI / 2);
        return leg.translate((from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2);
      }),
    ),
  );
}
