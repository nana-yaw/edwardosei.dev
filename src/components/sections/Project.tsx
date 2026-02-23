"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { CinematicProject } from "@/components/themes/cinematic";
import { MinimalProject } from "@/components/themes/minimal";
import { BoldProject } from "@/components/themes/bold";
import { TerminalProject } from "@/components/themes/terminal";

export function Project() {
  const { theme } = useTheme();

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
