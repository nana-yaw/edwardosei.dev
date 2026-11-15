/* ── Page pipe geometry ───────────────────────────────────── */
// Where the pipe goes, worked out from where the page actually is. Reading
// the page and drawing the route are kept apart: measurePage is the only
// thing here that touches the DOM, and buildPipe is plain arithmetic.
// Every length is in pixels from the top left of the host the pipe lies over.

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface StopMeasure {
  id: string;
  heading: Box;
  section: Box;
  /** Clear room under the heading before the next thing starts. */
  roomBelow: number;
  /** Something that sits between the gutter and the heading, such as a photo. */
  beside: Box | null;
}

interface FlowMeasure {
  entry: Point;
  exit: Point;
  /** The node boxes, top to bottom, when the pipe itself runs through them. */
  boxes: Box[] | null;
}

export interface PageMeasure {
  width: number;
  height: number;
  /** 768px and up: the pipe may leave the gutter and cross the page. */
  wide: boolean;
  hero: Box;
  /** The hero's picture, when it has one to come out from under. */
  heroStage: Box | null;
  contentLeft: number;
  stops: StopMeasure[];
  flowStop: string;
  flow: FlowMeasure | null;
}

export interface PipeVertex extends Point {
  /** Distance along its run. */
  along: number;
  /** When the lit end reaches it, in pixels of page scrolled past the line. */
  at: number;
}

export interface PipeRun {
  d: string;
  length: number;
  vertices: PipeVertex[];
}

export interface PipeJunction extends Point {
  id: string;
  run: number;
  along: number;
  at: number;
  /** Where the branch under the heading ends, or null for a bare node. */
  branchEnd: number | null;
  /** The stretch of pipe that leads to this junction, for lighting it alone. */
  lead: string;
  /** Pipe after the last junction of a run, lit along with it. */
  tail: string | null;
}

export interface PipeGeometry {
  width: number;
  height: number;
  runs: PipeRun[];
  junctions: PipeJunction[];
  /** When the lit end reaches each part of the build flow, in page order. */
  stations: number[];
  /** Changes only when the drawing would. */
  signature: string;
}

/** The pipe sits this far out from the content, or mid gutter when that is less. */
const GUTTER_INSET = 24;
const BRANCH_DROP = { least: 8, most: 14 };
const BRANCH_REACH = { wide: 72, narrow: 40 };
/** How far below the hero the pipe turns for the gutter. */
const HERO_RUN = 64;
/** No stretch may light faster than this many pixels of scroll per pixel of pipe. */
const LEAST_PACE = 0.12;
export const SOURCE_ID = "source";

const clamp = (value: number, least: number, most: number) =>
  Math.min(most, Math.max(least, value));

/* ── Reading the page ── */

function boxOf(element: Element, origin: DOMRect): Box {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left - origin.left,
    top: rect.top - origin.top,
    right: rect.right - origin.left,
    bottom: rect.bottom - origin.top,
  };
}

function pointOf(element: Element | null, origin: DOMRect): Point | null {
  // An element inside a hidden one has no boxes and so no place.
  if (!element || element.getClientRects().length === 0) return null;
  const rect = element.getBoundingClientRect();
  return { x: rect.left - origin.left, y: rect.top - origin.top };
}

export function measurePage(
  host: HTMLElement,
  stopIds: readonly string[],
  flowStop: string,
  wide: boolean,
  /** True where the pipe is the build flow's own line, not a visitor to it. */
  throughFlow: boolean,
): PageMeasure | null {
  const origin = host.getBoundingClientRect();
  const hero = host.querySelector("#hero");
  if (!hero) return null;

  const stops: StopMeasure[] = [];
  stopIds.forEach((id) => {
    const section = host.querySelector(`#${CSS.escape(id)}`);
    const headingElement = section?.querySelector("h1, h2");
    if (!section || !headingElement) return;
    const heading = boxOf(headingElement, origin);
    const next = headingElement.nextElementSibling;
    const figure = section.querySelector("figure");
    const besideBox = figure ? boxOf(figure, origin) : null;
    const isBeside =
      besideBox !== null &&
      besideBox.right <= heading.left &&
      besideBox.top < heading.bottom &&
      besideBox.bottom > heading.top;
    stops.push({
      id,
      heading,
      section: boxOf(section, origin),
      roomBelow: next ? boxOf(next, origin).top - heading.bottom : Number.POSITIVE_INFINITY,
      beside: isBeside ? besideBox : null,
    });
  });
  if (stops.length === 0) return null;

  // The first section heading starts at the content edge on every hero.
  const contentLeft = Math.min(...stops.map((stop) => stop.heading.left));
  const stage = host.querySelector("#hero [data-hero-figure] > div");
  const entry = pointOf(host.querySelector('[data-flow-port="in"]'), origin);
  const exit = pointOf(host.querySelector('[data-flow-port="out"]'), origin);
  const boxes = throughFlow
    ? Array.from(host.querySelectorAll("[data-flow-box]"), (box) => boxOf(box, origin))
    : null;

  return {
    width: origin.width,
    height: origin.height,
    wide,
    hero: boxOf(hero, origin),
    heroStage: stage ? boxOf(stage, origin) : null,
    contentLeft,
    stops,
    flowStop,
    flow: entry && exit ? { entry, exit, boxes } : null,
  };
}

/* ── Drawing the route ── */

interface Mark {
  id: string;
  run: number;
  vertex: number;
  branchEnd: number | null;
}

