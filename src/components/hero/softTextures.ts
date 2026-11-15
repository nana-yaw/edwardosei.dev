/* ── Soft textures ────────────────────────────────── */
// What is painted and not rendered: the studio floor's fade into the page,
// the one soft spot every glow is drawn with, the light and dark of a lit
// window pane, and the clay's tooth. The shadows are not among them: the
// key light casts real ones.

import { CanvasTexture, SRGBColorSpace, type Color } from "three";

/** A round soft spot on a square canvas. */
export interface Falloff {
  /** The canvas's width and height in pixels. */
  pixels: number;
  /** Alpha in the middle, 0..1. */
  peak: number;
  /** Above 1 the fade hugs the middle more closely. */
  tightness: number;
}

/** Paints `color` with an alpha that fades from the middle of the canvas to nothing at its edge. */
export function paintFalloff(spec: Falloff, color: Color): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = spec.pixels;
  canvas.height = spec.pixels;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The hero's floor and glow could not be painted: no 2D canvas context.");
  const image = context.createImageData(canvas.width, canvas.height);
  const [red, green, blue] = color
    .clone()
    .convertLinearToSRGB()
    .toArray()
    .map((channel) => Math.round(channel * 255));
  for (let row = 0; row < canvas.height; row += 1) {
    for (let column = 0; column < canvas.width; column += 1) {
      // How far from the middle, where 1 is the middle of an edge.
      const away = Math.hypot((column + 0.5) / canvas.width - 0.5, (row + 0.5) / canvas.height - 0.5) * 2;
      const near = Math.max(0, 1 - away);
      const smooth = Math.pow(near * near * (3 - 2 * near), spec.tightness);
      // Half a step of noise breaks up the bands a slow fade shows in eight bits on a dark page.
      const alpha = smooth * spec.peak * 255 + (Math.random() - 0.5);
      const offset = (row * canvas.width + column) * 4;
      image.data[offset] = red;
      image.data[offset + 1] = green;
      image.data[offset + 2] = blue;
      image.data[offset + 3] = Math.min(255, Math.max(0, Math.round(alpha)));
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

/**
 * A lit window pane as light and dark only: its tone comes from the
 * material. Brightest low and in the middle, as a lamp on a table would
 * leave it, and `falloff` darker toward the head and the corners.
 */
export function paintPane(falloff: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The hero's windows could not be painted: no 2D canvas context.");
  const image = context.createImageData(canvas.width, canvas.height);
  for (let row = 0; row < canvas.height; row += 1) {
    for (let column = 0; column < canvas.width; column += 1) {
      const across = (column + 0.5) / canvas.width - 0.5;
      const up = 1 - (row + 0.5) / canvas.height;
      const away = Math.hypot(across * 1.1, (up - 0.3) * 0.95);
      const level = Math.round(255 * (1 - falloff * Math.min(1, away * away * 2.6)));
      image.data.set([level, level, level, 255], (row * canvas.width + column) * 4);
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

/**
 * The clay's tooth: a small noise that tiles. Used as a bump map and to vary
 * the roughness by up to `roughness`, so a face is never a dead flat fill.
 * Three layers of smoothed random values, each finer and fainter than the
 * last.
 */
export function paintTooth(pixels: number, roughness: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = pixels;
  canvas.height = pixels;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The hero's clay could not be textured: no 2D canvas context.");
  const layers = [8, 20, 48].map((cells) => ({
    cells,
    values: Float32Array.from({ length: cells * cells }, () => Math.random()),
  }));
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const sample = ({ cells, values }: (typeof layers)[number], u: number, v: number) => {
    const x = u * cells;
    const y = v * cells;
    const [x0, y0] = [Math.floor(x), Math.floor(y)];
    const [fx, fy] = [smooth(x - x0), smooth(y - y0)];
    // Wrapping the lattice is what makes the noise tile.
    const at = (cx: number, cy: number) => values[(cy % cells) * cells + (cx % cells)];
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * fx;
    const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * fx;
    return top + (bottom - top) * fy;
  };
  const image = context.createImageData(pixels, pixels);
  for (let row = 0; row < pixels; row += 1) {
    for (let column = 0; column < pixels; column += 1) {
      const [u, v] = [column / pixels, row / pixels];
      const value = sample(layers[0], u, v) * 0.5 + sample(layers[1], u, v) * 0.32 + sample(layers[2], u, v) * 0.18;
      // Red is the height, for the bump. Green is what the roughness is
      // multiplied by: near 1, dipping where the clay is raised.
      image.data.set([Math.round(value * 255), Math.round((1 - roughness * value) * 255), 0, 255], (row * pixels + column) * 4);
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

export function toSoftTexture(canvas: HTMLCanvasElement): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
