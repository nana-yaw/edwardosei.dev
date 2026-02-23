"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { themes, themeOrder, type ThemeId } from "@/lib/themes";

const dotColors: Record<ThemeId, string> = {
  cinematic: "#4f7df5",
  minimal: "#1a1a2e",
  bold: "#7c3aed",
  terminal: "#4ade80",
};

// Per-theme pulse ring color (matches --accent)
const pulseRingColors: Record<ThemeId, string> = {
  cinematic: "rgba(79, 125, 245, 0.4)",
  minimal: "rgba(26, 26, 46, 0.25)",
  bold: "rgba(124, 58, 237, 0.4)",
  terminal: "rgba(74, 222, 128, 0.4)",
};

export function ThemeSwitcher() {
  const { theme, setTheme, resetChoice } = useTheme();
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  const router = useRouter();

  // One-time pulse on mount to draw attention
  useEffect(() => {
    const timer = setTimeout(() => setShouldPulse(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const ringColor = pulseRingColors[theme];

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-auto lg:right-auto lg:top-[72px] lg:left-6 z-50 flex flex-col lg:flex-col-reverse items-end lg:items-start gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 shadow-lg"
          >
            {themeOrder.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setTheme(id);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--border)] ${
                  id === theme ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: dotColors[id] }}
                />
                {themes[id].name}
              </button>
            ))}
            <div className="my-1 h-px bg-[var(--border)]" />
            <button
              onClick={() => {
                resetChoice();
                router.push("/");
                setOpen(false);
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[var(--muted)] transition-colors hover:bg-[var(--border)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              Theme Gallery
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !open && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--accent)] shadow-md"
          >
            Switch theme
          </motion.span>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label="Switch theme"
        animate={
          shouldPulse
            ? {
                scale: [1, 1.15, 1],
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
        className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 shadow-lg transition-colors hover:border-[var(--accent)]"
      >
        {themeOrder.map((id) => (
          <span
            key={id}
            className={`h-2.5 w-2.5 rounded-full transition-transform ${
              id === theme ? "scale-125" : "opacity-50"
            }`}
            style={{ background: dotColors[id] }}
          />
        ))}
      </motion.button>
    </div>
  );
}
