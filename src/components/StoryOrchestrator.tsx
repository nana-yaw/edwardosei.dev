"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useStoryScroll } from "@/hooks/useStoryScroll";
import { useStoryDesktopScroll } from "@/hooks/useStoryDesktopScroll";

const STORY_STYLE_ID = "story-carousel-styles";

const STORY_CSS = `
/* ── Story carousel: base (shared) ───────────────── */

html[data-story] {
  scroll-behavior: smooth;
  scroll-padding-top: 0px;
  transition: --bg 0.5s ease, --text 0.5s ease, --accent 0.5s ease, --muted 0.5s ease, --border 0.5s ease;
}

html[data-story] body {
  transition: background-color 0.5s ease, color 0.3s ease;
}

/* ── Story carousel: fullscreen section slides ─────── */

html[data-story] section {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: hidden;
}

/* Sections taller than viewport: don't force centering,
   let content flow naturally so nothing gets clipped. */
html[data-story] section:has(> :last-child:nth-child(n+2)) {
  justify-content: flex-start;
}

/* ── Mobile/Touch: CSS scroll-snap for Shorts feel ── */

@media (pointer: coarse) {
  html[data-story] {
    scroll-snap-type: y proximity;
  }
  html[data-story] section {
    scroll-snap-align: start;
  }
  /* Compact mobile padding for the immersive card feel */
  html[data-story] section {
    padding-top: 12px;
    padding-bottom: 16px;
  }
}

/* ── Desktop: no scroll-snap (JS handles it) ─────────── */

@media (pointer: fine) {
  html[data-story] {
    scroll-snap-type: none;
  }
}

/* ── Accessibility: reduced motion ───────────────────── */

@media (prefers-reduced-motion: reduce) {
  html[data-story] {
    scroll-snap-type: none !important;
    scroll-behavior: auto !important;
    transition: none !important;
  }
  html[data-story] body {
    transition: none !important;
  }
  html[data-story] section {
    min-height: auto;
    display: block;
  }
}
`;

/** Activates Story scroll-to-theme bridge and injects carousel CSS. */
export function StoryOrchestrator() {
  useStoryScroll();

  const { isStory } = useTheme();

  // Desktop full-page scroll interception (no-op when !isStory or on touch)
  useStoryDesktopScroll(isStory);

  // Inject/remove Story carousel styles dynamically
  useEffect(() => {
    if (isStory) {
      if (!document.getElementById(STORY_STYLE_ID)) {
        const style = document.createElement("style");
        style.id = STORY_STYLE_ID;
        style.textContent = STORY_CSS;
        document.head.appendChild(style);
      }
    } else {
      const existing = document.getElementById(STORY_STYLE_ID);
      if (existing) existing.remove();
    }

    return () => {
      const existing = document.getElementById(STORY_STYLE_ID);
      if (existing) existing.remove();
    };
  }, [isStory]);

  return null;
}
