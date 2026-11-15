/* ── Style preset ─────────────────────────────────── */
// How the scene looks, as plain data: every tone and light, how rough and
// how round things are, how strong each glow is. Two facts are fixed in the
// scene and not here: nothing is metal, and a lit screen is fully matte.
// Where things stand, how the pipes run, what is on the screens, the camera
// and the timing are not style and live elsewhere. No three imports here, so
// any page can read a preset.

import { type Vec3 } from "../projection";

/** A CSS colour built only from the site's variables. The browser resolves it at runtime. */
export type Tone = string;

/** The solid parts of the model, by the job each does in the picture. All are clay (see `Finish`) but the phone's body, which is smoother. */
export type SolidRole =
  | "kerb"
  | "lowerPlate"
  | "upperPlate"
  /** The block in the recess under the upper plate. */
  | "core"
  /** The side walls, the gable and the front wall's body. */
  | "walls"
  /** Window sills and mullions, the fascia and the ridge cap. */
  | "trim"
  | "roof"
  | "pipes"
  /** The rings at each joint of a pipe. */
  | "collars"
  | "junctions"
  /** The phone's body. */
  | "device"
  /** The doorstep and the ledge the phone stands on. */
  | "steps"
  /** The bulb's screw base. */
  | "bulbBase";

/** The made-up interface: what its text, panels and marks are painted in. */
export interface Screen {
  tones: {
    /** The page of the interface, and a panel standing on it. */
    surface: Tone;
    panel: Tone;
    /** Headings and figures, then labels, then hairlines and resting bars. */
    ink: Tone;
    quiet: Tone;
    line: Tone;
    /** What is settled or pressed: a Paid status, today's bar, the pay button. */
    accent: Tone;
    /** Text set on the accent. */
    onAccent: Tone;
  };
  /** A screen before it is switched on. */
  off: Tone;
  /** The share of a finished screen's light that is its own, on top of the studio's. */
  ownLight: { wall: number; phone: number };
  /**
   * Corner radius of the panels on the wall's screen, as a share of its
   * width. Its pills and search field, and every shape on the phone, are
   * rounded where that screen is laid out.
   */
  cornerRadius: number;
  /** How soft the edge of the light is as it spreads across the wall, as a share of the wall's width. */
  revealEdge: number;
}

/** A notification on the phone: a small dark banner, never a full-screen alert. */
export interface NotificationStyle {
  card: Tone;
  title: Tone;
  detail: Tone;
  amount: Tone;
  /** The mark at its left. */
  dot: Tone;
  /** Its width as a share of the phone's screen, and its corner radius as a share of its own height. */
  width: number;
  cornerRadius: number;
  /** How far above its place it starts, as a share of its own height. */
  slide: number;
}

/** The idea: a glass globe on a small clay base, with a filament burning inside. */
export interface BulbStyle {
  /** The glass: its tint, how much of what is behind shows through, and how smooth it is. */
  glass: Tone;
  glassOpacity: number;
  glassRoughness: number;
  /** The filament and the light it gives. */
  light: Tone;
  /** How strongly the glass and the filament shine at full, the share of that while the house is built, and the peak as the product goes live. */
  emissive: number;
  filament: number;
  pilot: number;
  flare: number;
  /**
   * Two tight additive spots, not a cloud: one hugging the filament, one
   * just past the glass. Sizes in bulb heights. They are drawn with the
   * pulse's soft spot and stand off the bulb by the pulse's `lift`: see
   * `Pulse.halo`.
   */
  core: { size: number; opacity: number };
  halo: { size: number; opacity: number };
  /** The most the two spots brighten as the bulb flares. The glass goes on to `flare`; an additive spot taken that far burns out to white. */
  spotPeak: number;
  /** The light it throws on the clay round it: before the product is live, and after. */
  lamp: { strength: number; liveStrength: number; reach: number };
  /** The spot of light that climbs from it to the wall as the product goes live. */
  climb: { size: number; opacity: number };
}

/**
 * How the clay is made. MeshStandardMaterial, rough and not metal, with a
 * fine tooth: one small tiling noise used as a bump map and to vary the
 * roughness a little, so a face is never a dead flat fill.
 */
export interface Finish {
  roughness: number;
  /** The two things that are not clay: the phone's body, and glass (the windows, and a screen before it is switched on). */
  deviceRoughness: number;
  glassRoughness: number;
  /**
   * The generated studio room, as fill and as a faint reflection: how strong
   * it is, and how far it is blurred first (0 is sharp). It is not counted
   * as a light. Every standard material in the scene takes it at this strength.
   */
  environment: number;
  roomBlur: number;
  /** The tooth: how big one tile of it is in world units, how deep it reads, and how much it varies the roughness. */
  tooth: { tile: number; depth: number; roughness: number };
  /**
   * Steps round the edges of the parts seen largest: the roof slabs, the
   * ridge cap and the junction boxes. Smaller and plainer parts are cut with
   * one to three steps, set where each is built. Tubes take `Plumbing.sides`.
   */
  bevelSteps: number;
}

