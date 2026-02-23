"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { CinematicStory } from "@/components/themes/cinematic";
import { MinimalStory } from "@/components/themes/minimal";
import { BoldStory } from "@/components/themes/bold";
import { TerminalStory } from "@/components/themes/terminal";

export function Story() {
  const { theme } = useTheme();

  const Component =
    theme === "cinematic"
      ? CinematicStory
      : theme === "minimal"
        ? MinimalStory
        : theme === "bold"
          ? BoldStory
          : TerminalStory;

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
