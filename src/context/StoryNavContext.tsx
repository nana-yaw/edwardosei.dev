"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useTheme } from "@/hooks/useTheme";
import {
  useStoryHorizontalNav,
  type StoryHorizontalNav,
  type SectionId,
} from "@/hooks/useStoryHorizontalNav";

/* ── Graduation timing (ms) ──────────────────────── */
const FADE_IN_MS = 300;
const FADE_OUT_MS = 350;
const CLEANUP_DELAY = 50;

/* ── Extended context with graduation state ──────── */
interface StoryNavContextValue extends StoryHorizontalNav {
  isGraduating: boolean;
}

/* ── Default (no-op) values when outside story mode ─── */
const noop = () => {};

const defaultNav: StoryNavContextValue = {
  currentIndex: 0,
  currentSectionId: "hero" as SectionId,
  goNext: noop,
  goPrev: noop,
  goTo: noop,
  isTransitioning: false,
  total: 6,
  isGraduating: false,
};

const StoryNavContext = createContext<StoryNavContextValue>(defaultNav);

/**
 * Provides horizontal story navigation state to all descendants.
 * Handles the graduation sequence when the user swipes past the last section.
 */
export function StoryNavProvider({ children }: { children: ReactNode }) {
  const { isStory, setTheme, previousTheme } = useTheme();
  const [isGraduating, setIsGraduating] = useState(false);
  const graduatingRef = useRef(false);

  const handleGraduate = useCallback(() => {
    if (graduatingRef.current) return;
    graduatingRef.current = true;
    setIsGraduating(true);

    // Phase 1: fade-in is handled by CSS transition on the overlay.
    // Phase 2: at peak black, swap the theme.
    setTimeout(() => {
      const target = previousTheme || "cinematic";
      setTheme(target);
      window.scrollTo(0, 0);

      // Phase 3: fade-out starts automatically (isGraduating stays true,
      // but isStory becomes false — overlay component handles the reveal).
      setTimeout(() => {
        setIsGraduating(false);
        graduatingRef.current = false;
      }, FADE_OUT_MS + CLEANUP_DELAY);
    }, FADE_IN_MS);
  }, [previousTheme, setTheme]);

  const nav = useStoryHorizontalNav(isStory, handleGraduate);

  const value: StoryNavContextValue = isStory || isGraduating
    ? { ...nav, isGraduating }
    : defaultNav;

  return (
    <StoryNavContext.Provider value={value}>
      {children}
    </StoryNavContext.Provider>
  );
}

/** Consume story navigation state from any component. */
export function useStoryNav(): StoryNavContextValue {
  return useContext(StoryNavContext);
}
