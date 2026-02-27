"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps the app with Framer Motion's MotionConfig to respect
 * the user's prefers-reduced-motion OS preference globally.
 * Individual components using useReducedMotion() still work —
 * MotionConfig and per-component hooks are compatible.
 */
export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
