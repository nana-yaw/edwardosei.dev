"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { mainId, scrollButton } from "@/data/navigation";
import { MOTION_OK } from "@/components/pipe/useFlowMode";
import { usePastHero } from "./usePastHero";
import styles from "./ScrollButton.module.css";

/** The Work section. Its id is fixed: nav links and bookmarks point at it. */
const WORK_ID = "project";
/** How finely the footer's arrival is followed: a step every tenth of it. */
const FOOTER_STEPS = Array.from({ length: 11 }, (_, step) => step / 10);

const subscribeToNothing = () => () => {};

/** Moves focus to a heading without a second scroll; only a keyboard press
 * shows a ring. The heading is focusable only until focus leaves it, so from
 * then on clicks and Tab behave as they would on a page without this button. */
function focusHeading(heading: HTMLElement | null | undefined): void {
  if (!heading) return;
  heading.tabIndex = -1;
  heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
  heading.focus({ preventScroll: true });
}

/* ── Scroll button ── */
// One button that flips. Inside the hero it leads down to the work; past the
// hero it leads back to the top. It reads the same "past the hero" answer as
// the nav, so the two change together. Nothing is drawn until scripts run: a
// button that cannot scroll would be a broken one, and the nav already has a
// plain link to the work for a visitor without scripts.
export function ScrollButton() {
  const scriptsRunning = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  return scriptsRunning ? <FlipButton /> : null;
}

function FlipButton() {
  const button = useRef<HTMLButtonElement>(null);
  const pastHero = usePastHero();
  const [nearEnd, setNearEnd] = useState(false);

  // Whether the end of the page is on screen, learned from an observer, not
  // from the scroll: it fires a handful of times down the whole page.
  useEffect(() => {
    const own = button.current;
    const footer = document.querySelector("footer");
    const contact = document.getElementById("contact");

    const onScreen = new Set<Element>();
    const endWatch = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
          // On a wide screen the button stays and rides up over the footer.
          if (entry.target === footer) {
            const shown = Math.round(entry.intersectionRect.height);
            own?.style.setProperty("--over-footer", `${shown}px`);
          }
        });
        setNearEnd(onScreen.size > 0);
      },
      { threshold: FOOTER_STEPS },
    );
    if (contact) endWatch.observe(contact);
    if (footer) endWatch.observe(footer);

    return () => endWatch.disconnect();
  }, []);

  // Focus goes to the heading of where the page went, so the next Tab carries
  // on from there.
  function go() {
    const behavior = window.matchMedia(MOTION_OK).matches ? "smooth" : "auto";
    if (pastHero) {
      window.scrollTo({ top: 0, behavior });
      focusHeading(document.getElementById(mainId)?.querySelector("h1"));
      return;
    }
    const work = document.getElementById(WORK_ID);
    if (!work) return;
    // Lands where the nav's Work link lands: the section's scroll margin
    // puts the hero just past counting as on screen, so the button flips.
    work.scrollIntoView({ behavior });
    focusHeading(work.querySelector("h2"));
  }

  return (
    <button
      ref={button}
      type="button"
      className={styles.button}
      data-job={pastHero ? "top" : "work"}
      data-near-end={nearEnd ? "" : undefined}
      onClick={go}
    >
      {pastHero ? scrollButton.toTop : scrollButton.toWork}
      <svg aria-hidden="true" viewBox="0 0 16 16" className={styles.arrow}>
        <path d="M8 13.5V3M3.5 7.5 8 3l4.5 4.5" />
      </svg>
    </button>
  );
}
