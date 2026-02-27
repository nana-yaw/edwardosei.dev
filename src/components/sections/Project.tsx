"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { STORY_SECTION_THEMES } from "@/lib/storyConfig";
import { CinematicProject } from "@/components/themes/cinematic";
import { MinimalProject } from "@/components/themes/minimal";
import { BoldProject } from "@/components/themes/bold";
import { TerminalProject } from "@/components/themes/terminal";
import { StoryCardReveal } from "@/components/StoryCardReveal";

export function Project() {
  const { theme, isStory } = useTheme();
  const effectiveTheme = isStory ? STORY_SECTION_THEMES.project : theme;

  const Component =
    effectiveTheme === "cinematic"
      ? CinematicProject
      : effectiveTheme === "minimal"
        ? MinimalProject
        : effectiveTheme === "bold"
          ? BoldProject
          : TerminalProject;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={effectiveTheme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" as const }}
      >
        <StoryCardReveal enabled={isStory}>
          <Component />
        </StoryCardReveal>
      </motion.div>
    </AnimatePresence>
  );
}
