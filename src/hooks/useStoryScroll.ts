"use client";

import { useEffect } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useTheme } from "@/hooks/useTheme";
import { STORY_SECTION_THEMES } from "@/lib/storyConfig";

/**
 * Bridges scroll-spy to theme switching in Story mode.
 * When Story is active, updates the sub-theme as the user scrolls
 * between sections. No-op when a pure theme is selected.
 */
export function useStoryScroll() {
  const activeSection = useActiveSection();
  const { isStory, setStoryTheme } = useTheme();

  useEffect(() => {
    if (!isStory || !activeSection) return;
    const targetTheme = STORY_SECTION_THEMES[activeSection];
    setStoryTheme(targetTheme);
  }, [isStory, activeSection, setStoryTheme]);
}
