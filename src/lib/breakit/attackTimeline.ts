import gsap from "gsap";
import { DOT_POOL, RAIL, STAGE_LAYERS, parkingSpot, plateCorner } from "./stageGeometry";

/* ── Attack choreography ── */
// Builds one GSAP timeline per attack. Only transforms and opacity move.
// The end of every timeline is the resting picture of the result, so reduced
// motion gets the same picture by jumping straight to the end.

/** How the requests arrive: one, a steady drip of bots, or everything at once. */
export type AttackPattern = "single" | "drip" | "flood" | "rush";

export interface AttackPlan {
  /** Layer that stops it, 0 is the top plate. Null lets it through. */
  layer: number | null;
  pattern: AttackPattern;
}

/** How fast a request falls, in SVG pixels per second. */
const FALL_SPEED = 820;
const JOLT = 16;
const JOLT_SECONDS = 0.07;
const SPRING = "elastic.out(1, 0.3)";

interface CrowdShape {
  /** How many requests are drawn. */
  dots: number;
  /** Seconds between one request and the next. */
  gap: number;
  /** How many are let past before the layer starts holding them. */
  through: number;
}

const DRIP = { dots: 9, gap: 0.085 } as const;
const FLOOD: CrowdShape = { dots: DOT_POOL, gap: 0.028, through: 3 };
const RUSH: CrowdShape = { dots: 10, gap: 0.04, through: 0 };

interface StageParts {
  plates: SVGGElement[];
  flashes: SVGPolygonElement[];
  dots: SVGCircleElement[];
  labels: HTMLElement[];
  railFill: SVGLineElement[];
  letters: HTMLElement[];
  zero: HTMLElement[];
}

function collectParts(root: HTMLElement): StageParts {
  const all = <T extends Element>(selector: string) => gsap.utils.toArray<T>(selector, root);
  const layerIndexes = Array.from({ length: STAGE_LAYERS }, (_, index) => index);
  return {
    // Plates are painted base first, so fetch each by its layer number.
    plates: layerIndexes.flatMap((index) => all<SVGGElement>(`[data-plate="${index}"]`)),
    flashes: layerIndexes.flatMap((index) =>
      all<SVGPolygonElement>(`[data-plate-flash="${index}"]`),
    ),
    dots: all<SVGCircleElement>("[data-dot]"),
    labels: all<HTMLElement>("[data-layer-label]"),
    railFill: all<SVGLineElement>("[data-rail-fill]"),
    letters: all<HTMLElement>("[data-flinch]"),
    zero: all<HTMLElement>("[data-zero]"),
  };
}

// A new attack can interrupt the last one mid-flight, so start from clean.
function resetStage(parts: StageParts): void {
  gsap.set(parts.dots, { opacity: 0, x: 0, y: 0, scale: 1 });
  gsap.set(parts.plates, { y: 0 });
  gsap.set(parts.flashes, { opacity: 0 });
  gsap.set(parts.labels, { x: 0, opacity: 1 });
  gsap.set(parts.letters, { x: 0, y: 0, rotation: 0 });
  gsap.set(parts.zero, { x: 0 });
  gsap.set(parts.railFill, { opacity: 1, scaleY: 0, svgOrigin: `${RAIL.x} ${RAIL.top}` });
}

function fallSeconds(toY: number): number {
  return (toY - RAIL.top) / FALL_SPEED;
}

/** Drops one dot from the top of the rail to `toY`. Returns when it arrives. */
function drop(
  timeline: gsap.core.Timeline,
  dot: SVGCircleElement,
  toY: number,
  at: number,
): number {
  const seconds = fallSeconds(toY);
  timeline.set(dot, { opacity: 1 }, at);
  timeline.to(dot, { y: toY - RAIL.top, duration: seconds, ease: "none" }, at);
  return at + seconds;
}

function growRail(timeline: gsap.core.Timeline, parts: StageParts, toY: number): void {
  timeline.to(
    parts.railFill,
    {
      scaleY: (toY - RAIL.top) / (RAIL.bottom - RAIL.top),
      duration: fallSeconds(toY),
      ease: "none",
    },
    0,
  );
}

