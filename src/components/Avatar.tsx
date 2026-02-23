"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeId } from "@/lib/themes";

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------
// Renders "EO" initials inside a themed circle. If `src` is provided, renders
// an <img> photo instead (easy swap once a real headshot is available).
// Per-theme font, border, and color treatments match the reference prototypes.
// ---------------------------------------------------------------------------

interface AvatarProps {
  /** sm = 48px, md = 72px (default), lg = 96px */
  size?: "sm" | "md" | "lg";
  /** Optional photo URL -- when present, renders image instead of initials */
  src?: string;
  /** Forwarded to the outer wrapper */
  className?: string;
}

// -- Size map ---------------------------------------------------------------

const sizeClasses = {
  sm: "w-12 h-12",   // 48px
  md: "w-18 h-18",   // 72px
  lg: "w-24 h-24",   // 96px
} as const;

const textSizeClasses = {
  sm: "text-sm",
  md: "text-xl",
  lg: "text-2xl",
} as const;

// -- Per-theme visual tokens ------------------------------------------------

interface ThemeTokens {
  border: string;
  text: string;
  font: string;
}

const themeTokens: Record<ThemeId, ThemeTokens> = {
  cinematic: {
    border: "border border-white/20",
    text: "text-[#f0f0f5]",
    font: "font-[Inter] font-light",           // weight 300
  },
  minimal: {
    border: "border border-[#1a1a2e]",
    text: "text-[#1a1a2e]",
    font: "font-[Playfair_Display]",
  },
  bold: {
    border: "border-2 border-[#FF6B4A]",
    text: "text-[#FF6B4A]",
    font: "font-[Space_Grotesk] font-bold",
  },
  terminal: {
    border: "border border-[#3fb950]",
    text: "text-[#3fb950]",
    font: "font-[Fira_Code]",
  },
} as const;

// -- Framer Motion config ---------------------------------------------------

const entrance = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: {
    duration: 0.45,
    ease: [0.25, 0.1, 0.25, 1] as const,
  },
} as const;

// -- Component --------------------------------------------------------------

export default function Avatar({
  size = "md",
  src,
  className = "",
}: AvatarProps) {
  const { theme } = useTheme();
  const tokens = themeTokens[theme];

  const shared = [
    "rounded-full bg-transparent flex items-center justify-center",
    "select-none overflow-hidden",
    sizeClasses[size],
    tokens.border,
    className,
  ].join(" ");

  // Photo mode -- easy future swap
  if (src) {
    return (
      <motion.div className={shared} {...entrance}>
        <img
          src={src}
          alt="Edward Osei-Nyarko"
          className="w-full h-full object-cover rounded-full"
          draggable={false}
        />
      </motion.div>
    );
  }

  // Initials mode (default)
  return (
    <motion.div
      className={[shared, tokens.text, tokens.font].join(" ")}
      {...entrance}
    >
      <span className={textSizeClasses[size]} aria-hidden="true">
        EO
      </span>
      <span className="sr-only">Edward Osei-Nyarko</span>
    </motion.div>
  );
}
