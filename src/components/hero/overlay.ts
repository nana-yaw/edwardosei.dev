/* ── What is laid over the canvas ─────────────────── */
// Two kinds of HTML ride on the 3D picture. The three words the pulses
// carry, each beside its pulse once; and the labels, each held on the point
// of the model it names, so a label and its rule stay with their part while
// the camera makes its small move and the pointer tilts the scene. Both are
// placed on whole device pixels, so their text is never blurred by a
// fraction of a pixel. Nothing here reads layout: it runs every frame.

import { Vector3, type Camera, type Group } from "three";
import { surgePoint } from "./glows";
import { type Vec3 } from "./projection";
import { PIPE_RUNS, pointAlong } from "./stage";
import { surgeShare, tokenDissolve, tokenOpacity } from "./timeline";

/** Where the stage sits inside the canvas, in CSS pixels, and how fine a device pixel is. The canvas keeps this current. */
export interface StageBox {
  width: number;
  height: number;
  /** The stage's top left corner, measured from the canvas's. */
  left: number;
  top: number;
  pixelRatio: number;
}

/** A label held on a point of the model. `x` and `y` are where it sits at rest, as shares of the stage. */
export interface LockedLabel {
  element: HTMLElement;
  point: Vec3;
  x: number;
  y: number;
  /** The last nudge written, so the style is only touched when it changes. */
  movedX: number;
  movedY: number;
}

/** Pixels from the middle of the pulse to the start of its word: clear of the ball, inside its glow. */
const BESIDE = 14;
/** The height of a word's chip in CSS pixels. Even, so its middle falls on a whole pixel. The canvas sets it on each chip. */
export const CHIP_HEIGHT = 22;
/** How far up the wall a word drifts while it dissolves, in world units. */
const DISSOLVE_RISE = 0.36;
/** A dissolving word spreads a little and goes soft, like ink taken up by the wall. */
const DISSOLVE_GROW = 0.16;
const DISSOLVE_BLUR = 5;

const point = [0, 0, 0];
const spot = new Vector3();

/** The nearest whole device pixel to `value`, in CSS pixels. */
export function snap(value: number, pixelRatio: number): number {
  return Math.round(value * pixelRatio) / pixelRatio;
}

/** Places each word beside its pulse. `width` and `height` are the canvas's size in CSS pixels. */
export function moveTokens(
  tokens: readonly (HTMLElement | null)[],
  model: Group,
  camera: Camera,
  width: number,
  height: number,
  pixelRatio: number,
  now: number,
): void {
  for (let run = 0; run < PIPE_RUNS.length; run += 1) {
    const token = tokens[run];
    if (!token) continue;
    const opacity = tokenOpacity(now, run);
    if (opacity <= 0) {
      // Written once, not every frame: after the build the words are simply gone.
      if (token.style.opacity !== "0") token.style.opacity = "0";
      continue;
    }
    const surge = surgeShare(now, run);
    const dissolve = tokenDissolve(now, run);
    // Once its pulse has arrived the word carries on from the top of the riser.
    pointAlong(PIPE_RUNS[run], surgePoint(run, surge < 0 || dissolve > 0 ? 1 : surge), point);
    const drift = DISSOLVE_RISE * (1 - (1 - dissolve) * (1 - dissolve));
    spot.set(point[0], point[1] + drift, point[2]).applyMatrix4(model.matrixWorld).project(camera);
    const x = snap((spot.x * 0.5 + 0.5) * width + BESIDE, pixelRatio);
    const y = snap((0.5 - spot.y * 0.5) * height - CHIP_HEIGHT / 2, pixelRatio);
    const grow = 1 + DISSOLVE_GROW * dissolve;
    token.style.opacity = opacity.toFixed(3);
    token.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${grow.toFixed(3)})`;
    token.style.filter = dissolve > 0 ? `blur(${(DISSOLVE_BLUR * dissolve).toFixed(2)}px)` : "none";
  }
}

/**
 * Holds each label on its point of the model. `grip` eases the hold in: at 0
 * a label stays where the page laid it out, at 1 it is on its point. At rest
 * the nudge is nothing, and the label is plain untransformed text.
 */
export function lockLabels(
  labels: readonly LockedLabel[],
  model: Group,
  camera: Camera,
  width: number,
  height: number,
  box: StageBox,
  grip: number,
): void {
  for (const label of labels) {
    spot.set(label.point[0], label.point[1], label.point[2]).applyMatrix4(model.matrixWorld).project(camera);
    const x = snap(((spot.x * 0.5 + 0.5) * width - box.left - label.x * box.width) * grip, box.pixelRatio);
    const y = snap(((0.5 - spot.y * 0.5) * height - box.top - label.y * box.height) * grip, box.pixelRatio);
    if (x === label.movedX && y === label.movedY) continue;
    label.movedX = x;
    label.movedY = y;
    label.element.style.transform = x === 0 && y === 0 ? "" : `translate(${x}px, ${y}px)`;
  }
}
