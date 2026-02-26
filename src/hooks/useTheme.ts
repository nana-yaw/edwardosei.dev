"use client";

import { createContext, useContext } from "react";
import type { ThemeId, PureThemeId } from "@/lib/themes";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  hasChosen: boolean;
  resetChoice: () => void;
  isStory: boolean;
  storyTheme: PureThemeId;
  setStoryTheme: (theme: PureThemeId) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
