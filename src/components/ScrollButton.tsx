"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ScrollButton() {
  const { isStory } = useTheme();
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: atTop ? document.documentElement.scrollHeight : 0,
      behavior: prefersReduced ? "instant" : "smooth",
    });
  };

  // Story mode uses immersive overlay
  if (isStory) return null;

  return (
    <button
      onClick={handleClick}
      aria-label={atTop ? "Scroll to bottom" : "Scroll to top"}
      className="fixed bottom-[72px] right-6 lg:bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] shadow-lg transition-colors hover:border-[var(--muted)]"
    >
      {atTop ? (
        <ArrowDown className="h-4 w-4 text-[var(--muted)]" />
      ) : (
        <ArrowUp className="h-4 w-4 text-[var(--muted)]" />
      )}
    </button>
  );
}
