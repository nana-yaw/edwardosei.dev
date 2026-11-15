/* ── One frame of the build ───────────────────────── */
// Moves every part to where the timeline says it is at `now`. Kept apart
// from the scene's JSX so the acting (this file) and the computing (the
// timeline) each stay readable. Nothing here allocates: it runs every frame.

import {
  Matrix4,
  type Color,
  type DirectionalLight,
  type Group,
  type InstancedMesh,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  type Object3D,
  type Quaternion,
} from "three";
import { moveGlows, type GlowRig, type GlowTones } from "./glows";
import { type StylePreset } from "./presets/types";
import { type Spread } from "./reveal";
import { DOORSTEP_REACH, DOORSTEP_SLAB, LEDGE_REACH, LEDGE_SLAB, PHONE, PIPE_RUNS, UPPER_Y } from "./stage";
import {
  NOTE_COUNT,
  doorstepSlide,
  houseRise,
  junctionGrow,
  lampGlow,
  ledgeSlide,
  lightsOn,
  lowerSettle,
  noteArrive,
  noteOpacity,
  phoneArrive,
  sideWallRise,
  upperRise,
  upperStarted,
  wallFill,
  wallGlow,
  windowWarm,
} from "./timeline";

/** Everything the frame loop moves, fades or reveals. The scene fills these in as it mounts. */
export interface SceneRig extends GlowRig {
  /** The studio's two lights. They dim toward dusk as the house lights up. */
  key: DirectionalLight | null;
  rim: DirectionalLight | null;
  lower: Group | null;
  core: Mesh | null;
  upper: Mesh | null;
  pipes: Mesh | null;
  /** One junction box per run, and the lamp on each. */
  junctions: InstancedMesh | null;
  lamps: InstancedMesh | null;
  lampMaterial: MeshBasicMaterial | null;
  /** One per run: the sleeve that glows when its label is hovered or focused. */
  sheaths: (Mesh | null)[];
  sideWall: Mesh | null;
  farWalls: Mesh | null;
  gable: Mesh | null;
  roofLeft: Group | null;
  roofRight: Group | null;
  ridge: Mesh | null;
  /** The glass of the windows, and the light each lays on the wall under it. */
  sidePanes: MeshStandardMaterial | null;
  gablePane: MeshStandardMaterial | null;
  sideSpill: MeshBasicMaterial | null;
  gableSpill: MeshBasicMaterial | null;
  /** The front wall with its dark screen, and the lit screen that spreads over it. */
  wall: Group | null;
  wallOff: Mesh | null;
  wallLit: Mesh | null;
  ledge: Mesh | null;
  phone: Group | null;
  phoneFace: MeshStandardMaterial | null;
  notes: (Mesh | null)[];
  doorstep: Mesh | null;
}

export function createRig(): SceneRig {
  return {
    model: null,
    pulses: null,
    halos: null,
    glow: null,
    bulb: null,
    bulbGlass: null,
    bulbFilament: null,
    key: null,
    rim: null,
    lower: null,
    core: null,
    upper: null,
    pipes: null,
    junctions: null,
    lamps: null,
    lampMaterial: null,
    sheaths: [],
    sideWall: null,
    farWalls: null,
    gable: null,
    roofLeft: null,
    roofRight: null,
    ridge: null,
    sidePanes: null,
    gablePane: null,
    sideSpill: null,
    gableSpill: null,
    wall: null,
    wallOff: null,
    wallLit: null,
    ledge: null,
    phone: null,
    phoneFace: null,
    notes: [],
    doorstep: null,
  };
}

/** The parts a label can light: the house's shell, then each run in the order the page lists them. */
export const PART_COUNT = 1 + PIPE_RUNS.length;