function pathOf(points: readonly Point[]): string {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join("");
}

export function buildPipe(page: PageMeasure): PipeGeometry {
  const trunk = Math.round(page.contentLeft - Math.min(GUTTER_INSET, page.contentLeft / 2));
  const reach = page.wide ? BRANCH_REACH.wide : BRANCH_REACH.narrow;

  const routes: Point[][] = [[]];
  const marks: Mark[] = [];
  const stations: { run: number; vertex: number }[] = [];
  const pen = (x: number, y: number): number => {
    const route = routes[routes.length - 1];
    const point = { x: Math.round(x), y: Math.round(y) };
    const last = route[route.length - 1];
    if (!last || last.x !== point.x || last.y !== point.y) route.push(point);
    return route.length - 1;
  };
  const mark = (id: string, vertex: number, branchEnd: number | null) =>
    marks.push({ id, run: routes.length - 1, vertex, branchEnd });

  // Out from under the hero, then across to the gutter. A phone has no room
  // to cross, so there it simply starts in the gutter.
  const firstHeadingTop = page.stops[0].heading.top;
  if (page.wide) {
    const startX = page.heroStage
      ? (page.heroStage.left + page.heroStage.right) / 2
      : page.hero.left + (page.hero.right - page.hero.left) * 0.66;
    const turn = page.hero.bottom + Math.min(HERO_RUN, (firstHeadingTop - page.hero.bottom) * 0.4);
    mark(SOURCE_ID, pen(startX, page.hero.bottom), null);
    pen(startX, turn);
    pen(trunk, turn);
  } else {
    mark(SOURCE_ID, pen(trunk, page.hero.bottom), null);
  }

  page.stops.forEach((stop) => {
    const y = stop.heading.bottom + clamp(stop.roomBelow / 2, BRANCH_DROP.least, BRANCH_DROP.most);
    const branchEnd = Math.round(stop.heading.left + reach);

    if (stop.beside && page.wide) {
      // Round the photo: over it, down the gap beside the heading, back under.
      const gapLane = (stop.beside.right + stop.heading.left) / 2;
      const over = (stop.section.top + stop.beside.top) / 2;
      const under = (stop.beside.bottom + stop.section.bottom) / 2;
      pen(trunk, over);
      pen(gapLane, over);
      mark(stop.id, pen(gapLane, y), branchEnd);
      pen(gapLane, under);
      pen(trunk, under);
    } else {
      mark(stop.id, pen(trunk, y), branchEnd);
    }

    if (page.flow && stop.id === page.flowStop) {
      const { entry, exit, boxes } = page.flow;
      // In at the side of the first node, out at the side of the last. A run
      // stops at a box's edge and the next starts at its far edge, so the
      // line is never drawn over the symbol inside.
      pen(trunk, entry.y);
      const arrival = pen(entry.x, entry.y);
      if (boxes) {
        // One pipe through the section: it drops from node to node, and each
        // part counts as reached when the lit end gets to its box.
        stations.push({ run: routes.length - 1, vertex: arrival });
        boxes.slice(1).forEach((box, before) => {
          const above = boxes[before];
          const centre = (above.left + above.right) / 2;
          routes.push([]);
          pen(centre, above.bottom);
          stations.push({ run: routes.length - 1, vertex: pen(centre, box.top) });
        });
      }
      routes.push([]);
      pen(exit.x, exit.y);
      pen(trunk, exit.y);
    }
  });

  // The lit end keeps level with the reader, so a point's time is its depth.
  // A stretch that runs sideways gains no depth and is given a little time of
  // its own, which the next downward stretch then makes up.
  let clock = Number.NEGATIVE_INFINITY;
  const runs: PipeRun[] = routes.map((route) => {
    let along = 0;
    const vertices: PipeVertex[] = route.map((point, index) => {
      if (index === 0) {
        // A run that starts under a node box waits for the box to scroll by.
        clock = Math.max(point.y, clock);
      } else {
        const previous = route[index - 1];
        const stretch = Math.abs(point.x - previous.x) + Math.abs(point.y - previous.y);
        along += stretch;
        clock = Math.max(point.y, clock + stretch * LEAST_PACE);
      }
      return { ...point, along, at: clock };
    });
    return { d: pathOf(route), length: along, vertices };
  });

  const junctions: PipeJunction[] = marks.map((item, index) => {
    const run = runs[item.run];
    const vertex = run.vertices[item.vertex];
    const previous = marks[index - 1];
    const following = marks[index + 1];
    const from = previous && previous.run === item.run ? previous.vertex : 0;
    const endsRun = !following || following.run !== item.run;
    const rest = run.vertices.slice(item.vertex);
    return {
      id: item.id,
      x: vertex.x,
      y: vertex.y,
      run: item.run,
      along: vertex.along,
      at: vertex.at,
      branchEnd: item.branchEnd,
      lead: pathOf(run.vertices.slice(from, item.vertex + 1)),
      tail: endsRun && rest.length > 1 ? pathOf(rest) : null,
    };
  });

  return {
    width: Math.round(page.width),
    height: Math.round(page.height),
    runs,
    junctions,
    stations: stations.map((station) => runs[station.run].vertices[station.vertex].at),
    signature: [page.width, page.height, ...runs.map((run) => run.d)]
      .concat(junctions.map((junction) => `${junction.id}:${junction.branchEnd}`))
      .join("|"),
  };
}
