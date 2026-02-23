"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { CinematicExperience } from "@/components/themes/cinematic";
import { MinimalExperience } from "@/components/themes/minimal";
import { BoldExperience } from "@/components/themes/bold";
import { TerminalExperience } from "@/components/themes/terminal";

export function Experience() {
  const { theme } = useTheme();

  const Component =
    theme === "cinematic"
      ? CinematicExperience
      : theme === "minimal"
        ? MinimalExperience
        : theme === "bold"
          ? BoldExperience
          : TerminalExperience;

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