// Each layer a request passes gives a small nod, so the order reads as a check.
function nodAsItPasses(timeline: gsap.core.Timeline, parts: StageParts, layersPassed: number): void {
  for (let index = 0; index < layersPassed; index += 1) {
    const at = fallSeconds(plateCorner(index).y);
    timeline.to(
      parts.plates[index],
      { y: 5, duration: 0.05, ease: "power1.out", yoyo: true, repeat: 1 },
      at,
    );
    timeline.fromTo(
      parts.labels[index],
      { opacity: 0.4 },
      { opacity: 1, duration: 0.3, ease: "power1.out", immediateRender: false },
      at,
    );
  }
}

/**
 * The moment a layer stops something: the plate takes the hit and flashes,
 * its label kicks, the headline flinches and the zero shakes its head.
 * `settleAt` is when the plate springs back, later for a stream of requests.
 */
function impact(
  timeline: gsap.core.Timeline,
  parts: StageParts,
  layer: number,
  at: number,
  settleAt: number,
  onImpact: () => void,
): void {
  const plate = parts.plates[layer];
  timeline.call(onImpact, undefined, at);
  timeline.to(plate, { y: JOLT, duration: JOLT_SECONDS, ease: "power2.out" }, at);
  timeline.to(plate, { y: 0, duration: 0.8, ease: SPRING }, settleAt);
  timeline.fromTo(
    parts.flashes[layer],
    { opacity: 0.9 },
    { opacity: 0, duration: 0.7, ease: "power2.out", immediateRender: false },
    at,
  );
  timeline.fromTo(
    parts.labels[layer],
    { x: 12 },
    { x: 0, duration: 0.6, ease: "elastic.out(1, 0.4)", immediateRender: false },
    at,
  );
  timeline.to(
    parts.letters,
    {
      x: () => gsap.utils.random(-7, 7),
      y: () => gsap.utils.random(-12, 12),
      rotation: () => gsap.utils.random(-9, 9),
      duration: 0.06,
      ease: "power1.out",
    },
    at,
  );
  timeline.to(
    parts.letters,
    { x: 0, y: 0, rotation: 0, duration: 0.9, ease: SPRING, stagger: 0.012 },
    at + 0.06,
  );
  timeline.to(
    parts.zero,
    { keyframes: { x: [0, -10, 9, -6, 4, 0] }, duration: 0.5, ease: "none" },
    at + 0.05,
  );
}

// The plate keeps shuddering for as long as requests keep landing on it.
function shudder(
  timeline: gsap.core.Timeline,
  plate: SVGGElement,
  from: number,
  until: number,
): void {
  const beat = 0.05;
  const beats = Math.max(1, Math.round((until - from) / beat));
  timeline.to(
    plate,
    { y: JOLT - 6, duration: beat, ease: "sine.inOut", yoyo: true, repeat: beats },
    from,
  );
}

function single(
  timeline: gsap.core.Timeline,
  parts: StageParts,
  layer: number,
  onImpact: () => void,
): void {
  const dot = parts.dots[0];
  const corner = plateCorner(layer);
  const restY = corner.y - RAIL.top;
  const arrival = drop(timeline, dot, corner.y, 0);
  growRail(timeline, parts, corner.y);
  nodAsItPasses(timeline, parts, layer);
  impact(timeline, parts, layer, arrival, arrival + JOLT_SECONDS, onImpact);
  // The request rides the plate down and back, then stays where it was stopped.
  timeline.to(dot, { y: restY + JOLT, duration: JOLT_SECONDS, ease: "power2.out" }, arrival);
  timeline.to(dot, { y: restY, duration: 0.8, ease: SPRING }, arrival + JOLT_SECONDS);
}

