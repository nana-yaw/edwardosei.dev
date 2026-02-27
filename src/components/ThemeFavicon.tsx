"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

/**
 * Favicon colors per theme — [background, letter, dot accent].
 * Matches each theme's visual identity.
 */
const FAVICON_COLORS: Record<string, [string, string, string]> = {
  cinematic: ["#0a0a0a", "#f0f0f5", "#4f7df5"],
  minimal: ["#fafaf9", "#1a1a1a", "#1a1a1a"],
  bold: ["#0a0a0a", "#f0f0f5", "#7c3aed"],
  terminal: ["#0d1117", "#3fb950", "#3fb950"],
};

function buildFaviconSvg(bg: string, letter: string, dot: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="${bg}"/>
  <text x="6" y="24" font-family="system-ui,sans-serif" font-weight="700" font-size="22" fill="${letter}">D</text>
  <circle cx="24" cy="22" r="2.5" fill="${dot}"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Dynamically swaps the favicon to match the active theme.
 * In Story mode, uses the current sub-theme's colors.
 */
export function ThemeFavicon() {
  const { theme, isStory, storyTheme } = useTheme();
  const activeTheme = isStory ? storyTheme : theme;

  useEffect(() => {
    const colors = FAVICON_COLORS[activeTheme] ?? FAVICON_COLORS.cinematic;
    const href = buildFaviconSvg(...colors);

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [activeTheme]);

  return null;
}
