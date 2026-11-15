/* ── House parts ──────────────────────────────────── */
// The larger solids, each built where the scene will stand it: the plates
// of the foundation with their round corners and chamfer, the walls with
// their window openings, the roof with its fascia, the phone's body.

import { Shape, type BufferGeometry, type Color } from "three";
import { clayBox, merge, roundedBox, roundedOutline, skin, slab, tint, withOpenings } from "./clayParts";
import { type Edges, type Finish } from "./presets/types";
import { FOUNDATION, HOUSE_WALL, RIDGE, ROOF, type Gable } from "./stage";
import { dressing, type Pane } from "./windows";

interface Look {
  edges: Edges;
  finish: Finish;
}

/** A foundation plate about its own middle: round corners seen from above, a chamfer along its edges. */
export function plate(color: Color, { edges, finish }: Look): BufferGeometry {
  const outline = roundedOutline(FOUNDATION.width, FOUNDATION.depth, edges.plateCorner);
  // Extruded along z, then laid flat: its thickness becomes its height.
  const flat = slab(outline, FOUNDATION.thickness, edges.plate, 1).rotateX(Math.PI / 2).translate(0, FOUNDATION.thickness / 2, 0);
  return skin(tint(flat, color), finish.tooth.tile);
}

/**
 * A wall with its windows cut through it, `length` long and `height` tall,
 * standing on y = 0 with its outer face at z = 0 and looking down +z. The
 * mullions and sills are part of it. The scene turns it to face its side.
 */
export function wall(
  length: number,
  height: number,
  panes: readonly Pane[],
  colors: { wall: Color; trim: Color },
  { edges, finish }: Look,
  footShade: number,
): BufferGeometry {
  const outline = new Shape();
  outline.moveTo(-length / 2, 0);
  outline.lineTo(length / 2, 0);
  outline.lineTo(length / 2, height);
  outline.lineTo(-length / 2, height);
  outline.closePath();
  const body = tint(slab(withOpenings(outline, panes), HOUSE_WALL, edges.wall, 2).translate(0, 0, -HOUSE_WALL), colors.wall, footShade);
  const trim = panes.flatMap((pane) => dressing(pane).map((part) => tint(part, colors.trim)));
  return skin(merge([body, ...trim]), finish.tooth.tile);
}

/** A gable end standing on y = 0 with its outer face at z = 0, looking down +z, with its window cut through it. */
export function gable(
  { halfBase, rise }: Gable,
  pane: Pane,
  colors: { wall: Color; trim: Color },
  { edges, finish }: Look,
): BufferGeometry {
  const outline = new Shape();
  outline.moveTo(-halfBase, 0);
  outline.lineTo(halfBase, 0);
  outline.lineTo(0, rise);
  outline.closePath();
  const body = tint(slab(withOpenings(outline, [pane]), HOUSE_WALL, edges.wall, 2).translate(0, 0, -HOUSE_WALL), colors.wall);
  const trim = dressing(pane).map((part) => tint(part, colors.trim));
  return skin(merge([body, ...trim]), finish.tooth.tile);
}

/**
 * One roof slab, lying along x from its eave at the origin with its top
 * face on y = 0, and a fascia board closing its lower edge. The scene tilts
 * it; the right-hand slab is the left one turned about.
 */
export function roofSlab(colors: { roof: Color; trim: Color }, { edges, finish }: Look): BufferGeometry {
  const length = ROOF.length + ROOF.overhang;
  const slabPart = clayBox(
    [length, ROOF.thickness, ROOF.depth],
    [length / 2 - ROOF.overhang, -ROOF.thickness / 2, ROOF.centreZ],
    edges.roof,
    colors.roof,
    finish.bevelSteps,
  );
  const fascia = clayBox(
    [ROOF.fascia.width, ROOF.fascia.height, ROOF.depth + 0.012],
    [-ROOF.overhang + ROOF.fascia.width / 2 - 0.004, -ROOF.fascia.height / 2 + 0.006, ROOF.centreZ],
    edges.small,
    colors.trim,
    2,
  );
  return skin(merge([slabPart, fascia]), finish.tooth.tile);
}

/** The ridge cap, lying back along z from its front end at the origin. */
export function ridgeCap(color: Color, { edges, finish }: Look): BufferGeometry {
  const cap = tint(roundedBox([RIDGE.width, RIDGE.height, RIDGE.length], edges.small * 1.6, finish.bevelSteps), color);
  return skin(cap.translate(0, 0, -RIDGE.length / 2), finish.tooth.tile);
}

/** The phone's body about its own middle: a thin slab with properly round corners, its front face at z = thickness / 2. */
export function phoneBody(width: number, height: number, thickness: number, color: Color, { edges }: Look): BufferGeometry {
  const body = slab(roundedOutline(width, height, edges.phoneCorner), thickness, edges.phone, 3).translate(0, 0, -thickness / 2);
  return tint(body, color);
}
