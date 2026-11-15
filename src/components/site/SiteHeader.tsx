"use client";

import { useEffect, useRef } from "react";
import { brand, homePath, mainId, navItems, skipLabel, stickyNav } from "@/data/navigation";
import { usePastHero } from "./usePastHero";
import styles from "./SiteHeader.module.css";

type NavState = "top" | "away" | "hidden" | "shown" | "leaving";

interface SiteHeaderProps {
  /** For a page with no hero: the bar stays at the top of the screen from the start. */
  pinned?: boolean;
}

/** Movement smaller than this is a resting hand, not a change of direction. */
const SLACK = 6;
/** As long as the bar takes to slide out, and a little over. */
const LEAVE_MS = 270;

/* Past the hero: what the bar should be, given what it was and which way the page moved. */
function nextNavState(state: NavState, y: number, from: number): NavState {
  if (y > from) return state === "shown" ? "hidden" : state;
  return "shown";
}

/* ── Site header ── */
// Inside the hero it is in flow and scrolls away with the page: the hero is
// the showcase and no bar is laid over it. Only once the hero is behind the
// visitor does it become a slim solid bar that hides on the way down and
// returns on the way up. It is one element throughout, so there is one nav
// for a screen reader and one set of tab stops. A page with no hero has
// nothing to keep clear, so there the same slim bar is pinned from the start
// and never hides: the stylesheet does that alone, with no script. Its links
// name the home page, so they also work from the other pages.
export function SiteHeader({ pinned = false }: SiteHeaderProps) {
  const header = useRef<HTMLElement>(null);
  const pastHero = usePastHero();

  useEffect(() => {
    const bar = header.current;
    if (!bar || pinned) return;

    if (!pastHero) {
      // Back in the hero. A bar that is showing slides out first; anything
      // else goes straight back into the flow. No scroll listener exists here.
      if (bar.dataset.nav !== "shown") {
        bar.dataset.nav = "top";
        return;
      }
      bar.dataset.nav = "leaving";
      const timer = window.setTimeout(() => {
        bar.dataset.nav = "top";
      }, LEAVE_MS);
      return () => window.clearTimeout(timer);
    }

    bar.dataset.nav = "away";
    let from = window.scrollY;
    let frame = 0;

    // The whole cost of the nav while scrolling: one read of the scroll
    // position and, when the direction turns, one attribute. No layout is read.
    const settle = () => {
      frame = 0;
      const y = window.scrollY;
      if (Math.abs(y - from) < SLACK) return;
      const state = (bar.dataset.nav ?? "away") as NavState;
      const next = nextNavState(state, y, from);
      from = y;
      if (next !== state) bar.dataset.nav = next;
    };
    const onScroll = () => {
      // A tab nobody is looking at has no nav to move.
      if (frame !== 0 || document.hidden) return;
      frame = requestAnimationFrame(settle);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [pastHero, pinned]);

  return (
    <>
      {/* First tab stop on every page; off screen until it has focus. It sits
          outside the header so the header's slide never carries it away. */}
      <a
        href={`#${mainId}`}
        className="fixed left-4 top-4 z-50 -translate-y-[200%] bg-accent px-4 py-2 text-sm font-semibold text-accent-ink focus:translate-y-0"
      >
        {skipLabel}
      </a>
      {/* Holds the header's room in the flow while the header itself is fixed.
          On a pinned page it is this wrapper that sticks. */}
      <div className={styles.place} data-pinned={pinned ? "" : undefined}>
        <header ref={header} data-nav="top" className={styles.header}>
          <div className="mx-auto flex h-full w-full max-w-page items-center justify-between gap-6 px-4 sm:px-8 lg:px-12">
            {/* The empty fragment is the top of the page: on the home page
                this scrolls up without loading it again. */}
            <a
              href={`${homePath}#`}
              className="font-stretch-[var(--stretch-display)] text-lg font-bold tracking-tight hover:text-accent active:text-muted"
            >
              {brand}
            </a>
            <nav aria-label={stickyNav.label}>
              <ul className="flex items-center gap-5 text-[0.9375rem] sm:gap-8">
                {navItems.map((item) => (
                  <li key={item.href} className={item.compact ? "" : "hidden md:block"}>
                    <a
                      href={`${homePath}${item.href}`}
                      className="whitespace-nowrap underline-offset-8 decoration-accent hover:underline active:text-muted"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
}
