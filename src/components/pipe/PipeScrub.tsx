"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { setPartsReached } from "@/lib/flowProgress";
import type { PipeGeometry } from "@/lib/pipeGeometry";
import { HEAD_LINE, LIVE } from "./useFlowMode";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const GLOW_OPACITY = 0.75;

interface PipeScrubProps {
  /** The pipe's layer: what is animated lives inside it. */
  layer: RefObject<HTMLDivElement | null>;
  pipe: PipeGeometry;
}

/* ── Pipe scrub ── */
// Ties the lit part of the pipe to the scroll from 768px up, and with it the
// build flow: the same schedule that moves the lit end says how many of the
// flow's parts it has reached. It lives in its own file so the page can fetch
// it only there: a phone never loads ScrollTrigger and so never gains a
// scroll listener from it.
// Every position was measured before this runs. Nothing here reads layout
// while the page scrolls; it only moves dash offsets along a fixed schedule.
export function PipeScrub({ layer, pipe }: PipeScrubProps) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(LIVE, () => {
        const host = layer.current;
        const firstRun = pipe.runs[0];
        const lastRun = pipe.runs[pipe.runs.length - 1];
        if (!host || !firstRun || !lastRun) return;

        const begin = firstRun.vertices[0].at;
        const finish = lastRun.vertices[lastRun.vertices.length - 1].at;
        const line = `${Math.round(HEAD_LINE * 100)}%`;
        const junctions = gsap.utils.toArray<SVGGElement>("[data-junction]", host);
        // A rebuilt schedule must not inherit junctions the last one had lit.
        junctions.forEach((junction) => junction.setAttribute("data-lit", "false"));

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: host,
            start: `top+=${Math.round(begin)} ${line}`,
            // Clamped so the pipe still finishes on a page too short to carry
            // its last junction up to the line.
            end: `clamp(top+=${Math.round(finish)} ${line})`,
            scrub: 0.5,
          },
        });

        pipe.runs.forEach((run, runIndex) => {
          const lit = host.querySelector<SVGPathElement>(`[data-pipe-lit="${runIndex}"]`);
          const head = host.querySelector<SVGPathElement>(`[data-pipe-head="${runIndex}"]`);
          const glow = host.querySelector<HTMLElement>(`[data-pipe-glow="${runIndex}"]`);
          if (!lit || !head || !glow) return;
          const reach = Number(head.dataset.reach);
          const starts = Math.max(run.vertices[0].at - begin, 1);

          run.vertices.forEach((vertex, index) => {
            if (index === 0) return;
            const previous = run.vertices[index - 1];
            const duration = vertex.at - previous.at;
            const position = previous.at - begin;
            timeline.fromTo(
              lit,
              { strokeDashoffset: run.length - previous.along },
              { strokeDashoffset: run.length - vertex.along, duration, immediateRender: false },
              position,
            );
            timeline.fromTo(
              head,
              { strokeDashoffset: reach - previous.along },
              { strokeDashoffset: reach - vertex.along, duration, immediateRender: false },
              position,
            );
            timeline.fromTo(
              glow,
              { x: previous.x, y: previous.y },
              { x: vertex.x, y: vertex.y, duration, immediateRender: false },
              position,
            );
          });

          // The glow shows once its run is under way. A run that ends at a
          // node of the build flow goes dark there while the node itself
          // glows, and the next run picks the glow up below it. The last run
          // keeps it.
          timeline.set(glow, { opacity: GLOW_OPACITY }, starts);
          if (runIndex < pipe.runs.length - 1) {
            const end = run.vertices[run.vertices.length - 1].at - begin;
            timeline.set([glow, head], { opacity: 0 }, end);
          }
        });

        pipe.junctions.forEach((junction) => {
          const group = junctions.find((item) => item.dataset.junction === junction.id);
          if (!group) return;
          // Never at zero: the very first node waits for the first scroll too.
          timeline.set(group, { attr: { "data-lit": "true" } }, Math.max(junction.at - begin, 1));
        });

        // The build flow's parts. The count is read from the clock on every
        // move, in either direction, never added up from crossings: a count
        // that is read cannot drift out of step with the pipe. It is six
        // comparisons and no layout, and it only tells the flow on a change.
        const stations = pipe.stations.map((at) => Math.max(at - begin, 1));
        const report = () =>
          setPartsReached(stations.filter((at) => timeline.time() >= at - 0.5).length);
        timeline.eventCallback("onUpdate", report);

        // Start where the page already is. Left alone, the scrub would sweep
        // up from nothing every time the page is measured again.
        const trigger = timeline.scrollTrigger;
        if (trigger) timeline.progress(trigger.progress);
        report();
      });

      return () => media.revert();
    },
    { scope: layer, dependencies: [pipe], revertOnUpdate: true },
  );

  return null;
}
