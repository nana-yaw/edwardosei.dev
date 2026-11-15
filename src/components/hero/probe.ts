/* ── Dev probe ────────────────────────────────────── */
// Dev builds publish the renderer's counters on `window.__r3f` for the
// browser tests and the capture script, and time the build's frames for
// them. Every number is read from the scene as it stands, none is assumed.
// Production builds never call anything here, so they carry no stopwatch
// and time nothing.

import { type DirectionalLight, type InstancedMesh, type Mesh, type Scene, type WebGLRenderer } from "three";
import { assetTextures, type HeroAssets } from "./heroAssets";

interface FrameTimes {
  count: number;
  average: number;
  worst: number;
  /** Frames that took longer than a 60 fps frame allows, with a little slack for the timer. */
  over: number;
  /** The first few of those: when in the build each fell, and how long it took. */
  slow: string[];
}

export interface Stopwatch {
  /** When the last frame was drawn. */
  last: number;
  /** How long each frame of the build took, and when in the build it fell. */
  taken: Float32Array;
  at: Float32Array;
  count: number;
}

interface HeroProbe {
  /** three's own counters for the last frame and for live GPU objects. */
  info: WebGLRenderer["info"];
  /** Vertices in the scene, read from its geometries: each mesh's once, and with every copy of an instanced mesh counted. */
  vertices: { perMesh: number; perInstance: number };
  pixelRatio: number;
  /** The key light's shadow map as the renderer made it. There is none until a frame has been drawn. */
  shadowMap: () => string;
  /** Each texture's size in pixels, read from the texture. */
  textures: string[];
  /** Seconds since the build started. */
  time: () => number;
  /** How many frames have been drawn. At rest this must not move. */
  frames: () => number;
  /** How long the frames of the build took, in milliseconds, in real time. */
  frameTimes: () => FrameTimes;
  /** Pins the build to one moment, or lets it run again with null. The capture script steps through with this. */
  hold: (seconds: number | null) => void;
}

declare global {
  interface Window {
    /** Dev builds only. The browser tests and the capture script read this. */
    __r3f?: HeroProbe;
  }
}

/** What the probe reads. The scene hands these over; the probe keeps nothing of its own but the stopwatch. */
interface ProbeSource {
  gl: WebGLRenderer;
  scene: Scene;
  assets: HeroAssets;
  /** The key light, once it is mounted: its shadow map is the one reported. */
  key: () => DirectionalLight | null;
  time: () => number;
  frames: () => number;
  hold: (seconds: number | null) => void;
}

/** A 60 fps frame, with slack for the timer's own grain. */
const FRAME_LIMIT = 1000 / 60 + 1.5;
const MAX_FRAMES = 2048;

/** Notes one drawn frame. `now` is the build's clock; `counted` is false at rest and while the capture script holds the clock. */
export function clockFrame(watch: Stopwatch, now: number, counted: boolean): void {
  const stamp = performance.now();
  if (counted && watch.last > 0 && watch.count < MAX_FRAMES) {
    watch.taken[watch.count] = stamp - watch.last;
    watch.at[watch.count] = now;
    watch.count += 1;
  }
  watch.last = stamp;
}

function frameTimes({ taken, at, count }: Stopwatch): FrameTimes {
  const seen = Array.from(taken.subarray(0, count));
  const total = seen.reduce((sum, each) => sum + each, 0);
  const slow = seen.flatMap((each, index) => (each > FRAME_LIMIT ? [`${at[index].toFixed(2)}s ${each.toFixed(1)}ms`] : []));
  return {
    count: seen.length,
    average: seen.length ? total / seen.length : 0,
    worst: seen.reduce((most, each) => Math.max(most, each), 0),
    over: slow.length,
    slow: slow.slice(0, 16),
  };
}

/** Publishes the probe on the window. Returns the stopwatch for the frame loop to feed, and what takes the probe down again. */
export function publishProbe({ gl, scene, assets, key, time, frames, hold }: ProbeSource): { watch: Stopwatch; withdraw: () => void } {
  const vertices = { perMesh: 0, perInstance: 0 };
  scene.traverse((object) => {
    const geometry = (object as Mesh).geometry;
    if (!geometry) return;
    const count = geometry.getAttribute("position").count;
    vertices.perMesh += count;
    vertices.perInstance += count * ((object as InstancedMesh).isInstancedMesh ? (object as InstancedMesh).count : 1);
  });
  const watch: Stopwatch = { last: 0, taken: new Float32Array(MAX_FRAMES), at: new Float32Array(MAX_FRAMES), count: 0 };
  window.__r3f = {
    info: gl.info,
    vertices,
    pixelRatio: gl.getPixelRatio(),
    shadowMap: () => {
      const map = key()?.shadow.map;
      return map ? `${map.width}x${map.height}` : "none yet";
    },
    textures: assetTextures(assets).map(([name, texture]) => `${name} ${texture.image.width}x${texture.image.height}`),
    time,
    frames,
    frameTimes: () => frameTimes(watch),
    hold,
  };
  return {
    watch,
    withdraw: () => {
      delete window.__r3f;
    },
  };
}
