import { useSyncExternalStore } from "react";

/* ── Past the hero ── */
// One answer to "has the visitor scrolled past the hero?", shared by the nav
// and the scroll button so the two can never disagree. It comes from an
// IntersectionObserver on the hero, which fires when the hero leaves or comes
// back and at no other time: nothing here listens to the scroll or reads
// layout, and it works whatever the hero's height, taller than the screen on
// a phone included.

/** The hero counts as back this many pixels before its foot reaches the top
 * of the screen: one bar's height, so the bar is already leaving by the time
 * the hero shows and is not seen lying over it. The Work section's scroll
 * margin (Work.tsx) lands every jump to it two pixels past this. */
const HERO_RETURNS_EARLY = 64;

const HERO_ID = "hero";
let pastHero = false;
// One observer for everyone who asks. Each asker having its own would let
// whichever fired first change the answer and leave the others untold.
let watcher: IntersectionObserver | null = null;
const listeners = new Set<() => void>();

function watchHero(): void {
  const hero = document.getElementById(HERO_ID);
  if (!hero) return;
  watcher = new IntersectionObserver(
    ([entry]) => {
      // Off screen and above it. Off screen below it cannot happen to a hero.
      const next = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      if (next === pastHero) return;
      pastHero = next;
      listeners.forEach((listener) => listener());
    },
    { rootMargin: `${HERO_RETURNS_EARLY}px 0px 0px 0px` },
  );
  watcher.observe(hero);
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (!watcher) watchHero();
  return () => {
    listeners.delete(onChange);
    if (listeners.size > 0) return;
    watcher?.disconnect();
    watcher = null;
    pastHero = false;
  };
}

const read = (): boolean => pastHero;
/** The server, and the first paint, are at the top of the page. */
const readOnServer = (): boolean => false;

export function usePastHero(): boolean {
  return useSyncExternalStore(subscribe, read, readOnServer);
}
