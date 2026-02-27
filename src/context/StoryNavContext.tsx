"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useTheme } from "@/hooks/useTheme";
import {
  useStoryHorizontalNav,
  type StoryHorizontalNav,
  type SectionId,
} from "@/hooks/useStoryHorizontalNav";

/* ── Default (no-op) values when outside story mode ─── */
const noop = () => {};

const defaultNav: StoryHorizontalNav = {
  currentIndex: 0,
  currentSectionId: "hero" as SectionId,
  goNext: noop,
  goPrev: noop,
  goTo: noop,
  isTransitioning: false,
  total: 6,
};

const StoryNavContext = createContext<StoryHorizontalNav>(defaultNav);

/**
 * Provides horizontal story navigation state to all descendants.
 * Internally instantiates the navigation hook only when story mode is active.
 */
export function StoryNavProvider({ children }: { children: ReactNode }) {
  const { isStory } = useTheme();
  const nav = useStoryHorizontalNav(isStory);

  return (
    <StoryNavContext.Provider value={isStory ? nav : defaultNav}>
      {children}
    </StoryNavContext.Provider>
  );
}

/** Consume story navigation state from any component. */
export function useStoryNav(): StoryHorizontalNav {
  return useContext(StoryNavContext);
}
