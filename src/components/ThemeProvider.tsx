"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { ThemeContext } from "@/hooks/useTheme";
import { defaultTheme, type ThemeId } from "@/lib/themes";

const STORAGE_KEY = "portfolio-theme";
const CHOSEN_KEY = "portfolio-theme-chosen";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
  const [hasChosen, setHasChosen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const chosen = localStorage.getItem(CHOSEN_KEY) === "true";
    if (saved) setThemeState(saved);
    if (chosen) setHasChosen(true);
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme);
    setHasChosen(true);
    localStorage.setItem(STORAGE_KEY, newTheme);
    localStorage.setItem(CHOSEN_KEY, "true");
    document.documentElement.setAttribute("data-theme", newTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (!mounted) return null;

  return (
    <ThemeContext value={{ theme, setTheme, hasChosen }}>
      {children}
    </ThemeContext>
  );
}
