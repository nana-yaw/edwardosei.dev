"use client";

import { getFeaturedProject } from "@/data/projects";
import { ScreenshotCarousel } from "@/components/ScreenshotCarousel";

const project = getFeaturedProject();

const stats = [
  { value: String(project.stats.databaseTables), label: "Tables" },
  { value: String(project.stats.tests), label: "Tests" },
  { value: String(project.stats.securityLayers), label: "Defense Layers" },
  { value: String(project.stats.rbacRoles), label: "RBAC Roles" },
];

/**
 * Compact project summary card for Story mode.
 * Features screenshot carousel for the featured project and also-built cards.
 * Uses CSS custom properties for theme-adaptive colors.
 */
export function StoryProjectCard() {
  return (
    <section
      id="project"
      className="flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="mx-auto w-full max-w-lg">
        {/* Section label */}
        <p
          className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em]"
          style={{
            color: "color-mix(in srgb, var(--accent) 70%, transparent)",
            fontFamily: "var(--font-body)",
          }}
        >
          Featured Project
        </p>

        {/* Project name */}
        <h2
          className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{
            color: "var(--text)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {project.name}
        </h2>

        {/* Subtitle */}
        <p
          className="mb-5 text-sm leading-relaxed sm:text-base"
          style={{
            color: "color-mix(in srgb, var(--text) 55%, transparent)",
            fontFamily: "var(--font-body)",
          }}
        >
          {project.subtitle}
        </p>

        {/* Screenshot carousel */}
        <div className="mb-5">
          <ScreenshotCarousel
            screenshots={project.screenshots}
            filter="desktop"
            interval={4000}
            variant="mockup"
            className="rounded-lg"
          />
        </div>

        {/* Stats grid — 2×2 */}
        <div className="mb-5 grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg px-3 py-3 text-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--text) 6%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--text) 8%, transparent)",
              }}
            >
              <div
                className="text-xl font-bold tracking-tight sm:text-2xl"
                style={{
                  color: "var(--text)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {stat.value}
              </div>
              <div
                className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.12em]"
                style={{
                  color:
                    "color-mix(in srgb, var(--text) 45%, transparent)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack — compact inline */}
        <p
          className="mb-5 text-xs leading-relaxed sm:text-sm"
          style={{
            color: "color-mix(in srgb, var(--text) 35%, transparent)",
            fontFamily: "var(--font-body)",
          }}
        >
          {project.techStack.slice(0, 6).join(" \u00B7 ")}
        </p>

        {/* GitHub CTA */}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              color: "color-mix(in srgb, var(--accent) 80%, var(--text))",
              fontFamily: "var(--font-body)",
            }}
          >
            Source on GitHub
            <svg
              width="14"
              height="14"
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
    </section>
  );
}
