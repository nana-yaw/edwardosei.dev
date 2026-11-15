"use client";

import { useEffect, useRef } from "react";
import { brand, homePath, mainId, navItems, skipLabel, stickyNav } from "@/data/navigation";
import { MOTION_OK } from "@/components/pipe/useFlowMode";
import { usePastHero } from "./usePastHero";
import styles from "./SiteHeader.module.css";

interface SiteHeaderProps {
  /** For a page with no hero: the bar stays at the top of the screen from the start. */
  pinned?: boolean;
}

/** As long as the bar takes to slide out, and a little over. */
const LEAVE_MS = 270;

/* ── Site header ── */
// Inside the hero it is in flow and scrolls away with the page: the hero is
// the showcase and no bar is laid over it. Once the hero is behind the
// visitor it slides in as a slim solid bar and stays, whichever way the page
// scrolls (Edward, 15 Nov 2026), until the hero comes back. It is one element
// throughout, so there is one nav for a screen reader and one set of tab
// stops. A page with no hero has nothing to keep clear, so there the same
// slim bar is pinned from the start: the stylesheet does that alone, with no
// script. Its links name the home page, so they also work from the other pages.
export function SiteHeader({ pinned = false }: SiteHeaderProps) {
  const header = useRef<HTMLElement>(null);
  const pastHero = usePastHero();

  useEffect(() => {
    const bar = header.current;
    if (!bar || pinned) return;

    if (!pastHero) {
      // Back in the hero. A bar that is showing slides out first, while the
      // header's own place is still off screen. After a jump to the top that
      // place is already in view, and with reduced motion nothing slides, so
      // then it goes straight back into the flow and no gap is left.
      const place = bar.parentElement;
      const placeInView = () => (place?.getBoundingClientRect().bottom ?? 0) > 0;
      if (bar.dataset.nav !== "shown" || !window.matchMedia(MOTION_OK).matches || placeInView()) {
        bar.dataset.nav = "top";
        return;
      }
      bar.dataset.nav = "leaving";
      let timer = 0;
      let watcher: IntersectionObserver | undefined;
      const settle = () => {
        window.clearTimeout(timer);
        watcher?.disconnect();
        bar.dataset.nav = "top";
      };
      timer = window.setTimeout(settle, LEAVE_MS);
      // A fast trip to the top can reach the header's place before the slide
      // ends. The moment the place shows, the header goes back into it.
      if (place) {
        watcher = new IntersectionObserver((entries) => {
          if (entries[entries.length - 1].isIntersecting) settle();
        });
        watcher.observe(place);
      }
      return () => {
        window.clearTimeout(timer);
        watcher?.disconnect();
      };
    }

    // Past the hero again before the bar had finished leaving: it turns
    // round from where it is.
    if (bar.dataset.nav === "leaving") {
      bar.dataset.nav = "shown";
      return;
    }

    // Past the hero. Parked out of sight for one painted frame, so that the
    // next state has somewhere to slide in from, then shown for good. Nothing
    // listens to the scroll.
    bar.dataset.nav = "away";
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        bar.dataset.nav = "shown";
      });
    });
    return () => cancelAnimationFrame(frame);
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
