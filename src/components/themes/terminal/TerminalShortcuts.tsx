"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

const SHORTCUTS = [
  { keys: ["←", "→"], desc: "Switch theme" },
  { keys: ["?"], desc: "Toggle this help" },
  { keys: ["Esc"], desc: "Close overlay" },
] as const;

/**
 * Terminal-styled keyboard shortcut overlay.
 * Press `?` to toggle. Only rendered in terminal theme.
 */
export function TerminalShortcuts() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    // Only listen for terminal theme
    if (theme !== "terminal") return;

    function onKeyDown(e: KeyboardEvent) {
      // Ignore when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, toggle, theme]);

  // Only render for terminal theme
  if (theme !== "terminal") return null;

  return (
    <>
      {/* Persistent hint — bottom-left, subtle */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 2 }}
            onClick={toggle}
            className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 rounded border border-[#21262d] bg-[#161b22] px-2 py-1 text-[11px] text-[#484f58] transition-colors hover:border-[#30363d] hover:text-[#8b949e]"
            style={{ fontFamily: "var(--font-fira-code)" }}
            aria-label="Show keyboard shortcuts"
          >
            <kbd className="rounded border border-[#30363d] bg-[#0d1117] px-1 py-0.5 text-[10px] text-[#8b949e]">
              ?
            </kbd>
            shortcuts
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[90] bg-black/60"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-1/2 top-1/2 z-[91] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-[#21262d] bg-[#0d1117]"
              role="dialog"
              aria-modal="true"
              aria-label="Keyboard shortcuts"
            >
              {/* Title bar */}
              <div className="flex items-center justify-between border-b border-[#21262d] bg-[#161b22] px-4 py-2.5">
                <span
                  className="text-xs text-[#484f58]"
                  style={{ fontFamily: "var(--font-fira-code)" }}
                >
                  man shortcuts
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs text-[#484f58] transition-colors hover:text-[#c9d1d9]"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <p
                  className="mb-3 text-xs text-[#484f58]"
                  style={{ fontFamily: "var(--font-fira-code)" }}
                >
                  # Available keyboard shortcuts
                </p>

                <ul className="space-y-2">
                  {SHORTCUTS.map(({ keys, desc }) => (
                    <li
                      key={desc}
                      className="flex items-center justify-between"
                    >
                      <span
                        className="text-sm text-[#c9d1d9]/80"
                        style={{ fontFamily: "var(--font-fira-code)" }}
                      >
                        {desc}
                      </span>
                      <span className="flex items-center gap-1">
                        {keys.map((k, i) => (
                          <span key={k} className="flex items-center gap-1">
                            {i > 0 && (
                              <span className="text-[10px] text-[#484f58]">
                                /
                              </span>
                            )}
                            <kbd className="rounded border border-[#30363d] bg-[#161b22] px-1.5 py-0.5 text-[11px] text-[#8b949e]">
                              {k}
                            </kbd>
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-4 border-t border-[#21262d] pt-3 text-[11px] text-[#484f58]"
                  style={{ fontFamily: "var(--font-fira-code)" }}
                >
                  Press <kbd className="rounded border border-[#30363d] bg-[#161b22] px-1 py-0.5 text-[10px] text-[#8b949e]">?</kbd> or <kbd className="rounded border border-[#30363d] bg-[#161b22] px-1 py-0.5 text-[10px] text-[#8b949e]">Esc</kbd> to close
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
