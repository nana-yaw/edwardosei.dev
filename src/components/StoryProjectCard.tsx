"use client";

import { getFeaturedProject, getAlsoBuiltProjects } from "@/data/projects";
import DeviceMockup from "@/components/DeviceMockup";

const project = getFeaturedProject();

const alsoBuilt = getAlsoBuiltProjects();

const stats = [
  { value: String(project.stats.databaseTables), label: "Tables" },
  { value: String(project.stats.tests), label: "Tests" },
  { value: String(project.stats.securityLayers), label: "Defense Layers" },
  { value: String(project.stats.rbacRoles), label: "RBAC Roles" },
];

/**
 * Compact project summary card for Story mode.
 * Fits a single viewport (~812px) as a teaser for the full project showcase.
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

        {/* Hero screenshot */}
        <div className="mb-5">
          <DeviceMockup
            device="desktop"
            src="/screenshots/dashboard-dark.png"
            alt="EWC Care App dashboard with member stats and weekly care trend"
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

        {/* Also built teaser */}
        {alsoBuilt.length > 0 && (
          <div
            className="mt-6 rounded-lg px-4 py-3"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--text) 4%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--text) 8%, transparent)",
            }}
          >
            <p
              className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em]"
              style={{
                color:
                  "color-mix(in srgb, var(--accent) 50%, transparent)",
                fontFamily: "var(--font-body)",
              }}
            >
              Also built
            </p>
            {alsoBuilt.map((p) => (
              <div key={p.slug} className="flex items-center gap-2">
                <span
                  className="text-sm font-medium"
                  style={{
                    color: "var(--text)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {p.name}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color:
                      "color-mix(in srgb, var(--text) 40%, transparent)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  — {p.subtitle}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
