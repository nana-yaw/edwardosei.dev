"use client";

import { motion, useReducedMotion } from "framer-motion";

const SECTION_LABELS = ["Hero", "Project", "Story", "Experience", "Skills", "Contact"];

interface StoryProgressBarProps {
  activeIndex: number;
  total: number;
}

export function StoryProgressBar({ activeIndex, total }: StoryProgressBarProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="flex gap-[3px] px-3 py-2"
      role="progressbar"
      aria-valuenow={activeIndex + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Section ${activeIndex + 1} of ${total}: ${SECTION_LABELS[activeIndex] ?? ""}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const isCompleted = i < activeIndex;
        const isActive = i === activeIndex;

        return (
          <div
            key={i}
            className="relative h-[3px] flex-1 overflow-hidden rounded-full"
            style={{ backgroundColor: "color-mix(in srgb, var(--text) 15%, transparent)" }}
          >
            {(isCompleted || isActive) && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--text) 70%, transparent)",
                  transformOrigin: "left",
                }}
                initial={prefersReduced ? { scaleX: 1 } : { scaleX: isCompleted ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { duration: isCompleted ? 0 : 0.6, ease: "easeOut" }
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
