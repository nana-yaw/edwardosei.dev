/* ── Colour reader ────────────────────────────────── */
// Resolves CSS colours. The tones are oklch and color-mix, which three cannot
// parse, so the browser computes each one, paints one pixel with it and the
// sRGB bytes are read back.

import { Color, SRGBColorSpace } from "three";

/** Turns a CSS colour built from the site's variables into a string with no variables left in it. */
export type CssResolver = (css: string) => string;

export interface ColorReader {
  /** A CSS colour as a three Color. */
  color: (css: string) => Color;
  /** A CSS colour as a string with no variables left in it. */
  css: CssResolver;
}

export function createColorReader(): ColorReader {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  const css: CssResolver = (value) => {
    const probe = document.createElement("span");
    probe.style.color = value;
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe).color;
    probe.remove();
    return computed;
  };

  return {
    css,
    color: (value) => {
      if (!context) return new Color();
      context.fillStyle = css(value);
      context.fillRect(0, 0, 1, 1);
      const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
      return new Color().setRGB(r / 255, g / 255, b / 255, SRGBColorSpace);
    },
  };
}
