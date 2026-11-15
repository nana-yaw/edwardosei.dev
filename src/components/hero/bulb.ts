/* ── The bulb ─────────────────────────────────────── */
// The idea, modelled: a glass globe that narrows to a neck, a filament
// burning inside it, standing on a ridged screw base. The glass and the base
// are turned on a lathe from smooth outlines, finely enough that neither
// shows a facet. Its foot is at the origin, so the scene stands it on the
// deck and scales it from there.

import { CapsuleGeometry, LatheGeometry, SplineCurve, Vector2, type BufferGeometry } from "three";

/** Round the axis, and along the glass's outline. */
const TURNS = 40;
const OUTLINE_STEPS = 30;

type Profile = readonly (readonly [radius: number, height: number])[];

// As shares of the bulb's whole height, foot to crown. A smooth curve is run
// through these; the widest point sits two thirds of the way up, which is
// what tells a bulb from a ball.
const GLASS: Profile = [
  [0.125, 0.25],
  [0.135, 0.3],
  [0.185, 0.4],
  [0.265, 0.5],
  [0.322, 0.6],
  [0.34, 0.69],
  [0.322, 0.79],
  [0.262, 0.89],
  [0.15, 0.97],
  [0.0001, 1],
];

// Three ridges, a foot and a collar: the thread a bulb is screwed in by.
const BASE: Profile = [
  [0, 0],
  [0.075, 0],
  [0.105, 0.03],
  [0.105, 0.06],
  [0.13, 0.075],
  [0.13, 0.105],
  [0.105, 0.12],
  [0.13, 0.135],
  [0.13, 0.165],
  [0.105, 0.18],
  [0.135, 0.2],
  [0.135, 0.26],
  [0, 0.26],
];

/** How far up the bulb the middle of its globe is, as a share of its height: where its light comes from. */
export const BULB_HEART = 0.66;

function scaled(profile: Profile, height: number): Vector2[] {
  return profile.map(([radius, up]) => new Vector2(radius * height, up * height));
}

export function bulbGlass(height: number): BufferGeometry {
  return new LatheGeometry(new SplineCurve(scaled(GLASS, height)).getPoints(OUTLINE_STEPS), TURNS);
}

export function bulbBase(height: number): BufferGeometry {
  return new LatheGeometry(scaled(BASE, height), TURNS);
}

/** The filament: a small bright rod standing in the middle of the globe. */
export function bulbFilament(height: number): BufferGeometry {
  return new CapsuleGeometry(height * 0.034, height * 0.2, 6, 14).translate(0, height * (BULB_HEART - 0.04), 0);
}
