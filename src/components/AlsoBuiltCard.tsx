"use client";

import { useState, useEffect, useCallback } from "react";
import type { AlsoBuiltProject } from "@/data/projects";

/**
 * Compact project card for "also built" projects.
 * Features an auto-rotating screenshot carousel with dot indicators.
 * Uses CSS custom properties (var(--bg), var(--text), var(--accent))
 * so it adapts to any theme without theme-specific styles.
 */
export function AlsoBuiltCard({ project }: { project: AlsoBuiltProject }) {
  const images = project.screenshots?.length
    ? project.screenshots
    : project.screenshot
      ? [project.screenshot]
      : [];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    if (images.length <= 1) return;
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (paused || images.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next, images.length]);

  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--text) 4%, var(--bg))",
        border:
          "1px solid color-mix(in srgb, var(--text) 8%, transparent)",
      }}
    >
      {/* Screenshot Carousel */}
      {images.length > 0 && (
        <div
          className="group relative w-full overflow-hidden"
          style={{ height: "320px" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Images */}
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${project.name} — screenshot ${i + 1}`}
              className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === current ? 1 : 0 }}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}

          {/* Bottom gradient fade */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background: `linear-gradient(to top, color-mix(in srgb, var(--text) 4%, var(--bg)), transparent)`,
            }}
          />

          {/* Prev / Next arrows (show on hover) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 opacity-0 transition-opacity group-hover:opacity-80"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--bg) 70%, transparent)",
                  color: "var(--text)",
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
                  backgroundColor:
                    "color-mix(in srgb, var(--bg) 70%, transparent)",
                  color: "var(--text)",
                }}
                aria-label="Next screenshot"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "1.25rem" : "0.375rem",
                    backgroundColor:
                      i === current
                        ? "var(--accent)"
                        : "color-mix(in srgb, var(--text) 30%, transparent)",
                  }}
                  aria-label={`Go to screenshot ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6 sm:px-8 sm:py-8">
        {/* Label */}
        <p
          className="mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em]"
          style={{
            color: "color-mix(in srgb, var(--accent) 70%, transparent)",
            fontFamily: "var(--font-body)",
          }}
        >
          Also Built
        </p>

        {/* Project name + subtitle */}
        <h3
          className="mb-1 text-xl font-bold tracking-tight sm:text-2xl"
          style={{
            color: "var(--text)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {project.name}
        </h3>
        <p
          className="mb-4 text-sm leading-relaxed"
          style={{
            color: "color-mix(in srgb, var(--text) 55%, transparent)",
            fontFamily: "var(--font-body)",
          }}
        >
          {project.subtitle}
        </p>

        {/* Highlights */}
        <ul className="mb-4 space-y-1.5">
          {project.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-2 text-sm leading-snug"
              style={{
                color: "color-mix(in srgb, var(--text) 70%, transparent)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span
                className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent) 60%, transparent)",
                }}
                aria-hidden="true"
              />
              {h}
            </li>
          ))}
        </ul>

        {/* Tech stack pills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--text) 8%, transparent)",
                color:
                  "color-mix(in srgb, var(--text) 60%, transparent)",
                fontFamily: "var(--font-body)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                color:
                  "color-mix(in srgb, var(--accent) 80%, var(--text))",
                fontFamily: "var(--font-body)",
              }}
            >
              Live Site
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                color:
                  "color-mix(in srgb, var(--text) 50%, transparent)",
                fontFamily: "var(--font-body)",
              }}
            >
              Source
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