export interface Lights {
  /** The key: large, soft and warm, from the upper left front. The only light that casts shadows. */
  key: { tint: Tone; whiten: number; intensity: number; from: Vec3 };
  /** The rim: neutral, from the upper right rear, to catch the roof's edge and the corners. */
  rim: { tint: Tone; whiten: number; intensity: number; from: Vec3 };
  shadow: {
    /** Texels across the shadow map, and how far each lookup is spread, in texels: the softness. */
    mapSize: number;
    radius: number;
    bias: number;
    normalBias: number;
    /** 1 is a full shadow; less lets some of the key through. */
    strength: number;
  };
}

export interface Rendering {
  toneMapping: "neutral" | "agx" | "aces";
  exposure: number;
}

/** Edge radii in world units (the model is about four units wide). Small on purpose. */
export interface Edges {
  plate: number;
  /** A plate's corners, seen from above. */
  plateCorner: number;
  wall: number;
  roof: number;
  phone: number;
  phoneCorner: number;
  junction: number;
  small: number;
}

export interface Plumbing {
  /** Tube radius, how tight a bend is, and the side of a junction box, in world units. */
  radius: number;
  bend: number;
  junction: number;
  /** The ring at each joint: its radius and its length. */
  collar: { radius: number; length: number };
  /** Sides round a tube. */
  sides: number;
  /** The lamp on each junction box: width, height, how far it stands proud. */
  lamp: Vec3;
}

export interface Ground {
  kerb: { width: number; height: number };
  /**
   * The studio floor: a tone a little lifted off the page that fades back
   * into it, so the model stands on something and its shadow has somewhere
   * to land. `radius` is how far from the model's middle it reaches, `peak`
   * how solid the tone is in the middle, and above 1 `tightness` keeps the
   * fade closer to the middle.
   */
  floor: { tone: Tone; radius: number; peak: number; tightness: number; roughness: number };
  /** Soft dark painted into the clay at the foot of each wall, as the share of tone lost there. The real shadows do the rest. */
  footShade: number;
}

export interface Pulse {
  tone: Tone;
  /** Across the ball, in world units. */
  size: number;
  /**
   * The soft spot round it: an additive plane facing the camera, `lift`
   * toward the camera from what it surrounds. One painted spot serves every
   * glow in the scene, so `tightness` (above 1 the spot hugs its middle)
   * also shapes the bulb's two spots, the light that climbs the wall and
   * the windows' spill, and `lift` also places the bulb's spots and the
   * climbing light.
   */
  halo: { tone: Tone; size: number; lift: number; opacity: number; tightness: number };
}

/** The payoff: the studio eases toward dusk and the house lights itself. */
export interface LitHome {
  /** The share of the key, the rim and the room that is left once the house is lit. */
  dusk: { key: number; rim: number; environment: number };
  /** Added to each screen's own light, so it glows against the dimmed studio without getting brighter. */
  screenGlow: { wall: number; phone: number };
  /**
   * The windows: glass set back in a real opening. `off` and `on` are the
   * glass before and after; `falloff` is how much darker a lit pane is at its
   * head than at its foot; `glow` how strongly it shines; `spill` the warm
   * light it lays on the sill and the wall just under it.
   */
  windows: { off: Tone; on: Tone; falloff: number; glow: number; spill: { reach: number; opacity: number } };
}

/** What a label does to its part of the picture while it is hovered or focused. */
export interface Highlight {
  tone: Tone;
  /** The sheath round a pipe: how many times the tube's radius, and how strong. */
  pipe: { scale: number; opacity: number };
  /** How much of the tone the house's shell gives off. */
  shell: number;
  /** Higher is snappier. */
  ease: number;
}

export interface StylePreset {
  surfaces: Record<SolidRole, Tone>;
  screen: Screen;
  notifications: NotificationStyle;
  bulb: BulbStyle;
  finish: Finish;
  highlight: Highlight;
  /** The lamp on each junction box: dark until the pulses set off. */
  lamps: { off: Tone; on: Tone };
  lights: Lights;
  rendering: Rendering;
  edges: Edges;
  plumbing: Plumbing;
  ground: Ground;
  pulse: Pulse;
  home: LitHome;
}
