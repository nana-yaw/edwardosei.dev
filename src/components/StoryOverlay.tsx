"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useActiveSection, type SectionId } from "@/hooks/useActiveSection";
import { useIdleAutoHide } from "@/hooks/useIdleAutoHide";
import { StoryProgressBar } from "@/components/StoryProgressBar";

const SECTION_IDS: SectionId[] = [
  "hero",
  "project",
  "story",
  "experience",
  "skills",
  "contact",
];

/**
 * Immersive overlay for Story mode — replaces the traditional nav
 * with a TikTok/Shorts-style UI: progress bar, section counter,
 * scroll hint, and an exit button.
 */
export function StoryOverlay() {
  const { isStory, setTheme } = useTheme();
  const activeSection = useActiveSection();
  const controlsVisible = useIdleAutoHide();
  const prefersReduced = useReducedMotion();
  const [hasScrolled, setHasScrolled] = useState(false);

  const activeIndex = activeSection
    ? SECTION_IDS.indexOf(activeSection)
    : 0;

  // Track first scroll to dismiss hint
  useEffect(() => {
    if (hasScrolled) return;

    function onFirstScroll() {
      setHasScrolled(true);
    }

    window.addEventListener("scroll", onFirstScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", onFirstScroll);
  }, [hasScrolled]);

  if (!isStory) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden="false">
      {/* ── Top: Progress bar (always visible) ──────────────── */}
      <div className="absolute top-0 left-0 right-0 pointer-events-auto safe-top">
        <StoryProgressBar activeIndex={activeIndex} total={SECTION_IDS.length} />
      </div>

      {/* ── Controls layer (fades on idle) ──────────────────── */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.25 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Exit button — top right */}
            <button
              onClick={() => setTheme("cinematic")}
              aria-label="Exit Story mode"
              className="pointer-events-auto absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              style={{
                backgroundColor: "color-mix(in srgb, var(--bg) 60%, transparent)",
                backdropFilter: "blur(8px)",
              }}
            >
              <X
                className="h-4 w-4"
                style={{ color: "color-mix(in srgb, var(--text) 70%, transparent)" }}
              />
            </button>

            {/* Section counter — bottom right, above safe area on mobile */}
            <div
              className="pointer-events-none absolute bottom-16 right-4 sm:bottom-6 sm:right-6 flex items-center gap-1"
              style={{ color: "color-mix(in srgb, var(--text) 50%, transparent)" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: prefersReduced ? 0 : 0.2 }}
                  className="font-mono text-xs tabular-nums"
                >
                  {activeIndex + 1}
                </motion.span>
              </AnimatePresence>
              <span className="font-mono text-xs">/</span>
              <span className="font-mono text-xs">{SECTION_IDS.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll hint — first card only, before any scroll ── */}
      <AnimatePresence>
        {activeIndex === 0 && !hasScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.4 }}
            className="pointer-events-none absolute bottom-20 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ color: "color-mix(in srgb, var(--text) 40%, transparent)" }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em]">scroll</span>
            <motion.div
              animate={
                prefersReduced
                  ? {}
                  : { y: [0, 4, 0] }
              }
              transition={
                prefersReduced
                  ? {}
                  : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
