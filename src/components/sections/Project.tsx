"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { STORY_SECTION_THEMES } from "@/lib/storyConfig";
import { CinematicProject } from "@/components/themes/cinematic";
import { MinimalProject } from "@/components/themes/minimal";
import { BoldProject } from "@/components/themes/bold";
import { TerminalProject } from "@/components/themes/terminal";
import { StoryCardReveal } from "@/components/StoryCardReveal";
import { StoryProjectCard } from "@/components/StoryProjectCard";

export function Project() {
  const { theme, isStory } = useTheme();

  // Story mode: render compact project card instead of full showcase
  if (isStory) {
    return (
      <StoryCardReveal enabled>
        <StoryProjectCard />
      </StoryCardReveal>
    );
  }

  const Component =
    theme === "cinematic"
      ? CinematicProject
      : theme === "minimal"
        ? MinimalProject
        : theme === "bold"
          ? BoldProject
          : TerminalProject;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" as const }}
      >
        <Component />
      </motion.div>
    </AnimatePresence>
  );
}
