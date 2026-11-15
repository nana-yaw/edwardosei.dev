"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { buildPipe, measurePage, SOURCE_ID, type PipeGeometry } from "@/lib/pipeGeometry";
import { WIDE, useFlowMode } from "./useFlowMode";
import styles from "./PagePipe.module.css";

// Stands in for the scrub when its code cannot be fetched: the pipe stays
// drawn at rest and the page carries on.
const NoScrub = () => null;

// Fetched only where the pipe follows the scroll, so a phone never loads it.
// A failed fetch (a dropped connection, a deploy since the page loaded) must
// not take the page down with it: the pipe is decoration.
const PipeScrub = dynamic(
  () =>
    import("./PipeScrub")
      .then((module) => module.PipeScrub)
      .catch((error: unknown) => {
        console.warn("The page pipe's scroll code did not load; the pipe stays at rest.", error);
        return NoScrub;
      }),
  { ssr: false },
);

const NODE_SIZE = 9;
/** The thicker stroke at the lit end: its length, then the width it is drawn at. */
const CORE = { length: 10, width: 4 };
// Its round cap ends level with the lit line.
const CORE_REACH = CORE.length + CORE.width / 2;
/** A phone junction lights once its heading is a little way into the screen. */
const SEEN_MARGIN = "0px 0px -18% 0px";

interface PagePipeProps {
  /** Ids of the sections the pipe feeds, in page order. Each gets one junction. */
  stops: readonly string[];
  /** Id of the build flow's section, where the pipe runs through the nodes. */
  flowStop: string;
}

/* ── Page pipe ── */
// One pipe from under the hero to the contact section, with a junction and a
// short branch at every section heading. It is drawn from where the page
// really is, measured after mount and again whenever the page changes size
// (the break-it section grows when its canvas arrives, fonts swap, windows
// resize). The server sends an empty layer: without scripts there is no pipe
// and nothing is missing. With reduced motion it is drawn fully lit. The page
// names the sections, so this imports no copy and sends none to the browser.
export function PagePipe({ stops, flowStop }: PagePipeProps) {
  const layer = useRef<HTMLDivElement>(null);
  const mode = useFlowMode();
  const [pipe, setPipe] = useState<PipeGeometry | null>(null);

  useEffect(() => {
    const host = layer.current?.parentElement;
    if (!host) return;

    let frame = 0;
    let missedWhileHidden = false;
    // The font promise cannot be cancelled. Without this, a run of the effect
    // that has already been replaced (the server's "still" mode, say) would
    // measure with its old mode when the fonts land and overwrite the pipe.
    let active = true;

    const measure = () => {
      frame = 0;
      if (!active) return;
      // A tab nobody is looking at is not worth measuring.
      if (document.hidden) {
        missedWhileHidden = true;
        return;
      }
      const page = measurePage(
        host,
        stops,
        flowStop,
        window.matchMedia(WIDE).matches,
        mode === "live",
      );
      if (!page) return;
      const next = buildPipe(page);
      setPipe((current) => (current?.signature === next.signature ? current : next));
    };
    const queue = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };
    const catchUp = () => {
      if (document.hidden || !missedWhileHidden) return;
      missedWhileHidden = false;
      queue();
    };

    // The host's box changes whenever anything inside it changes height.
    const observer = new ResizeObserver(queue);
    observer.observe(host);
    const flow = host.querySelector("[data-flow]");
    if (flow) observer.observe(flow);
    document.addEventListener("visibilitychange", catchUp);
    void document.fonts.ready.then(() => {
      if (active) queue();
    });

    return () => {
      active = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", catchUp);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
    // The build flow changes with the mode, and so does the pipe's way through it.
  }, [mode, stops, flowStop]);

  // Phones: each junction is lit once, by its own heading coming into view.
  useEffect(() => {
    const host = layer.current?.parentElement;
    const drawing = layer.current;
    if (mode !== "reveal" || !pipe || !host || !drawing) return;

    const stopOf = new Map<Element, string>();
    const watcher = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Above the screen counts: the reader is already past it.
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
          const id = stopOf.get(entry.target);
          if (id) {
            drawing.querySelector(`[data-junction="${id}"]`)?.setAttribute("data-lit", "true");
          }
          watcher.unobserve(entry.target);
        });
      },
      { rootMargin: SEEN_MARGIN },
    );
    pipe.junctions.forEach((junction) => {
      const heading = host.querySelector(`#${CSS.escape(junction.id)}`)?.querySelector("h1, h2");
      if (!heading) return;
      stopOf.set(heading, junction.id);
      watcher.observe(heading);
    });

    return () => watcher.disconnect();
  }, [mode, pipe]);

  return (
    <div ref={layer} aria-hidden="true" data-pipe={mode} className={styles.layer}>
      {pipe ? (
        <svg
          width={pipe.width}
          height={pipe.height}
          viewBox={`0 0 ${pipe.width} ${pipe.height}`}
          className={styles.drawing}
        >
          {pipe.runs.map((run, index) => (
            <path key={`unlit-${index}`} d={run.d} className={styles.unlit} />
          ))}

          {mode === "still"
            ? pipe.runs.map((run, index) => (
                <path key={`lit-${index}`} d={run.d} className={styles.lit} />
              ))
            : null}

          {/* Drawn unlit; the scrub moves the dash offsets from here. */}
          {mode === "live"
            ? pipe.runs.map((run, index) => (
                <g key={`live-${index}`}>
                  <path
                    data-pipe-lit={index}
                    d={run.d}
                    className={styles.lit}
                    strokeDasharray={`${run.length} ${run.length}`}
                    strokeDashoffset={run.length}
                  />
                  <path
                    data-pipe-head={index}
                    data-reach={CORE_REACH}
                    d={run.d}
                    className={styles.core}
                    strokeDasharray={`${CORE.length} ${run.length + CORE_REACH * 2}`}
                    strokeDashoffset={CORE_REACH}
                  />
                </g>
              ))
            : null}

          {pipe.junctions.map((junction) => {
            const startsLit = mode === "still" || (mode === "reveal" && junction.id === SOURCE_ID);
            const corner = { x: junction.x - NODE_SIZE / 2, y: junction.y - NODE_SIZE / 2 };
            const branch =
              junction.branchEnd === null
                ? null
                : { x: junction.x, y: junction.y - 1, width: junction.branchEnd - junction.x };

            return (
              <g
                key={junction.id}
                data-junction={junction.id}
                data-lit={startsLit ? "true" : "false"}
                className={styles.junction}
              >
                {mode === "reveal" ? (
                  <>
                    <path d={junction.lead} pathLength={1} className={styles.lead} />
                    {junction.tail ? (
                      <path d={junction.tail} pathLength={1} className={styles.tail} />
                    ) : null}
                  </>
                ) : null}
                {branch ? (
                  <>
                    <rect {...branch} height={2} className={styles.branch} />
                    <rect {...branch} height={2} className={styles.branchLit} />
                  </>
                ) : null}
                <rect {...corner} width={NODE_SIZE} height={NODE_SIZE} className={styles.node} />
                <rect {...corner} width={NODE_SIZE} height={NODE_SIZE} className={styles.nodeLit} />
              </g>
            );
          })}
        </svg>
      ) : null}
      {mode === "live" && pipe ? (
        <>
          {pipe.runs.map((_, index) => (
            <span key={index} data-pipe-glow={index} className={styles.glow} />
          ))}
          <PipeScrub layer={layer} pipe={pipe} />
        </>
      ) : null}
    </div>
  );
}
