/* ── Motion preference ── */
// Asked at the moment of each interaction, so a visitor who changes the
// setting mid-visit gets the right behaviour on the very next press.

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export function prefersMotion(): boolean {
  return window.matchMedia(MOTION_OK).matches;
}
