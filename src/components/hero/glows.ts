/* ── What glows ───────────────────────────────────── */
// The bulb, the light that climbs out of it, and the pulses in the pipes.
// Each glow is a tight soft spot facing the camera: two for the bulb, one
// hugging the filament and one just past the glass, never a cloud. The bulb
// also owns the one small light in the model, which rides with it into the
// foundation and brightens when the product goes live, so the clay round it
// is really lit by it. Nothing here allocates: it runs every frame.

import {
  Color,
  Matrix4,
  Vector3,
  type Group,
  type InstancedMesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  type PointLight,
  type Quaternion,
} from "three";
import { BULB_HEART } from "./bulb";
import { type StylePreset } from "./presets/types";
import { VIEW_DIRECTION } from "./projection";
import { BULB, FLOOR, HOUSE, PIPE_RUNS, pointAlong, riserShare } from "./stage";
import {
  bulbDown,
  bulbGlow,
  bulbIn,
  lightClimb,
  lightClimbStrength,
  lightsOn,
  surgeShare,
  surgeSwell,
} from "./timeline";

/** The parts of the scene that glow. */
export interface GlowRig {
  /** The whole model: the glow spots are placed through its transform. */
  model: Group | null;
  pulses: InstancedMesh | null;
  /** One spot per pulse, then the bulb's two, then the climbing light's. */
  halos: InstancedMesh | null;
  glow: PointLight | null;
  bulb: Group | null;
  bulbGlass: MeshStandardMaterial | null;
  bulbFilament: MeshBasicMaterial | null;
}

/** The tones the glows are painted in, resolved once by the scene. */
export interface GlowTones {
  pulse: Color;
  warm: Color;
}

/** Where the bulb's spots and the climbing light's spot sit among the halos. */
const CORE_HALO = PIPE_RUNS.length;
const BULB_HALO = PIPE_RUNS.length + 1;
const CLIMB_HALO = PIPE_RUNS.length + 2;
export const HALO_COUNT = PIPE_RUNS.length + 3;
/** How far up the wall the climbing light goes before the wall has taken it up. */
const CLIMB_TOP = 0.3;

const matrix = new Matrix4();
const point = [0, 0, 0];
const heart = new Vector3();
const spot = new Vector3();
const spotSize = new Vector3();
const tone = new Color();
const toCamera = new Vector3(...VIEW_DIRECTION);

/** Where on its run a pulse is once it has climbed `surge` of the way: from the last bend up to the foot of the wall. */
export function surgePoint(run: number, surge: number): number {
  const from = riserShare(PIPE_RUNS[run]) * 0.72;
  return from + (1 - from) * surge;
}

/** Puts spot `index` at a point in the model, `size` across, shining at `strength` of `color`. Zero hides it. */
function placeSpot(
  rig: GlowRig,
  facing: Quaternion,
  index: number,
  at: Vector3,
  size: number,
  color: Color,
  strength: number,
  lift: number,
): void {
  const { model, halos } = rig;
  if (!model || !halos) return;
  if (strength <= 0 || size <= 0) {
    matrix.makeScale(0, 0, 0);
    halos.setMatrixAt(index, matrix);
    return;
  }
  // The spots are not inside the model's turning rigs, so each is placed in
  // the scene's own space, a little toward the camera and clear of what it surrounds.
  spot.copy(at).applyMatrix4(model.matrixWorld).addScaledVector(toCamera, lift);
  matrix.compose(spot, facing, spotSize.setScalar(size));
  halos.setMatrixAt(index, matrix);
  // Additive: a darker tone is a fainter glow.
  halos.setColorAt(index, tone.copy(color).multiplyScalar(strength));
}

