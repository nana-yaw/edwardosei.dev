import { build } from "../src/data/heroPicture";

/* ── Shared by the browser tests ── */

export const VIEWPORTS = [
  { name: "phone", width: 360, height: 740 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

export const CASE_STUDIES = [
  { path: "/work/sihene", name: "Si Hene", visit: "Visit sihene.com" },
  { path: "/work/ewc-care-app", name: "EWC Care App", visit: "Visit ewcareapp.online" },
] as const;
export const PAGES = ["/", "/work/sihene", "/work/ewc-care-app", "/hiring"] as const;

/** Below this width the page keeps the still picture and loads no 3D code. */
export const CANVAS_MIN_WIDTH = 768;

export const readyCanvas = '[data-hero-canvas][data-ready="true"]';
/** Set by the canvas layer once its script has run and decided against a canvas. */
export const keptStill = "[data-hero-figure][data-still]";
export const still = "[data-hero-still]";

/** What the idea's label reads once the product is live and has been paid. */
export const IDEA_AT_REST = `${build.idea.label}${build.idea.liveEnding}${build.idea.payingEnding}`;
