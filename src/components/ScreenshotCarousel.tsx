"use client";

import { useState, useEffect, useCallback } from "react";
import DeviceMockup from "@/components/DeviceMockup";

interface Screenshot {
  src: string;
  alt: string;
  device: "desktop" | "mobile";
}

interface ScreenshotCarouselProps {
  screenshots: readonly Screenshot[];
  /** Show only desktop, mobile, or all */
  filter?: "desktop" | "mobile" | "all";
  /** Auto-rotate interval in ms (0 = disabled). Default 4000 */
  interval?: number;
  /** Max screenshots to show. Default: all */
  limit?: number;
  /** Extra classes on the wrapper */
  className?: string;
  /** Style variant */
  variant?: "mockup" | "raw";
  /** Height for raw variant */
  height?: string;
}

/**
 * Reusable screenshot carousel with DeviceMockup frames.
 * Auto-rotates with crossfade, pause-on-hover, dot indicators, and prev/next arrows.
 * Works across all themes via CSS custom properties.
 */
export function ScreenshotCarousel({
  screenshots,
  filter = "all",
  interval = 4000,
  limit,
  className = "",
  variant = "mockup",
  height = "400px",
}: ScreenshotCarouselProps) {
  const filtered =
    filter === "all"
      ? screenshots
      : screenshots.filter((s) => s.device === filter);

  const items = limit ? filtered.slice(0, limit) : filtered;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    if (items.length <= 1) return;
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    if (items.length <= 1) return;
    setCurrent((c) => (c - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length <= 1 || interval === 0) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [paused, next, items.length, interval]);

  if (items.length === 0) return null;

  // Single screenshot — no carousel controls
  if (items.length === 1) {
    const shot = items[0];
    return variant === "mockup" ? (
      <div className={className}>
        <DeviceMockup device={shot.device} src={shot.src} alt={shot.alt} />
      </div>
    ) : (
      <div className={`relative overflow-hidden ${className}`} style={{ height }}>
        <img src={shot.src} alt={shot.alt} className="h-full w-full object-cover object-top" />
      </div>
    );
  }

  return (
    <div
      className={`group relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {variant === "mockup" ? (
        <div
          className="relative w-full overflow-hidden rounded-xl bg-[#1e1e1e] shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]"
          style={{ aspectRatio: "16 / 10" }}
        >
          {/* Top bezel with traffic lights */}
          <div className="flex items-center gap-1.5 px-3 h-8 bg-[#2a2a2a]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
          </div>
          {/* Screen area with crossfading images */}
          <div className="relative w-full" style={{ height: "calc(100% - 2rem)" }}>
            {items.map((shot, i) => (
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out"
                style={{ opacity: i === current ? 1 : 0 }}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden" style={{ height }}>
          {items.map((shot, i) => (
            <img
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === current ? 1 : 0 }}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
            style={{
              background: `linear-gradient(to top, color-mix(in srgb, var(--text) 4%, var(--bg)), transparent)`,
            }}
          />
        </div>
      )}

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 opacity-0 transition-opacity group-hover:opacity-80"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg, #000) 70%, transparent)",
          color: "var(--text, #fff)",
        }}
        aria-label="Previous screenshot"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 opacity-0 transition-opacity group-hover:opacity-80"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg, #000) 70%, transparent)",
          color: "var(--text, #fff)",
        }}
        aria-label="Next screenshot"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === current ? "1.25rem" : "0.375rem",
              backgroundColor:
                i === current
                  ? "var(--accent, #4f7df5)"
                  : "color-mix(in srgb, var(--text, #fff) 30%, transparent)",
            }}
            aria-label={`Go to screenshot ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
