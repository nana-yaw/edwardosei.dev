"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const FINE_POINTER = `${MOTION_OK} and (hover: hover) and (pointer: fine)`;

interface ScrollMotionProps {
  children: ReactNode;
}

/* ── Scroll motion ── */
// Wraps a page and adds the three scroll effects that earn their place:
// smooth wheel scrolling on a desktop pointer, a short rise on work entries
// as they arrive, and the phone capture drifting over the desktop one.
// Everything is visible and still without scripts or with reduced motion;
// these only ever animate from the finished state.
export function ScrollMotion({ children }: ScrollMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Says the motion code has run, whether or not it added any motion.
      scope.current?.setAttribute("data-motion-ready", "");
      const media = gsap.matchMedia();

      media.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 28,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-pair]").forEach((pair) => {
          const phone = pair.querySelector("[data-pair-mobile]");
          if (!phone) return;
          gsap.fromTo(
            phone,
            { yPercent: 12 },
            {
              yPercent: -10,
              ease: "none",
              scrollTrigger: {
                trigger: pair,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        // The web font swaps in after first paint and nudges the layout.
        void document.fonts.ready.then(() => ScrollTrigger.refresh());
      });

      media.add(FINE_POINTER, () => {
        const lenis = new Lenis({ anchors: true });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
          gsap.ticker.remove(tick);
          // Back to GSAP's defaults, which Lenis asked us to switch off.
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
        };
      });

      return () => media.revert();
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
