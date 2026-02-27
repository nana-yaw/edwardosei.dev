"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface StoryCardRevealProps {
  children: ReactNode;
  /** When false, renders children directly with no animation wrapper */
  enabled: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

/**
 * Wraps section content with a staggered entrance animation in Story mode.
 * Re-triggers on each scroll into view (not `once`).
 * In non-Story mode or with reduced motion, renders children directly.
 */
export function StoryCardReveal({ children, enabled }: StoryCardRevealProps) {
  const prefersReduced = useReducedMotion();

  if (!enabled || prefersReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: "some", margin: "-5% 0px" }}
    >
      {children}
    </motion.div>
  );
}
