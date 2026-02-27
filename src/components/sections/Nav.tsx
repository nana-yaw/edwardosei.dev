"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { useActiveSection } from "@/hooks/useActiveSection";
import { CinematicNav } from "@/components/themes/cinematic";
import { MinimalNav } from "@/components/themes/minimal";
import { BoldNav } from "@/components/themes/bold";
import { TerminalNav } from "@/components/themes/terminal";

export function Nav() {
  const { theme, isStory, storyTheme } = useTheme();
  const activeSection = useActiveSection();

  // Story mode uses immersive overlay instead of traditional nav
  if (isStory) return null;

  const effectiveTheme = isStory ? storyTheme : theme;

  const Component =
    effectiveTheme === "cinematic"
      ? CinematicNav
      : effectiveTheme === "minimal"
        ? MinimalNav
        : effectiveTheme === "bold"
          ? BoldNav
          : TerminalNav;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={effectiveTheme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeInOut" as const }}
      >
        <Component activeSection={activeSection} />
      </motion.div>
    </AnimatePresence>
  );
}
