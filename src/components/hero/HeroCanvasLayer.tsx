"use client";

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { ANCHOR_POINTS, LABEL_ANCHORS, type AnchorName } from "./framing";
import { type LockedLabel } from "./overlay";
import { type IdeaStage } from "./timeline";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((module) => module.HeroCanvas),
  { ssr: false },
);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
// Below this the still stays: phones never download three. In rem like the
// stylesheet's own breakpoints, so the canvas, the still's wait and the
// labels' layout all change at one width whatever the reader's font size.
const WIDE_ENOUGH = "(min-width: 48rem)";

let webglSupport: boolean | null = null;

/** Tries a WebGL2 context once and remembers the answer. A software renderer does not count: the build would crawl on one, so it keeps the still. */
function supportsWebGL(): boolean {
  if (webglSupport === null) {
    try {
      const context = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
      webglSupport = context !== null;
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

function subscribe(onChange: () => void): () => void {
  const queries = [REDUCED_MOTION, WIDE_ENOUGH].map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () => queries.forEach((query) => query.removeEventListener("change", onChange));
}

function canMount(): boolean {
  return (
    window.matchMedia(WIDE_ENOUGH).matches &&
    !window.matchMedia(REDUCED_MOTION).matches &&
    supportsWebGL()
  );
}

interface BoundaryProps {
  children: ReactNode;
  onFail: () => void;
}

/** If the canvas throws, drop it and tell the layer to bring the still back. A lost WebGL context throws nothing, so the scene reports that itself. */
class CanvasBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: unknown): void {
    console.warn("The hero canvas failed; showing the still picture.", error);
    this.props.onFail();
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

interface LiveCanvasProps {
  onFail: () => void;
}

/** The parts a label can light, in the order the scene numbers them. */
const PARTS = ["housing", "run-0", "run-1", "run-2"] as const;

function LiveCanvas({ onFail }: LiveCanvasProps) {
  const layer = useRef<HTMLDivElement>(null);
  /** What the labels ask the scene to light, 0 or 1 per part, and the scene's own way of being asked for a frame. */
  const targets = useRef(new Float32Array(PARTS.length));
  const wake = useRef<(() => void) | null>(null);
  /** The labels the canvas holds on their points of the model. */
  const labels = useRef<LockedLabel[]>([]);

  useEffect(() => {
    const figure = layer.current?.closest("[data-hero-figure]");
    if (!figure) return;
    const held = [...figure.querySelectorAll<HTMLElement>("[data-anchor]")].flatMap((element): LockedLabel[] => {
      const name = element.dataset.anchor;
      if (!name || !(name in ANCHOR_POINTS)) return [];
      const anchor = name as AnchorName;
      return [{ element, point: ANCHOR_POINTS[anchor], x: LABEL_ANCHORS[anchor].x, y: LABEL_ANCHORS[anchor].y, movedX: 0, movedY: 0 }];
    });
    labels.current = held;
    return () => {
      labels.current = [];
      held.forEach(({ element }) => {
        element.style.transform = "";
      });
    };
  }, []);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(true);
  /** How many labels the canvas has lit so far, what the idea's label has to point at, and whether the canvas owns the labels yet. */
  const steps = useRef<{ lit: number; idea: IdeaStage; owned: boolean }>({ lit: 0, idea: "floating", owned: false });

  // Draw only while someone can see it: tab in front, hero on screen.
  useEffect(() => {
    const stage = layer.current;
    if (!stage) return;
    let onScreen = true;
    const update = () => setRunning(onScreen && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    observer.observe(stage);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // The labels are plain HTML outside React's tree here, so they are lit by attribute.
  const paintSteps = useCallback(() => {
    const figure = layer.current?.closest("[data-hero-figure]");
    const { lit, idea } = steps.current;
    figure?.querySelectorAll<HTMLElement>("[data-step]").forEach((label) => {
      // The idea's own label and rule go dim again while the bulb has set
      // off and the wall is not up yet: there is nothing there to point at.
      const pointless = label.hasAttribute("data-idea") && idea === "adrift";
      label.toggleAttribute("data-lit", Number(label.dataset.step) < lit && !pointless);
    });
    // The rule that runs on to the floating bulb goes when the bulb does.
    figure?.querySelectorAll<HTMLElement>("[data-lead]").forEach((lead) => {
      lead.toggleAttribute("data-gone", idea !== "floating");
    });
  }, []);

  // The canvas reports how far the build has got.
  const lightSteps = useCallback(
    (count: number, idea: IdeaStage) => {
      steps.current.lit = count;
      steps.current.idea = idea;
      if (steps.current.owned) paintSteps();
    },
    [paintSteps],
  );

  // Until the first frame is drawn the labels keep their own timed wait, so a
  // 3D chunk that never arrives cannot leave them dim. From then on the
  // canvas owns them: `data-building` dims every label it has not lit yet.
  useEffect(() => {
    if (!ready) return;
    const figure = layer.current?.closest<HTMLElement>("[data-hero-figure]");
    if (!figure) return;
    const owner = steps.current;
    figure.setAttribute("data-building", "");
    // Reading layout makes the browser apply the dim state now. That is what
    // ends each label's timed wait; a label lit in the same breath would keep
    // waiting, because its target (fully lit) would never have changed.
    void figure.offsetWidth;
    owner.owned = true;
    paintSteps();
    return () => {
      owner.owned = false;
      figure.removeAttribute("data-building");
    };
  }, [ready, paintSteps]);

  const markReady = useCallback(() => setReady(true), []);
  const reportLost = useCallback(() => {
    console.warn("The hero canvas lost its WebGL context; showing the still picture.");
    onFail();
  }, [onFail]);

  // Linked labels. A label that names a part becomes a toggle button while
  // the canvas is live: hovering or focusing it lights its part, and pressing
  // it keeps the part lit until it is pressed again. Done here and not in the
  // page's markup, so where no canvas runs (a phone, reduced motion, no
  // scripts) the labels stay plain text and nothing pretends to be a control.
  useEffect(() => {
    if (!ready) return;
    const figure = layer.current?.closest<HTMLElement>("[data-hero-figure]");
    if (!figure) return;
    const labels = [...figure.querySelectorAll<HTMLElement>("[data-part]")];
    const state = labels.map(() => ({ hovered: false, focused: false, pinned: false }));
    const show = (index: number) => {
      const part = PARTS.indexOf(labels[index].dataset.part as (typeof PARTS)[number]);
      if (part < 0) return;
      const { hovered, focused, pinned } = state[index];
      targets.current[part] = hovered || focused || pinned ? 1 : 0;
      labels[index].setAttribute("aria-pressed", String(pinned));
      wake.current?.();
    };
    const stop = new AbortController();
    labels.forEach((label, index) => {
      label.setAttribute("role", "button");
      label.setAttribute("tabindex", "0");
      const set = (change: Partial<(typeof state)[number]>) => () => {
        Object.assign(state[index], change);
        show(index);
      };
      const toggle = () => {
        state[index].pinned = !state[index].pinned;
        show(index);
      };
      const options = { signal: stop.signal };
      label.addEventListener("pointerenter", set({ hovered: true }), options);
      label.addEventListener("pointerleave", set({ hovered: false }), options);
      label.addEventListener("focus", set({ focused: true }), options);
      label.addEventListener("blur", set({ focused: false }), options);
      label.addEventListener("click", toggle, options);
      label.addEventListener(
        "keydown",
        (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          // Space would scroll the page: this is a button now.
          event.preventDefault();
          toggle();
        },
        options,
      );
      show(index);
    });
    const lit = targets.current;
    return () => {
      stop.abort();
      lit.fill(0);
      labels.forEach((label) => ["role", "tabindex", "aria-pressed"].forEach((name) => label.removeAttribute(name)));
    };
  }, [ready]);

  return (
    <div ref={layer} data-hero-canvas data-ready={ready} className="peer absolute inset-0 z-10">
      <CanvasBoundary onFail={onFail}>
        <HeroCanvas
          running={running}
          onReady={markReady}
          onStep={lightSteps}
          onLost={reportLost}
          targets={targets}
          wakeRef={wake}
          labels={labels}
        />
      </CanvasBoundary>
    </div>
  );
}

/* ── Canvas layer ── */
// Renders nothing on the server, on a phone, with reduced motion or without
// WebGL, so the still beside it stays the picture. Where the build can play
// it mounts the canvas, which starts from an empty stage.
export function HeroCanvasLayer() {
  const marker = useRef<HTMLSpanElement>(null);
  const enabled = useSyncExternalStore(subscribe, canMount, () => false);
  const [failed, setFailed] = useState(false);
  const live = enabled && !failed;
  const fail = useCallback(() => setFailed(true), []);

  // CSS holds the still and the labels back wherever the build is expected to
  // play. If it cannot after all (no WebGL, the canvas threw, or its context
  // was lost), say so on the figure: the wait ends at once and the still is
  // the picture. A canvas that failed is not tried again on this page view.
  useEffect(() => {
    const figure = marker.current?.closest("[data-hero-figure]");
    figure?.toggleAttribute("data-still", !live);
    return () => figure?.removeAttribute("data-still");
  }, [live]);

  return (
    <>
      <span ref={marker} hidden />
      {live ? <LiveCanvas onFail={fail} /> : null}
    </>
  );
}