/** What a frame needs besides the time: built once by the scene, read every frame. */
export interface FrameContext {
  /** The look: the strengths and shares the frame loop scales by. */
  style: StylePreset;
  pipeTimes: Float32Array;
  pipeEnds: Uint32Array;
  lampOff: Color;
  lampOn: Color;
  highlight: Color;
  glowTones: GlowTones;
  /** The material the house's shell shares, and the lit wall's own. */
  shell: MeshStandardMaterial;
  wallFace: MeshStandardMaterial;
  /** How far the light has spread across the wall, and how far it has to go. */
  spread: Spread;
  spreadFull: number;
  /** How tall a notification's banner is, in world units. */
  noteHeight: number;
  /** The camera's turn, so the glow spots can face it. */
  facing: Quaternion;
}

/** A scale of exactly 0 cannot be inverted, so growing parts start a hair tall. */
const SLIVER = 0.001;
/** Below this a highlight is treated as settled, so the scene can come to rest. */
const SETTLED = 0.002;
/** Clear space above the first notification and between it and the next, in world units. */
const NOTE_MARGIN = 0.04;
const NOTE_GAP = 0.022;

const placed = new Matrix4();

function countLaid(times: Float32Array, now: number): number {
  let laid = 0;
  while (laid < times.length && times[laid] <= now) laid += 1;
  return laid;
}

/** Shows a part once it has started to grow, and stretches it along one axis from its foot. */
function grow(part: Object3D | null, amount: number, axis: "x" | "y" | "z"): void {
  if (!part) return;
  part.visible = amount > 0;
  part.scale[axis] = Math.max(amount, SLIVER);
}

/** A window: dark glass that begins to shine, and the light it then lays on its wall. */
function lightWindow(pane: MeshStandardMaterial | null, spill: MeshBasicMaterial | null, context: FrameContext, warm: number): void {
  const { windows } = context.style.home;
  if (pane) pane.emissiveIntensity = windows.glow * warm;
  if (spill) spill.opacity = warm * windows.spill.opacity;
}

/**
 * Eases each highlight toward what the labels ask for and shows it: the
 * shell gives off a little of the highlight's tone, a run's sleeve fades in
 * round it. Returns true while anything is still moving, so the scene knows
 * to draw another frame.
 */
export function easeHighlights(
  rig: SceneRig,
  context: FrameContext,
  levels: Float32Array,
  targets: Float32Array,
  step: number,
): boolean {
  const { highlight } = context.style;
  const ease = 1 - Math.exp(-step * highlight.ease);
  let moving = false;
  for (let part = 0; part < PART_COUNT; part += 1) {
    const gap = targets[part] - levels[part];
    if (Math.abs(gap) < SETTLED) levels[part] = targets[part];
    else {
      levels[part] += gap * ease;
      moving = true;
    }
  }
  context.shell.emissive.copy(context.highlight).multiplyScalar(levels[0] * highlight.shell);
  for (let run = 0; run < PIPE_RUNS.length; run += 1) {
    const sheath = rig.sheaths[run];
    if (!sheath) continue;
    sheath.visible = levels[run + 1] > 0;
    (sheath.material as MeshBasicMaterial).opacity = levels[run + 1] * highlight.pipe.opacity;
  }
  return moving;
}

