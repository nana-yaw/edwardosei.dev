"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { STORY_SECTION_THEMES } from "@/lib/storyConfig";
import { CinematicContact } from "@/components/themes/cinematic";
import { MinimalContact } from "@/components/themes/minimal";
import { BoldContact } from "@/components/themes/bold";
import { TerminalContact } from "@/components/themes/terminal";

export function Contact() {
  const { theme, isStory } = useTheme();
  const effectiveTheme = isStory ? STORY_SECTION_THEMES.contact : theme;

  const Component =
    effectiveTheme === "cinematic"
      ? CinematicContact
      : effectiveTheme === "minimal"
        ? MinimalContact
        : effectiveTheme === "bold"
          ? BoldContact
          : TerminalContact;

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
