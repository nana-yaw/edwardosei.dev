"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { themes, themeOrder, type ThemeId } from "@/lib/themes";

const dotColors: Record<ThemeId, string> = {
  cinematic: "#4f7df5",
  minimal: "#1a1a2e",
  bold: "#7c3aed",
  terminal: "#4ade80",
};

const pulseRingColors: Record<ThemeId, string> = {
  cinematic: "rgba(79, 125, 245, 0.4)",
  minimal: "rgba(26, 26, 46, 0.25)",
  bold: "rgba(124, 58, 237, 0.4)",
  terminal: "rgba(74, 222, 128, 0.4)",
};

const SWIPE_THRESHOLD = 50;

export function ThemeSwitcher() {
  const { theme, setTheme, resetChoice } = useTheme();
  const [shouldPulse, setShouldPulse] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const touchStartX = useRef(0);
  const router = useRouter();

  // Pulse on mount
  useEffect(() => {
    const timer = setTimeout(() => setShouldPulse(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const currentIndex = themeOrder.indexOf(theme);

  const goNext = useCallback(() => {
    const next = (currentIndex + 1) % themeOrder.length;
    setDirection(1);
    setTheme(themeOrder[next]);
    setShowHint(false);
  }, [currentIndex, setTheme]);

  const goPrev = useCallback(() => {
    const prev = (currentIndex - 1 + themeOrder.length) % themeOrder.length;
    setDirection(-1);
    setTheme(themeOrder[prev]);
    setShowHint(false);
  }, [currentIndex, setTheme]);

  // Keyboard arrow keys
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't hijack arrows if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  // Swipe gestures
  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX;
    }
    function onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) >= SWIPE_THRESHOLD) {
        if (dx < 0) goNext();
        else goPrev();
      }
    }
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [goNext, goPrev]);

  const ringColor = pulseRingColors[theme];

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-auto lg:right-auto lg:top-[72px] lg:left-6 z-50 flex flex-col items-end lg:items-start gap-1.5">
      {/* Carousel switcher */}
      <motion.div
        animate={
          shouldPulse
            ? {
                scale: [1, 1.08, 1],
                boxShadow: [
                  `0 0 0 0px ${ringColor}`,
                  `0 0 0 8px transparent`,
                  `0 0 0 0px transparent`,
                ],
              }
            : {}
        }
        transition={
          shouldPulse
            ? { duration: 0.8, ease: "easeInOut", times: [0, 0.5, 1] }
            : {}
        }
        onAnimationComplete={() => setShouldPulse(false)}
        className="flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--bg)] shadow-lg"
      >
        <button
          onClick={goPrev}
          aria-label="Previous theme"
          className="flex h-9 w-8 items-center justify-center rounded-l-full text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-2 px-1 min-w-[90px] justify-center">
          <span
            className="h-2 w-2 rounded-full shrink-0 transition-colors duration-150"
            style={{ background: dotColors[theme] }}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, x: direction * 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -16 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="text-xs font-medium text-[var(--accent)] select-none whitespace-nowrap"
            >
              {themes[theme].name}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={goNext}
          aria-label="Next theme"
          className="flex h-9 w-8 items-center justify-center rounded-r-full text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </motion.div>

      {/* Keyboard hint — fades out after first theme switch */}
      <AnimatePresence>
        {showHint && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block text-[10px] tracking-wide text-[var(--muted)] lg:pl-2 select-none"
          >
            ← → to switch
          </motion.span>
        )}
      </AnimatePresence>

      {/* Theme Gallery link */}
      <button
        onClick={() => {
          resetChoice();
          router.push("/");
        }}
        className="text-[10px] tracking-wide text-[var(--muted)] transition-colors hover:text-[var(--accent)] lg:pl-2"
      >
        Theme Gallery
      </button>
    </div>
  );
}
