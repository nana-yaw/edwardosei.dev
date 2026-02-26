"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { STORY_SECTION_THEMES } from "@/lib/storyConfig";
import { CinematicStory } from "@/components/themes/cinematic";
import { MinimalStory } from "@/components/themes/minimal";
import { BoldStory } from "@/components/themes/bold";
import { TerminalStory } from "@/components/themes/terminal";

export function Story() {
  const { theme, isStory } = useTheme();
  const effectiveTheme = isStory ? STORY_SECTION_THEMES.story : theme;

  const Component =
    effectiveTheme === "cinematic"
      ? CinematicStory
      : effectiveTheme === "minimal"
        ? MinimalStory
        : effectiveTheme === "bold"
          ? BoldStory
          : TerminalStory;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={effectiveTheme}
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
