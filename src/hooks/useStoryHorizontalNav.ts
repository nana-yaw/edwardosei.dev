"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SECTION_IDS = [
  "hero",
  "project",
  "story",
  "experience",
  "skills",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/* ── Tuning constants ───────────────────────────── */
const SWIPE_THRESHOLD = 50; // px — minimum horizontal distance for swipe
const SWIPE_RATIO = 1.3; // deltaX must exceed deltaY * ratio
const AXIS_LOCK_PX = 10; // px of movement before locking gesture axis
const DELTA_THRESHOLD = 80; // wheel delta before navigating
const COOLDOWN_MS = 500; // minimum time between transitions
const TRANSITION_MS = 450; // matches CSS transition duration

interface StoryNavState {
  isTransitioning: boolean;
  deltaAccum: number;
  lastTransition: number;
  // Touch tracking
  touchStartX: number;
  touchStartY: number;
  touchStartTime: number;
  axisLocked: "x" | "y" | null;
}

export interface StoryHorizontalNav {
  currentIndex: number;
  currentSectionId: SectionId;
  goNext: () => void;
  goPrev: () => void;
  goTo: (index: number) => void;
  isTransitioning: boolean;
  total: number;
}

/**
 * Core horizontal navigation hook for Story mode.
 * Handles touch swipe, keyboard, mouse wheel, and exposes
 * imperative navigation functions for tap zones.
 *
 * Only `currentIndex` is React state (drives re-renders).
 * All mutable tracking lives in refs to avoid render thrashing.
 */
export function useStoryHorizontalNav(
  enabled: boolean,
  onGraduate?: () => void,
): StoryHorizontalNav {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const stateRef = useRef<StoryNavState>({
    isTransitioning: false,
    deltaAccum: 0,
    lastTransition: 0,
    touchStartX: 0,
    touchStartY: 0,
    touchStartTime: 0,
    axisLocked: null,
  });

  const indexRef = useRef(0);
  const graduateRef = useRef(onGraduate);

  // Keep refs in sync
  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    graduateRef.current = onGraduate;
  }, [onGraduate]);

  const goTo = useCallback(
    (index: number) => {
      if (!enabled) return;

      const s = stateRef.current;
      if (s.isTransitioning) return;

      // Graduation: navigating past the last section triggers exit
      if (index >= SECTION_IDS.length && indexRef.current >= SECTION_IDS.length - 1) {
        graduateRef.current?.();
        return;
      }

      const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, index));
      if (clamped === indexRef.current) return;

      s.isTransitioning = true;
      s.lastTransition = Date.now();
      s.deltaAccum = 0;

      setCurrentIndex(clamped);
      setTransitioning(true);

      // Reset transitioning after CSS animation completes
      setTimeout(() => {
        s.isTransitioning = false;
        setTransitioning(false);
      }, TRANSITION_MS);
    },
    [enabled],
  );

  const goNext = useCallback(() => {
    goTo(indexRef.current + 1);
  }, [goTo]);

  const goPrev = useCallback(() => {
    goTo(indexRef.current - 1);
  }, [goTo]);

  // ── Event listeners ──────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    const s = stateRef.current;

    // Reset state on enable
    s.isTransitioning = false;
    s.deltaAccum = 0;
    s.axisLocked = null;

    const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => { /* reserved for future reduced-motion handling */ };
    motionMql.addEventListener("change", onMotionChange);

    // ── Touch handlers ──

    function handleTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      s.touchStartX = touch.clientX;
      s.touchStartY = touch.clientY;
      s.touchStartTime = Date.now();
      s.axisLocked = null;
    }

    function handleTouchMove(e: TouchEvent) {
      if (s.axisLocked === "y") return; // vertical — let section scroll

      const touch = e.touches[0];
      const dx = touch.clientX - s.touchStartX;
      const dy = touch.clientY - s.touchStartY;

      // Lock axis after threshold movement
      if (s.axisLocked === null && (Math.abs(dx) > AXIS_LOCK_PX || Math.abs(dy) > AXIS_LOCK_PX)) {
        s.axisLocked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      // If locked to horizontal, prevent vertical scroll
      if (s.axisLocked === "x") {
        e.preventDefault();
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (s.isTransitioning || s.axisLocked !== "x") return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - s.touchStartX;
      const dy = touch.clientY - s.touchStartY;

      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      if (Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return;

      const now = Date.now();
      if (now - s.lastTransition < COOLDOWN_MS) return;

      if (dx < 0) {
        // Swiped left → next
        goTo(indexRef.current + 1);
      } else {
        // Swiped right → previous
        goTo(indexRef.current - 1);
      }
    }

    // ── Wheel handler ──

    function handleWheel(e: WheelEvent) {
      if (s.isTransitioning) return;

      const now = Date.now();
      if (now - s.lastTransition < COOLDOWN_MS) return;

      // Check if the active section has internal scroll overflow
      const sectionEl = document.getElementById(SECTION_IDS[indexRef.current]);
      if (sectionEl) {
        const { scrollTop, scrollHeight, clientHeight } = sectionEl;
        const canScroll = scrollHeight > clientHeight + 1;
        const atTop = scrollTop <= 1;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

        // If section has internal scroll and not at boundary, let native handle
        if (canScroll) {
          if (e.deltaY > 0 && !atBottom) return;
          if (e.deltaY < 0 && !atTop) return;
        }
      }

      e.preventDefault();

      // Normalize deltaMode
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 40; // lines → pixels
      if (e.deltaMode === 2) delta *= window.innerHeight; // pages → pixels

      s.deltaAccum += delta;

      if (Math.abs(s.deltaAccum) < DELTA_THRESHOLD) return;

      if (s.deltaAccum > 0) {
        goTo(indexRef.current + 1);
      } else {
        goTo(indexRef.current - 1);
      }
    }

    // ── Keyboard handler ──

    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (s.isTransitioning) return;

      const now = Date.now();
      if (now - s.lastTransition < COOLDOWN_MS) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          goTo(indexRef.current + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goTo(indexRef.current - 1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(SECTION_IDS.length - 1);
          break;
      }
    }

    // ── Register listeners ──

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      motionMql.removeEventListener("change", onMotionChange);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);

      // Reset index when story mode is disabled (cleanup runs on enabled→false)
      indexRef.current = 0;
      setCurrentIndex(0);
      setTransitioning(false);
    };
  }, [enabled, goTo]);


  return {
    currentIndex,
    currentSectionId: SECTION_IDS[currentIndex],
    goNext,
    goPrev,
    goTo,
    isTransitioning: transitioning,
    total: SECTION_IDS.length,
  };
}
