"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { themes, themeOrder, type ThemeId } from "@/lib/themes";

const dotColors: Record<ThemeId, string> = {
  cinematic: "#4f7df5",
  minimal: "#1a1a2e",
  bold: "#7c3aed",
  terminal: "#4ade80",
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
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
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch theme"
        className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 shadow-lg transition-colors hover:border-[var(--muted)]"
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
      </button>
    </div>
  );
}
