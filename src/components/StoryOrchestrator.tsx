"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useStoryScroll } from "@/hooks/useStoryScroll";
import { useStoryNav } from "@/context/StoryNavContext";

const STORY_STYLE_ID = "story-carousel-styles";

const STORY_CSS = `
/* ── Story: horizontal carousel ─────────────────── */

html[data-story] {
  overflow: hidden;
  height: 100dvh;
  transition: --bg 0.5s ease, --text 0.5s ease, --accent 0.5s ease, --muted 0.5s ease, --border 0.5s ease;
}

html[data-story] body {
  overflow: hidden;
  height: 100dvh;
  width: 100vw;
  transition: background-color 0.5s ease, color 0.3s ease;
}

/* Horizontal track: sections side-by-side */
html[data-story] main {
  display: flex;
  flex-direction: row;
  height: 100dvh;
  transition: transform 0.45s cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform;
}

/* Each section: fixed viewport, internal scroll */
html[data-story] section {
  width: 100vw;
  min-width: 100vw;
  height: 100dvh;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  -webkit-overflow-scrolling: touch;
}

/* Tall sections: let content flow from top */
html[data-story] section:has(> :last-child:nth-child(n+2)) {
  justify-content: flex-start;
}

/* ── Accessibility: reduced motion ────────────────── */

@media (prefers-reduced-motion: reduce) {
  html[data-story] {
    transition: none !important;
  }
  html[data-story] body {
    transition: none !important;
  }
  html[data-story] main {
    transition: none !important;
  }
  html[data-story] section {
    height: auto;
    min-height: 100dvh;
    overflow-y: visible;
  }
}
`;

/** Activates Story horizontal carousel and theme bridge. */
export function StoryOrchestrator() {
  useStoryScroll();

  const { isStory } = useTheme();
  const { currentIndex } = useStoryNav();

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

  // Apply horizontal transform on <main>
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    if (isStory) {
      main.style.transform = `translateX(-${currentIndex * 100}vw)`;
    } else {
      main.style.transform = "";
    }

    return () => {
      if (main) main.style.transform = "";
    };
  }, [isStory, currentIndex]);

  return null;
}
