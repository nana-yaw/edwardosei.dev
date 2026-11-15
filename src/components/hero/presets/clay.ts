/* ── Matte clay ───────────────────────────────────── */
// The site's 3D look: a maquette in warm clay, lit like a product shot. A
// soft warm key with real shadows, a neutral rim to draw the edges, the
// studio room as fill. Every colour is mixed from the site's variables.
// Amber is kept for what is switched on: the pulse, the lamps, the lit
// button and chart bar, and the house's own light.

import { type StylePreset, type Tone } from "./types";

/**
 * Clay between the page's dark (0) and its light (100), warmed with a share
 * of the accent. Without that share the mid tones go grey-green, because the
 * site's neutrals carry very little colour of their own; with it they sit
 * in umber and cream. No new hue: the accent is the site's.
 */
function clay(share: number, warmth = 0): Tone {
  const neutral = `color-mix(in oklab, var(--bg) ${100 - share}%, var(--text))`;
  return warmth === 0 ? neutral : `color-mix(in oklab, ${neutral} ${100 - warmth}%, var(--accent))`;
}

/** The light of the lit house: the accent softened toward the page's own light. */
const WARM: Tone = "color-mix(in oklab, var(--accent) 58%, var(--text))";

export const clayPreset: StylePreset = {
  surfaces: {
    kerb: clay(20, 6),
    // A dark plinth: the house is what catches the light.
    lowerPlate: clay(27, 9),
    upperPlate: clay(33, 9),
    core: clay(12, 6),
    walls: clay(86, 5),
    trim: clay(94, 3),
    roof: clay(36, 18),
    // Nearly the palest clay on the model, after the trim: the pipes have to read inside a shadow.
    pipes: clay(92, 2),
    collars: clay(64, 6),
    junctions: clay(30, 8),
    device: clay(7),
    steps: clay(40, 9),
    bulbBase: clay(52, 8),
  },
  screen: {
    tones: {
      surface: "var(--text)",
      panel: "color-mix(in oklab, var(--text) 84%, var(--muted))",
      ink: "var(--bg)",
      quiet: "color-mix(in oklab, var(--bg) 62%, var(--text))",
      line: "color-mix(in oklab, var(--muted) 86%, var(--text))",
      accent: "var(--accent)",
      onAccent: "var(--bg)",
    },
    off: clay(9, 3),
    ownLight: { wall: 0.3, phone: 0.3 },
    cornerRadius: 0.014,
    revealEdge: 0.16,
  },
  notifications: {
    card: clay(5),
    title: "var(--text)",
    detail: "var(--muted)",
    amount: "var(--accent)",
    dot: "var(--accent)",
    width: 0.93,
    cornerRadius: 0.2,
    slide: 0.5,
  },
  bulb: {
    glass: "color-mix(in oklab, var(--text) 86%, var(--accent))",
    glassOpacity: 0.42,
    glassRoughness: 0.18,
    light: WARM,
    emissive: 0.5,
    filament: 3.2,
    pilot: 0.45,
    flare: 1.6,
    core: { size: 0.42, opacity: 0.9 },
    halo: { size: 1.25, opacity: 0.3 },
    spotPeak: 1.2,
    lamp: { strength: 0.35, liveStrength: 1.5, reach: 3.2 },
    climb: { size: 0.7, opacity: 0.3 },
  },
  finish: {
    roughness: 0.86,
    deviceRoughness: 0.42,
    glassRoughness: 0.3,
    environment: 0.5,
    roomBlur: 0.04,
    tooth: { tile: 0.42, depth: 0.34, roughness: 0.16 },
    bevelSteps: 3,
  },
  highlight: { tone: "var(--accent)", pipe: { scale: 2.1, opacity: 0.5 }, shell: 0.2, ease: 9 },
  lamps: { off: clay(14, 4), on: "var(--accent)" },
  lights: {
    key: { tint: "var(--text)", whiten: 0.35, intensity: 3.3, from: [-4.2, 7.4, 5.8] },
    rim: { tint: "var(--text)", whiten: 1, intensity: 1.5, from: [5.5, 5.2, -5] },
    shadow: { mapSize: 2048, radius: 5, bias: -0.0005, normalBias: 0.022, strength: 0.94 },
  },
  rendering: { toneMapping: "neutral", exposure: 1 },
  edges: {
    plate: 0.022,
    plateCorner: 0.07,
    wall: 0.012,
    roof: 0.02,
    phone: 0.008,
    phoneCorner: 0.075,
    junction: 0.022,
    small: 0.012,
  },
  plumbing: {
    radius: 0.034,
    bend: 0.085,
    junction: 0.15,
    collar: { radius: 0.047, length: 0.034 },
    sides: 16,
    lamp: [0.074, 0.074, 0.014],
  },
  ground: {
    kerb: { width: 0.05, height: 0.03 },
    floor: { tone: clay(22, 5), radius: 3.2, peak: 1, tightness: 2, roughness: 1 },
    footShade: 0.08,
  },
  pulse: {
    tone: "color-mix(in oklab, var(--accent) 45%, var(--text))",
    size: 0.12,
    halo: { tone: "var(--accent)", size: 0.42, lift: 0.14, opacity: 0.6, tightness: 2.4 },
  },
  home: {
    dusk: { key: 0.72, rim: 0.85, environment: 0.7 },
    screenGlow: { wall: 0.22, phone: 0.2 },
    windows: {
      off: clay(10, 4),
      on: "color-mix(in oklab, var(--accent) 66%, var(--text))",
      falloff: 0.62,
      glow: 1.05,
      spill: { reach: 0.16, opacity: 0.35 },
    },
  },
};
