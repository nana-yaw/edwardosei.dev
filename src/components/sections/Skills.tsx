"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { CinematicSkills } from "@/components/themes/cinematic";
import { MinimalSkills } from "@/components/themes/minimal";
import { BoldSkills } from "@/components/themes/bold";
import { TerminalSkills } from "@/components/themes/terminal";

export function Skills() {
  const { theme } = useTheme();

  const Component =
    theme === "cinematic"
      ? CinematicSkills
      : theme === "minimal"
        ? MinimalSkills
        : theme === "bold"
          ? BoldSkills
          : TerminalSkills;

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
