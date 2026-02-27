"use client";

import type { AlsoBuiltProject } from "@/data/projects";

/**
 * Compact project card for "also built" projects.
 * Uses CSS custom properties (var(--bg), var(--text), var(--accent))
 * so it adapts to any theme without theme-specific styles.
 */
export function AlsoBuiltCard({ project }: { project: AlsoBuiltProject }) {
  return (
    <div
      className="rounded-xl px-6 py-6 sm:px-8 sm:py-8"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--text) 4%, var(--bg))",
        border:
          "1px solid color-mix(in srgb, var(--text) 8%, transparent)",
      }}
    >
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
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
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
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
