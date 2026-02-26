"use client";

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { ThemeContext } from "@/hooks/useTheme";
import { defaultTheme, type ThemeId, type PureThemeId } from "@/lib/themes";

const STORAGE_KEY = "portfolio-theme";
const CHOSEN_KEY = "portfolio-theme-chosen";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
  const [hasChosen, setHasChosen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [storyTheme, setStoryThemeState] = useState<PureThemeId>("cinematic");

  const isStory = theme === "story";

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Migrate legacy "journey" → "story"
    const saved = (raw === "journey" ? "story" : raw) as ThemeId | null;
    const chosen = localStorage.getItem(CHOSEN_KEY) === "true";
    if (saved) setThemeState(saved);
    if (chosen) setHasChosen(true);
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: ThemeId) => {
    // Brief crossfade on theme change
    document.documentElement.style.transition = "opacity 0.15s ease";
    document.documentElement.style.opacity = "0.6";
    requestAnimationFrame(() => {
      setThemeState(newTheme);
      setHasChosen(true);
      localStorage.setItem(STORAGE_KEY, newTheme);
      localStorage.setItem(CHOSEN_KEY, "true");
      // For story, set data-theme to the initial sub-theme (cinematic/hero)
      const attr = newTheme === "story" ? "cinematic" : newTheme;
      document.documentElement.setAttribute("data-theme", attr);
      if (newTheme === "story") {
        document.documentElement.setAttribute("data-story", "");
        setStoryThemeState("cinematic");
      } else {
        document.documentElement.removeAttribute("data-story");
      }
      requestAnimationFrame(() => {
        document.documentElement.style.opacity = "1";
        setTimeout(() => {
          document.documentElement.style.transition = "";
        }, 150);
      });
    });
  }, []);

  // Direct DOM write for story sub-theme changes (no crossfade)
  const setStoryTheme = useCallback((newPureTheme: PureThemeId) => {
    setStoryThemeState(newPureTheme);
    document.documentElement.setAttribute("data-theme", newPureTheme);
  }, []);

  const resetChoice = useCallback(() => {
    setHasChosen(false);
    localStorage.removeItem(CHOSEN_KEY);
  }, []);

  // On mount / theme change, set the correct data-theme + data-story attributes
  useEffect(() => {
    if (isStory) {
      document.documentElement.setAttribute("data-theme", storyTheme);
      document.documentElement.setAttribute("data-story", "");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.removeAttribute("data-story");
    }
  }, [theme, isStory, storyTheme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      hasChosen,
      resetChoice,
      isStory,
      storyTheme,
      setStoryTheme,
    }),
    [theme, setTheme, hasChosen, resetChoice, isStory, storyTheme, setStoryTheme],
  );

  if (!mounted) return null;

  return (
    <ThemeContext value={value}>
      {children}
    </ThemeContext>
  );
}
