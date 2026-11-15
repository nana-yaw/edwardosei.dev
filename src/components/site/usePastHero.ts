import { useSyncExternalStore } from "react";

/* ── Past the hero ── */
// One answer to "has the visitor scrolled past the hero?", shared by the nav
// and the scroll button so the two can never disagree. It comes from two
// IntersectionObservers on the hero, which fire when the hero leaves or comes
// back and at no other time: nothing here listens to the scroll or reads
// layout, and it works whatever the hero's height, taller than the screen on
// a phone included.

/** The visitor is past the hero once its foot is this far above the top of
 * the screen: one bar's height, so the bar is already leaving by the time the
 * hero shows and is not seen lying over it. The Work section's scroll margin
 * (Work.tsx) lands every jump to it two pixels past this. */
const HERO_LEFT_AT = 64;
/** The hero only counts as back once its foot comes this close. The gap to
 * HERO_LEFT_AT is slack, so a hand resting on a trackpad just after a jump to
 * the work does not send the bar out and back in. */
const HERO_BACK_AT = 40;

const HERO_ID = "hero";
let pastHero = false;
// One pair of observers for everyone who asks. Each asker having its own would
// let whichever fired first change the answer and leave the others untold.
let watchers: IntersectionObserver[] = [];
const listeners = new Set<() => void>();

function setPastHero(next: boolean): void {
  if (next === pastHero) return;
  pastHero = next;
  listeners.forEach((listener) => listener());
}

function watchHero(): void {
  const hero = document.getElementById(HERO_ID);
  if (!hero) return;
  // Each observer only ever moves the answer one way: the first says when the
  // hero has gone, the second when it is back.
  const leaving = new IntersectionObserver(
    (entries) => {
      // The latest, if several crossings were queued together. Off screen and
      // above it; off screen below it cannot happen to a hero.
      const entry = entries[entries.length - 1];
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) setPastHero(true);
    },
    { rootMargin: `${HERO_LEFT_AT}px 0px 0px 0px` },
  );
  const returning = new IntersectionObserver(
    (entries) => {
      if (entries[entries.length - 1].isIntersecting) setPastHero(false);
    },
    { rootMargin: `${HERO_BACK_AT}px 0px 0px 0px` },
  );
  leaving.observe(hero);
  returning.observe(hero);
  watchers = [leaving, returning];
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (watchers.length === 0) watchHero();
  return () => {
    listeners.delete(onChange);
    if (listeners.size > 0) return;
    watchers.forEach((watcher) => watcher.disconnect());
    watchers = [];
    pastHero = false;
  };
}

const read = (): boolean => pastHero;
/** The server, and the first paint, are at the top of the page. */
const readOnServer = (): boolean => false;

export function usePastHero(): boolean {
  return useSyncExternalStore(subscribe, read, readOnServer);
}
