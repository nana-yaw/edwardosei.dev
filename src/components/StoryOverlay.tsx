"use client";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useStoryNav } from "@/context/StoryNavContext";
import { useIdleAutoHide } from "@/hooks/useIdleAutoHide";
import { StoryProgressBar } from "@/components/StoryProgressBar";

/**
 * Immersive overlay for Story mode — replaces the traditional nav
 * with an Instagram/TikTok-style UI: progress bar, section counter,
 * swipe hint, tap zones, and an exit button.
 *
 * Also renders the graduation fade-to-black overlay when the user
 * swipes past the last section.
 */
export function StoryOverlay() {
  const { isStory, setTheme } = useTheme();
  const { currentIndex, goNext, goPrev, total, isGraduating } = useStoryNav();
  const controlsVisible = useIdleAutoHide();
  const prefersReduced = useReducedMotion();

  // Graduation overlay persists briefly after isStory becomes false
  if (!isStory && !isGraduating) return null;

  // Derived values
  const showHint = currentIndex === 0;
  const isLastSection = currentIndex === total - 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden="false">
      {/* ── Top: Progress bar (always visible) ──────────────── */}
      <div className="absolute top-0 left-0 right-0 pointer-events-auto safe-top">
        <StoryProgressBar activeIndex={currentIndex} total={total} />
      </div>

      {/* ── Tap zones (always active) ──────────────────────── */}
      <button
        onClick={goPrev}
        className="pointer-events-auto absolute left-0 top-12 bottom-0 w-1/4 z-10"
        aria-label="Previous section"
        style={{ background: "transparent", border: "none", cursor: "default" }}
      />
      <button
        onClick={goNext}
        className="pointer-events-auto absolute right-0 top-12 bottom-0 w-1/4 z-10"
        aria-label="Next section"
        style={{ background: "transparent", border: "none", cursor: "default" }}
      />

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
              className="pointer-events-auto absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors z-20"
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

            {/* Section counter / last-section CTA — bottom right */}
            <div
              className="pointer-events-none absolute bottom-16 right-4 sm:bottom-6 sm:right-6 flex items-center gap-1"
              style={{ color: "color-mix(in srgb, var(--text) 50%, transparent)" }}
            >
              <AnimatePresence mode="wait">
                {isLastSection ? (
                  <motion.span
                    key="cta"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: prefersReduced ? 0 : 0.25 }}
                    className="text-[10px] uppercase tracking-[0.15em] flex items-center gap-1"
                  >
                    Swipe to explore
                    <motion.span
                      animate={prefersReduced ? {} : { x: [0, 4, 0] }}
                      transition={prefersReduced ? {} : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                ) : (
                  <motion.span
                    key={currentIndex}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: prefersReduced ? 0 : 0.2 }}
                    className="font-mono text-xs tabular-nums"
                  >
                    {currentIndex + 1}
                    <span className="font-mono text-xs">/</span>
                    <span className="font-mono text-xs">{total}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Swipe hint — first card only, before any navigation ── */}
      <AnimatePresence>
        {showHint && !isGraduating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.4 }}
            className="pointer-events-none absolute bottom-20 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5"
            style={{ color: "color-mix(in srgb, var(--text) 40%, transparent)" }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em]">swipe</span>
            <motion.div
              animate={
                prefersReduced
                  ? {}
                  : { x: [0, 6, 0] }
              }
              transition={
                prefersReduced
                  ? {}
                  : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Graduation fade-to-black overlay ──────────────── */}
      <AnimatePresence>
        {isGraduating && (
          <motion.div
            key="graduation-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.3 }}
            className="fixed inset-0 z-[100] pointer-events-auto"
            style={{ backgroundColor: "#000" }}
            aria-hidden="true"
            role="presentation"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
