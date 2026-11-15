import { useSyncExternalStore } from "react";

/* ── Flow mode ── */
// How much the pipe and the build flow may move for this visitor.
// "still":  everything lit and at rest. The server HTML, reduced motion.
// "reveal": phones. Each part lights once as it comes into view.
// "live":   768px and up. The pipe follows the scroll, the flow can be stepped.

export type FlowMode = "still" | "reveal" | "live";

export const WIDE = "(min-width: 768px)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const LIVE = `${WIDE} and ${MOTION_OK}`;

/** How far down the screen the lit end of the pipe rides, top to bottom. */
export const HEAD_LINE = 0.66;

function subscribe(onChange: () => void): () => void {
  const queries = [window.matchMedia(WIDE), window.matchMedia(MOTION_OK)];
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () => queries.forEach((query) => query.removeEventListener("change", onChange));
}

function readMode(): FlowMode {
  if (!window.matchMedia(MOTION_OK).matches) return "still";
  return window.matchMedia(WIDE).matches ? "live" : "reveal";
}

const serverMode = (): FlowMode => "still";

export function useFlowMode(): FlowMode {
  return useSyncExternalStore(subscribe, readMode, serverMode);
}