export function applyFrame(rig: SceneRig, context: FrameContext, now: number): void {
  const { home, lights, notifications, screen } = context.style;
  const fill = wallFill(now);

  // The lower plate grows up out of the ground; nothing fades in, because a shadow cannot fade with it.
  grow(rig.lower, lowerSettle(now), "y");
  const risen = upperRise(now);
  if (rig.upper) {
    rig.upper.visible = upperStarted(now);
    rig.upper.position.y = UPPER_Y * risen;
  }
  if (rig.core) {
    rig.core.visible = upperStarted(now);
    rig.core.scale.y = Math.max(risen, SLIVER);
  }

  if (rig.pipes) {
    const laid = countLaid(context.pipeTimes, now);
    rig.pipes.visible = laid > 0;
    rig.pipes.geometry.setDrawRange(0, laid > 0 ? context.pipeEnds[laid - 1] : 0);
  }
  if (rig.junctions && rig.lamps) {
    for (let run = 0; run < PIPE_RUNS.length; run += 1) {
      const [x, y, z] = PIPE_RUNS[run][0];
      const size = junctionGrow(now, run);
      placed.makeScale(size, size, size).setPosition(x, y, z);
      rig.junctions.setMatrixAt(run, placed);
      rig.lamps.setMatrixAt(run, placed);
    }
    rig.junctions.instanceMatrix.needsUpdate = true;
    rig.lamps.instanceMatrix.needsUpdate = true;
  }
  rig.lampMaterial?.color.copy(context.lampOff).lerp(context.lampOn, lampGlow(now));
  moveGlows(rig, context.facing, context.glowTones, context.style, now);

  grow(rig.farWalls, houseRise("farWalls", now), "y");
  grow(rig.sideWall, sideWallRise(now), "y");
  grow(rig.wall, houseRise("frontWall", now), "y");
  grow(rig.gable, houseRise("gable", now), "y");
  // A roof slab lies along its own x, so stretching x runs it up the slope from the eave.
  grow(rig.roofLeft, houseRise("roofLeft", now), "x");
  grow(rig.roofRight, houseRise("roofRight", now), "x");
  grow(rig.ridge, houseRise("ridge", now), "z");

  // Going live. The studio eases toward dusk while the house's own light
  // comes up: the screen outward from where the bulb's light arrived, then
  // the windows.
  const lit = lightsOn(now);
  if (rig.key) rig.key.intensity = lights.key.intensity * (1 - (1 - home.dusk.key) * lit);
  if (rig.rim) rig.rim.intensity = lights.rim.intensity * (1 - (1 - home.dusk.rim) * lit);
  lightWindow(rig.sidePanes, rig.sideSpill, context, windowWarm(now, 0));
  lightWindow(rig.gablePane, rig.gableSpill, context, windowWarm(now, 1));

  context.spread.value = fill * (context.spreadFull + screen.revealEdge);
  if (rig.wallLit) rig.wallLit.visible = fill > 0;
  // Once the light has reached every corner, the dark screen under it is done.
  if (rig.wallOff) rig.wallOff.visible = fill < 1;
  const glow = wallGlow(now);
  context.wallFace.color.setScalar(glow);
  // As the studio dims the screen makes more of its own light, so it glows without getting any brighter.
  context.wallFace.emissiveIntensity = (screen.ownLight.wall + home.screenGlow.wall * lit) * glow;

  if (rig.ledge) {
    const out = ledgeSlide(now);
    rig.ledge.visible = out > 0;
    rig.ledge.position.z = LEDGE_SLAB.position[2] - LEDGE_REACH * (1 - out);
  }
  if (rig.phone) {
    // It grows from its foot on the ledge: no fade, so its shadow arrives with it.
    const arrived = phoneArrive(now);
    rig.phone.visible = arrived > 0;
    rig.phone.scale.setScalar(Math.max(arrived, SLIVER));
    if (rig.phoneFace) rig.phoneFace.emissiveIntensity = screen.ownLight.phone + home.screenGlow.phone * lit;
  }

  // The payments. The first banner takes the top of the phone's screen and
  // stays; each later one settles into the place under it, then goes.
  const height = context.noteHeight;
  for (let index = 0; index < NOTE_COUNT; index += 1) {
    const note = rig.notes[index];
    if (!note) continue;
    const opacity = noteOpacity(now, index);
    note.visible = opacity > 0;
    if (!note.visible) continue;
    const place = PHONE.imageHeight / 2 - NOTE_MARGIN - height / 2 - (index === 0 ? 0 : height + NOTE_GAP);
    note.position.y = place + height * notifications.slide * (1 - noteArrive(now, index));
    (note.material as MeshBasicMaterial).opacity = opacity;
  }

  if (rig.doorstep) {
    const out = doorstepSlide(now);
    rig.doorstep.visible = out > 0;
    rig.doorstep.position.z = DOORSTEP_SLAB.position[2] - DOORSTEP_REACH * (1 - out);
  }
}
