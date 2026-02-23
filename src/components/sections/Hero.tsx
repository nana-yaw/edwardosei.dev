"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { CinematicHero } from "@/components/themes/cinematic";
import { MinimalHero } from "@/components/themes/minimal";
import { BoldHero } from "@/components/themes/bold";
import { TerminalHero } from "@/components/themes/terminal";

export function Hero() {
  const { theme } = useTheme();

  const Component =
    theme === "cinematic"
      ? CinematicHero
      : theme === "minimal"
        ? MinimalHero
        : theme === "bold"
          ? BoldHero
          : TerminalHero;

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