// Bots arrive one after another and each is flicked off the plate.
function drip(
  timeline: gsap.core.Timeline,
  parts: StageParts,
  layer: number,
  onImpact: () => void,
): void {
  const corner = plateCorner(layer);
  const firstArrival = fallSeconds(corner.y);
  const lastArrival = firstArrival + (DRIP.dots - 1) * DRIP.gap;
  growRail(timeline, parts, corner.y);
  nodAsItPasses(timeline, parts, layer);
  impact(timeline, parts, layer, firstArrival, lastArrival + JOLT_SECONDS, onImpact);
  shudder(timeline, parts.plates[layer], firstArrival + JOLT_SECONDS, lastArrival);
  for (let index = 0; index < DRIP.dots; index += 1) {
    const dot = parts.dots[index];
    const arrival = drop(timeline, dot, corner.y, index * DRIP.gap);
    // The last one stays put, as the marker of where the run ended.
    if (index === DRIP.dots - 1) continue;
    const side = index % 2 === 0 ? 1 : -1;
    timeline.to(
      dot,
      {
        x: side * (130 + ((index * 53) % 90)),
        y: `-=${30 + ((index * 29) % 50)}`,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      arrival,
    );
  }
}

// Everything at once: a few are let through, the rest queue along the plate.
function flood(
  timeline: gsap.core.Timeline,
  parts: StageParts,
  layer: number,
  shape: CrowdShape,
  onImpact: () => void,
): void {
  const corner = plateCorner(layer);
  const firstStopped = fallSeconds(corner.y) + shape.through * shape.gap;
  const lastArrival = fallSeconds(corner.y) + (shape.dots - 1) * shape.gap;
  const parked = shape.dots - shape.through;
  growRail(timeline, parts, corner.y);
  nodAsItPasses(timeline, parts, layer);
  impact(timeline, parts, layer, firstStopped, lastArrival + JOLT_SECONDS, onImpact);
  shudder(timeline, parts.plates[layer], firstStopped + JOLT_SECONDS, lastArrival);
  for (let index = 0; index < shape.dots; index += 1) {
    const dot = parts.dots[index];
    const start = index * shape.gap;
    if (index < shape.through) {
      const exit = drop(timeline, dot, RAIL.bottom, start);
      timeline.to(dot, { opacity: 0, duration: 0.2, ease: "none" }, exit);
      continue;
    }
    const arrival = drop(timeline, dot, corner.y, start);
    const spot = parkingSpot(layer, index - shape.through, parked);
    timeline.to(
      dot,
      { x: spot.x - RAIL.x, y: spot.y - RAIL.top, duration: 0.3, ease: "power2.out" },
      arrival,
    );
  }
}

// Honest input: every layer nods it past and it comes out of the bottom.
function letThrough(
  timeline: gsap.core.Timeline,
  parts: StageParts,
  onImpact: () => void,
): void {
  const dot = parts.dots[0];
  const arrival = drop(timeline, dot, RAIL.bottom, 0);
  growRail(timeline, parts, RAIL.bottom);
  nodAsItPasses(timeline, parts, STAGE_LAYERS);
  timeline.call(onImpact, undefined, arrival);
  timeline.fromTo(
    dot,
    { scale: 1.8 },
    {
      scale: 1,
      duration: 0.5,
      ease: "back.out(2)",
      transformOrigin: "50% 50%",
      immediateRender: false,
    },
    arrival,
  );
}

/**
 * Resets the stage and returns a playing timeline for one attack.
 * `onImpact` fires once, when the result is decided on screen.
 * Call it inside a GSAP context so the timeline is cleaned up with the component.
 */
export function buildAttackTimeline(
  root: HTMLElement,
  plan: AttackPlan,
  onImpact: () => void,
): gsap.core.Timeline {
  const parts = collectParts(root);
  resetStage(parts);
  const timeline = gsap.timeline();

  if (plan.layer === null) {
    letThrough(timeline, parts, onImpact);
  } else if (plan.pattern === "drip") {
    drip(timeline, parts, plan.layer, onImpact);
  } else if (plan.pattern === "flood") {
    flood(timeline, parts, plan.layer, FLOOD, onImpact);
  } else if (plan.pattern === "rush") {
    flood(timeline, parts, plan.layer, RUSH, onImpact);
  } else {
    single(timeline, parts, plan.layer, onImpact);
  }
  return timeline;
}
