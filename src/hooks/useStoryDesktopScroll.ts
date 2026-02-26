"use client";

import { useEffect, useRef } from "react";

const SECTION_IDS = [
  "hero",
  "project",
  "story",
  "experience",
  "skills",
  "contact",
];

const DELTA_THRESHOLD = 80;
const COOLDOWN_MS = 800;
const SCROLL_DURATION = 600;

/**
 * Desktop full-page scroll for Story mode.
 * Intercepts wheel/keyboard events and programmatically scrolls
 * one section at a time. Tall sections get a two-step scroll
 * (show overflow, then advance). No-op on touch devices or when disabled.
 */
export function useStoryDesktopScroll(enabled: boolean): void {
  const stateRef = useRef({
    currentIndex: 0,
    isScrolling: false,
    deltaAccum: 0,
    lastTransition: 0,
    overflowPhase: false,
  });

  useEffect(() => {
    if (!enabled) return;

    // Media query checks — local variables updated by listeners
    const pointerMql = window.matchMedia("(pointer: fine)");
    const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isDesktop = pointerMql.matches;
    let prefersReduced = motionMql.matches;

    const isActive = () => isDesktop && !prefersReduced;

    const onPointerChange = (e: MediaQueryListEvent) => {
      isDesktop = e.matches;
    };
    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
    };

    pointerMql.addEventListener("change", onPointerChange);
    motionMql.addEventListener("change", onMotionChange);

    const s = stateRef.current;

    // ── Helpers ──

    function scrollToSection(index: number) {
      const el = document.getElementById(SECTION_IDS[index]);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function navigateSection(direction: 1 | -1) {
      const currentEl = document.getElementById(SECTION_IDS[s.currentIndex]);
      if (!currentEl) return;

      const viewportHeight = window.innerHeight;
      const sectionHeight = currentEl.scrollHeight;
      const isTall = sectionHeight > viewportHeight + 50;

      // ── Tall section: two-step navigation ──
      if (isTall && direction === 1 && !s.overflowPhase) {
        s.overflowPhase = true;
        s.isScrolling = true;
        s.lastTransition = Date.now();
        s.deltaAccum = 0;

        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height",
          ) || "60",
        );
        const targetScrollTop =
          currentEl.offsetTop + sectionHeight - viewportHeight + navHeight;
        window.scrollTo({ top: targetScrollTop, behavior: "smooth" });

        setTimeout(() => {
          s.isScrolling = false;
        }, SCROLL_DURATION);
        return;
      }

      if (isTall && direction === -1 && s.overflowPhase) {
        s.overflowPhase = false;
        s.isScrolling = true;
        s.lastTransition = Date.now();
        s.deltaAccum = 0;

        scrollToSection(s.currentIndex);
        setTimeout(() => {
          s.isScrolling = false;
        }, SCROLL_DURATION);
        return;
      }

      // ── Normal: advance to adjacent section ──
      s.overflowPhase = false;
      const nextIdx = s.currentIndex + direction;

      if (nextIdx < 0 || nextIdx >= SECTION_IDS.length) return;

      s.currentIndex = nextIdx;
      s.isScrolling = true;
      s.lastTransition = Date.now();
      s.deltaAccum = 0;

      scrollToSection(nextIdx);
      setTimeout(() => {
        s.isScrolling = false;
      }, SCROLL_DURATION);
    }

    // ── Wheel handler ──

    function handleWheel(e: WheelEvent) {
      if (!isActive()) return;

      // Ignore horizontal gestures (two-finger horizontal swipe)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();

      if (s.isScrolling) return;

      const now = Date.now();
      if (now - s.lastTransition < COOLDOWN_MS) return;

      // Normalize deltaMode
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 40; // lines → pixels
      if (e.deltaMode === 2) delta *= window.innerHeight; // pages → pixels

      s.deltaAccum += delta;

      if (Math.abs(s.deltaAccum) < DELTA_THRESHOLD) return;

      const direction: 1 | -1 = s.deltaAccum > 0 ? 1 : -1;
      navigateSection(direction);
    }

    // ── Keyboard handler ──

    function handleKeyDown(e: KeyboardEvent) {
      if (!isActive()) return;

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      let direction: 1 | -1 | null = null;

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          direction = 1;
          break;
        case "ArrowUp":
        case "PageUp":
          direction = -1;
          break;
        case "Home":
          e.preventDefault();
          s.currentIndex = 0;
          s.overflowPhase = false;
          scrollToSection(0);
          return;
        case "End":
          e.preventDefault();
          s.currentIndex = SECTION_IDS.length - 1;
          s.overflowPhase = false;
          scrollToSection(SECTION_IDS.length - 1);
          return;
        default:
          return;
      }

      e.preventDefault();

      if (s.isScrolling) return;

      const now = Date.now();
      if (now - s.lastTransition < COOLDOWN_MS) return;

      navigateSection(direction);
    }

    // ── Scroll position sync (handles nav clicks, etc.) ──

    let syncTimeout: ReturnType<typeof setTimeout>;

    function syncIndex() {
      if (s.isScrolling) return;

      const scrollTop = window.scrollY;
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--nav-height",
        ) || "60",
      );

      let closestIdx = 0;
      let closestDist = Infinity;

      SECTION_IDS.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (!el) return;
        const dist = Math.abs(el.offsetTop - navHeight - scrollTop);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });

      s.currentIndex = closestIdx;
      s.overflowPhase = false;
    }

    function onScroll() {
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(syncIndex, 150);
    }

    // ── Register all listeners ──

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Sync index immediately on mount
    syncIndex();

    return () => {
      pointerMql.removeEventListener("change", onPointerChange);
      motionMql.removeEventListener("change", onMotionChange);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(syncTimeout);
    };
  }, [enabled]);
}
