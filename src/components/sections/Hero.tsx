"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { STORY_SECTION_THEMES } from "@/lib/storyConfig";
import { CinematicHero } from "@/components/themes/cinematic";
import { MinimalHero } from "@/components/themes/minimal";
import { BoldHero } from "@/components/themes/bold";
import { TerminalHero } from "@/components/themes/terminal";

export function Hero() {
  const { theme, isStory } = useTheme();
  const effectiveTheme = isStory ? STORY_SECTION_THEMES.hero : theme;

  const Component =
    effectiveTheme === "cinematic"
      ? CinematicHero
      : effectiveTheme === "minimal"
        ? MinimalHero
        : effectiveTheme === "bold"
          ? BoldHero
          : TerminalHero;

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