/** The bulb: where it is, how brightly it burns, and where its light has got to. */
function moveBulb(rig: GlowRig, facing: Quaternion, tones: GlowTones, style: StylePreset, now: number): void {
  const { bulb: look, pulse } = style;
  // Down in front of the foundation, then in under it. Coming down it moves
  // forward first and falls last, so it clears the plate's edge on the way.
  const down = bulbDown(now);
  const forward = 1 - (1 - down) * (1 - down) * (1 - down);
  const fall = down * down * (3 - 2 * down);
  const slide = bulbIn(now);
  const { float, front, seat } = BULB;
  const scale = BULB.floatScale + (1 - BULB.floatScale) * fall;
  const x = float[0] + (front[0] - float[0]) * forward + (seat[0] - front[0]) * slide;
  const y = float[1] + (front[1] - float[1]) * fall + (seat[1] - front[1]) * slide;
  const z = float[2] + (front[2] - float[2]) * forward + (seat[2] - front[2]) * slide;
  if (rig.bulb) {
    rig.bulb.position.set(x, y, z);
    rig.bulb.scale.setScalar(scale);
  }
  const burning = bulbGlow(now, look.pilot, look.flare);
  if (rig.bulbGlass) rig.bulbGlass.emissiveIntensity = look.emissive * burning;
  rig.bulbFilament?.color.copy(tones.warm).multiplyScalar(look.filament * Math.min(1, burning));
  const tall = BULB.height * scale;
  heart.set(x, y + tall * BULB_HEART, z);
  const shine = Math.min(look.spotPeak, burning);
  placeSpot(rig, facing, CORE_HALO, heart, tall * look.core.size, tones.warm, look.core.opacity * shine, pulse.halo.lift);
  placeSpot(rig, facing, BULB_HALO, heart, tall * look.halo.size, tones.warm, look.halo.opacity * shine, pulse.halo.lift);

  // The one small light rides in the bulb, and brightens when the product goes live.
  if (rig.glow) {
    const live = lightsOn(now);
    rig.glow.position.copy(heart);
    rig.glow.distance = look.lamp.reach;
    rig.glow.intensity = (look.lamp.strength + (look.lamp.liveStrength - look.lamp.strength) * live) * burning;
  }

  // The light on its way up: out of the bulb, through the floor, onto the foot of the wall.
  const climbed = lightClimb(now);
  if (climbed < 0) {
    placeSpot(rig, facing, CLIMB_HALO, heart, 0, tones.warm, 0, 0);
    return;
  }
  heart.set(x, heart.y + (FLOOR + CLIMB_TOP - heart.y) * climbed, z + (HOUSE.front - z) * climbed);
  placeSpot(rig, facing, CLIMB_HALO, heart, look.climb.size * (0.6 + 0.4 * climbed), tones.warm, look.climb.opacity * lightClimbStrength(now), pulse.halo.lift);
}

/** Everything that glows, for this moment. */
export function moveGlows(rig: GlowRig, facing: Quaternion, tones: GlowTones, style: StylePreset, now: number): void {
  const { model, pulses, halos } = rig;
  if (!model || !pulses || !halos) return;
  model.updateWorldMatrix(true, false);
  moveBulb(rig, facing, tones, style, now);

  // The pulses: each up its riser once, carrying its word, and never again.
  let climbing = false;
  for (let run = 0; run < PIPE_RUNS.length; run += 1) {
    const surge = surgeShare(now, run);
    if (surge < 0) {
      matrix.makeScale(0, 0, 0);
      pulses.setMatrixAt(run, matrix);
      placeSpot(rig, facing, run, heart, 0, tones.pulse, 0, 0);
      continue;
    }
    climbing = true;
    const swell = surgeSwell(now, run);
    const size = style.pulse.size * swell;
    pointAlong(PIPE_RUNS[run], surgePoint(run, surge), point);
    matrix.makeScale(size, size, size).setPosition(point[0], point[1], point[2]);
    pulses.setMatrixAt(run, matrix);
    heart.set(point[0], point[1], point[2]);
    placeSpot(rig, facing, run, heart, style.pulse.halo.size, tones.pulse, style.pulse.halo.opacity * swell, style.pulse.halo.lift);
  }
  pulses.visible = climbing;
  pulses.instanceMatrix.needsUpdate = true;
  halos.instanceMatrix.needsUpdate = true;
  if (halos.instanceColor) halos.instanceColor.needsUpdate = true;
}
