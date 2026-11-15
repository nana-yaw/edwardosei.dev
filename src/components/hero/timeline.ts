/* ── Build timeline ───────────────────────────────── */
// Where everything is at a given moment, as plain functions of seconds since
// the build started. No tween library: the canvas asks these every frame, so
// a paused tab picks up exactly where it stopped. The order is cause and
// effect: the idea goes into the foundation, the plumbing and the housing go
// up round it, the pulses carry their words into the wall, the idea's light
// climbs into the house, and only then do the payments arrive. After
// `REST_AT` nothing moves again until the pointer does.

/** The solid parts of the house, each rising in its own slot. */
export type HousePart = "farWalls" | "frontWall" | "gable" | "roofLeft" | "roofRight" | "ridge";

/**
 * The longest step the build's clock takes in one frame, so a frame drawn
 * after a rest does not skip ahead. The first frame is never later than this.
 */
export const LONGEST_STEP = 0.05;

/** Seconds. Tuned by eye; ask Edward before changing the feel. */
const IDEA_HOLD = 0.5;
const LOWER_SETTLE = 0.32;
const UPPER_START = 0.6;
const UPPER_RISE = 0.6;
/** The bulb comes down in front of the foundation as it opens, then slides in under the upper plate. */
const BULB_DOWN_START = 0.52;
const BULB_DOWN = 0.5;
const BULB_IN_START = 0.98;
const BULB_IN = 0.34;
/** Once in, the bulb eases down to a pilot light while the building goes on. */
const BULB_SETTLE = 0.35;
/** A junction box grows in over this long: nothing on the stage pops. */
const JUNCTION_GROW = 0.2;
/** And a pulse swells in over this long as it sets off. */
const PULSE_IN = 0.14;
const PIPE_START = 0.8;
const PIPE_STAGGER = 0.15;
const PIPE_DRAW = 0.55;
const SIDE_WALL_START = 1.5;
const SIDE_WALL_RISE = 0.5;
const HOUSE_TIMES: Record<HousePart, readonly [start: number, duration: number]> = {
  farWalls: [1.3, 0.42],
  frontWall: [1.42, 0.46],
  gable: [1.58, 0.36],
  roofLeft: [1.82, 0.36],
  roofRight: [1.82, 0.36],
  ridge: [1.98, 0.3],
};
/** The junction lamps come on over this long, ending as the first pulse sets off. */
const LAMP_WARM = 0.22;
/** Each pulse carries a word up with it: slow enough to read, one after another. */
const SURGE_START = 2.02;
const SURGE_TRAVEL = 0.7;
const SURGE_STAGGER = 0.14;
const TOKEN_IN = 0.14;
const TOKEN_DISSOLVE = 0.4;
/** Going live: the first word has arrived, and the bulb answers. */
const LIVE_START = SURGE_START + SURGE_TRAVEL;
const FLARE = 0.3;
/** The bulb's light leaves it and climbs to the foot of the wall. */
const CLIMB_START = LIVE_START + 0.1;
const CLIMB = 0.45;
/** The wall lights outward from the point above the bulb, where that light arrives. */
const FILL_START = LIVE_START + 0.34;
const FILL_RISE = 0.85;
/** Then the windows, the nearer ones first. */
const WINDOWS_START = FILL_START + 0.25;
const WINDOW_STAGGER = 0.2;
const WINDOW_WARM = 0.45;
/** The studio eases toward dusk as the house's own light takes over. */
const LIGHTS_START = FILL_START;
const LIGHTS_RISE = 1;
/** The phone's ledge slides out once the last word is gone, and the phone stands up on it. */
const LEDGE_START = 3.36;
const LEDGE_SLIDE = 0.46;
const PHONE_START = 3.56;
const PHONE_ARRIVE = 0.5;
const DOORSTEP_START = 3.65;
const DOORSTEP_SLIDE = 0.48;
/** The camera's own small move is over by here. */
const CAMERA_SETTLE = 4.4;
// The page lays the labels out where they sit at rest; the camera starts a
// little away from there. The canvas takes hold of them over this long, so
// its first frame does not jerk them to where the camera starts.
const LABEL_GRIP = 0.3;
/** The payments: the first arrives and stays, the rest pass through under it. */
const NOTE_START = 4.1;
/** Each later one arrives as the one before it leaves the same place. */
const NOTE_EVERY = 0.64;
const NOTE_IN = 0.34;
const NOTE_HOLD = 0.3;
const NOTE_OUT = 0.24;
/** How many notifications arrive. The scene draws exactly this many. */
export const NOTE_COUNT = 3;

/** When everything has arrived and the scene comes to rest. */
export const REST_AT = NOTE_START + NOTE_EVERY * (NOTE_COUNT - 1) + NOTE_IN + NOTE_HOLD + NOTE_OUT + 0.05;

