"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useStoryNav } from "@/context/StoryNavContext";
import { STORY_SECTION_THEMES } from "@/lib/storyConfig";

/**
 * Bridges horizontal navigation to theme switching in Story mode.
 * When Story is active, updates the sub-theme as the user swipes
 * between sections. No-op when a pure theme is selected.
 */
export function useStoryScroll() {
  const { currentSectionId } = useStoryNav();
  const { isStory, setStoryTheme } = useTheme();

  useEffect(() => {
    if (!isStory || !currentSectionId) return;
    const targetTheme = STORY_SECTION_THEMES[currentSectionId];
    setStoryTheme(targetTheme);
  }, [isStory, currentSectionId, setStoryTheme]);
}