/** When each label after "Your idea" lights, in the order the steps are numbered. */
const LIT_AT: readonly number[] = [
  IDEA_HOLD + 0.1,
  PIPE_START + PIPE_DRAW * 0.8,
  PIPE_START + PIPE_STAGGER + PIPE_DRAW * 0.8,
  PIPE_START + PIPE_STAGGER * 2 + PIPE_DRAW * 0.8,
  HOUSE_TIMES.farWalls[0] + 0.1,
  HOUSE_TIMES.roofLeft[0] + 0.1,
  FILL_START + FILL_RISE * 0.5,
  DOORSTEP_START + 0.2,
  NOTE_START + NOTE_IN * 0.5,
];

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Fast out of the gate, no overshoot: a plate that knows where it is going.
function easeOutExpo(p: number): number {
  return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
}

function easeOutCubic(p: number): number {
  return 1 - Math.pow(1 - p, 3);
}

function easeInOutCubic(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

// Arrives a touch past its place and settles back. Kept for the phone and
// the banners only; nothing built of clay overshoots.
function easeOutBack(p: number): number {
  const reach = 1.25;
  return 1 + (reach + 1) * Math.pow(p - 1, 3) + reach * Math.pow(p - 1, 2);
}

/** 1 on the first frame, 0 once the camera has settled: how much of its small move is still to come. */
export function cameraLeft(time: number): number {
  return 1 - easeInOutCubic(clamp01(time / CAMERA_SETTLE));
}

/** 0 on the first frame, 1 once the canvas holds each label on its point of the model. */
export function labelGrip(time: number): number {
  return easeInOutCubic(clamp01((time - LONGEST_STEP) / LABEL_GRIP));
}

/** 0 before the lower plate shows, 1 once it has settled on the plot. */
export function lowerSettle(time: number): number {
  return easeOutCubic(clamp01((time - IDEA_HOLD) / LOWER_SETTLE));
}

/** 0 while the upper plate lies in the lower one, 1 once the gap is open. */
export function upperRise(time: number): number {
  return easeOutExpo(clamp01((time - UPPER_START) / UPPER_RISE));
}

export function upperStarted(time: number): boolean {
  return time >= UPPER_START;
}

/* ── The bulb ── */
/** 0 while the bulb floats over the plot, 1 once it is down in front of the foundation. */
export function bulbDown(time: number): number {
  return clamp01((time - BULB_DOWN_START) / BULB_DOWN);
}

/** 0 until the bulb is down, 1 once it has slid in to its seat under the upper plate. */
export function bulbIn(time: number): number {
  return easeOutCubic(clamp01((time - BULB_IN_START) / BULB_IN));
}

/**
 * How brightly the bulb burns, as a share of full: 1 while it is the idea,
 * `pilot` while the house is built round it, over 1 for a moment as the
 * product goes live, then 1 for good.
 */
export function bulbGlow(time: number, pilot: number, flare: number): number {
  const seated = BULB_IN_START + BULB_IN;
  if (time < seated) return 1;
  if (time < LIVE_START) return 1 + (pilot - 1) * easeOutCubic(clamp01((time - seated) / BULB_SETTLE));
  const lit = clamp01((time - LIVE_START) / FLARE);
  if (lit < 1) return pilot + (flare - pilot) * easeOutCubic(lit);
  return flare + (1 - flare) * easeInOutCubic(clamp01((time - LIVE_START - FLARE) / 0.9));
}

/** How far the bulb's light has climbed toward the foot of the wall (0..1), or -1 when it is not climbing. */
export function lightClimb(time: number): number {
  if (time < CLIMB_START || time > CLIMB_START + CLIMB + 0.25) return -1;
  return easeInOutCubic(clamp01((time - CLIMB_START) / CLIMB));
}

/** How strongly the climbing light shows: in as it leaves the bulb, out as the wall takes it up. */
export function lightClimbStrength(time: number): number {
  const p = (time - CLIMB_START) / (CLIMB + 0.25);
  if (p <= 0 || p >= 1) return 0;
  return Math.min(1, p / 0.2, (1 - p) / 0.35);
}

/* ── The plumbing ── */
/** The moment the piece `share` of the way along run `run` is laid. Runs start one after another. */
export function pipeRevealTime(run: number, share: number): number {
  // The inverse of an ease-out, so each run slows into the foot of the wall.
  const eased = 1 - Math.cbrt(1 - clamp01(share));
  return PIPE_START + run * PIPE_STAGGER + PIPE_DRAW * eased;
}

/** 0 while the junction lamps are dark, 1 once they are lit: they come on just before the first pulse leaves. */
export function lampGlow(time: number): number {
  return easeInOutCubic(clamp01((time - (SURGE_START - LAMP_WARM)) / LAMP_WARM));
}

/** 0 before run `run`'s junction box shows, 1 once it has grown in. */
export function junctionGrow(time: number, run: number): number {
  return easeOutCubic(clamp01((time - PIPE_START - run * PIPE_STAGGER) / JUNCTION_GROW));
}

/** How full run `run`'s pulse is as it sets off: it swells in, it does not pop. */
export function surgeSwell(time: number, run: number): number {
  return clamp01((time - SURGE_START - run * SURGE_STAGGER) / PULSE_IN);
}

/** How far run `run`'s pulse has climbed during the surge (0..1), or -1 when it is not climbing. */
export function surgeShare(time: number, run: number): number {
  const start = SURGE_START + run * SURGE_STAGGER;
  if (time < start || time > start + SURGE_TRAVEL + 0.08) return -1;
  return easeInOutCubic(clamp01((time - start) / SURGE_TRAVEL));
}

/* ── The words the pulses carry: once each, never again ── */
/** How solid run `run`'s word is: in at the bend, whole all the way up, gone soon after it arrives. */
export function tokenOpacity(time: number, run: number): number {
  const start = SURGE_START + run * SURGE_STAGGER;
  const arrival = start + SURGE_TRAVEL;
  if (time <= start || time >= arrival + TOKEN_DISSOLVE) return 0;
  if (time > arrival) return 1 - easeInOutCubic((time - arrival) / TOKEN_DISSOLVE);
  return clamp01((time - start) / TOKEN_IN);
}

/** 0 while run `run`'s word rides its pulse, rising to 1 as it dissolves into the wall. */
export function tokenDissolve(time: number, run: number): number {
  return clamp01((time - (SURGE_START + run * SURGE_STAGGER + SURGE_TRAVEL)) / TOKEN_DISSOLVE);
}

/* ── The housing ── */
/** 0 before a part of the house starts to go up, 1 once it has settled. */
export function houseRise(part: HousePart, time: number): number {
  const [start, duration] = HOUSE_TIMES[part];
  return easeOutCubic(clamp01((time - start) / duration));
}

export function sideWallRise(time: number): number {
  return easeOutCubic(clamp01((time - SIDE_WALL_START) / SIDE_WALL_RISE));
}

/**
 * What the idea's label has to point at: the bulb floating beside it, then
 * nothing once the bulb has set off, then the front wall once that has risen
 * behind it.
 */
export type IdeaStage = "floating" | "adrift" | "housed";

/** `wallShare` is how far up the front wall the label hangs: 0 at the wall's foot, 1 at its top. */
export function ideaStage(time: number, wallShare: number): IdeaStage {
  if (time < BULB_DOWN_START) return "floating";
  return houseRise("frontWall", time) >= wallShare ? "housed" : "adrift";
}

/* ── Going live ── */
/** 0 while the front wall's screen is dark, 1 once the light has spread to its far corners. */
export function wallFill(time: number): number {
  return easeInOutCubic(clamp01((time - FILL_START) / FILL_RISE));
}

/** Brightness of the lit screen: it comes up as it fills, like lights coming on inside. */
export function wallGlow(time: number): number {
  return 0.7 + 0.3 * easeOutCubic(clamp01((time - FILL_START) / (FILL_RISE * 1.3)));
}

/** 0 while window `index` is dark glass, 1 once it is lit. They light in the order the scene lists them. */
export function windowWarm(time: number, index: number): number {
  return easeInOutCubic(clamp01((time - WINDOWS_START - index * WINDOW_STAGGER) / WINDOW_WARM));
}

/** 0 while the house is only built, 1 once its own light has taken over from the studio's. */
export function lightsOn(time: number): number {
  return easeInOutCubic(clamp01((time - LIGHTS_START) / LIGHTS_RISE));
}

/** 0 while the phone's ledge hides under the wall, 1 once it is out. */
export function ledgeSlide(time: number): number {
  return easeOutExpo(clamp01((time - LEDGE_START) / LEDGE_SLIDE));
}

/** 0 before the phone shows, 1 once it stands on its ledge. It arrives a touch past full size and settles. */
export function phoneArrive(time: number): number {
  const p = clamp01((time - PHONE_START) / PHONE_ARRIVE);
  return p <= 0 ? 0 : easeOutBack(p);
}

/** 0 while the doorstep hides under the foundation, 1 once it is out. */
export function doorstepSlide(time: number): number {
  return easeOutExpo(clamp01((time - DOORSTEP_START) / DOORSTEP_SLIDE));
}

/* ── The payments ── */
/**
 * How far notification `index` has slid into place (0..1). They arrive one
 * after another, each easing in: a banner settling, not an alert popping.
 */
export function noteArrive(time: number, index: number): number {
  return easeOutBack(clamp01((time - NOTE_START - index * NOTE_EVERY) / NOTE_IN));
}

/** How solid notification `index` is. The first stays; each later one holds a moment and goes. */
export function noteOpacity(time: number, index: number): number {
  const start = NOTE_START + index * NOTE_EVERY;
  const shown = clamp01((time - start) / (NOTE_IN * 0.7));
  if (index === 0) return shown;
  return shown * (1 - clamp01((time - start - NOTE_IN - NOTE_HOLD) / NOTE_OUT));
}

/** How many labels are lit: the idea from the start, then one at each mark. */
export function litCount(time: number): number {
  let count = 1;
  for (const mark of LIT_AT) {
    if (time >= mark) count += 1;
  }
  return count;
}
