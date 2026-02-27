"use client";

import { getFeaturedProject, getAlsoBuiltProjects } from "@/data/projects";
import { motion } from "framer-motion";
import DeviceMockup from "@/components/DeviceMockup";
import { CodeBlock } from "@/components/graphics/CodeBlock";
import { TestBreakdown } from "@/components/graphics/TestBreakdown";
import { TechIcon } from "@/components/graphics/TechIcons";
import { AlsoBuiltCard } from "@/components/AlsoBuiltCard";

const project = getFeaturedProject();

// ── Statement stats — oversized numbers that hit hard ──────────────────
// Grid is 12 columns. Varying spans create asymmetric rhythm.
const statementStats = [
  {
    value: String(project.stats.databaseTables),
    label: "Database Tables",
    sublabel: "42 tables. 92 indexes. Production schema.",
    colSpan: 5, // wider — lead stat
  },
  {
    value: String(project.stats.databaseIndexes),
    label: "Indexes",
    sublabel: "Query performance by design, not afterthought.",
    colSpan: 3,
  },
  {
    value: String(project.stats.tests),
    label: "Tests Written",
    sublabel: "280+ tests. 53 files. Zero excuses.",
    colSpan: 4,
  },
  {
    value: String(project.stats.securityLayers),
    label: "Defense Layers",
    sublabel: "Every mutation passes through all six.",
    colSpan: 4, // security = coral, prominent center
  },
  {
    value: "24",
    label: "Security Test Files",
    sublabel: "24 of 36 unit test files focus on security.",
    colSpan: 5, // wider — statement piece
  },
  {
    value: String(project.stats.rbacRoles),
    label: "RBAC Roles",
    sublabel: "6 roles. 12 resources. PII field filtering.",
    colSpan: 3,
  },
];

// ── Feature mosaic layout — which cards span 2 columns ─────────────────
const featureLayout: ("single" | "wide")[] = [
  "wide",
  "single",
  "single",
  "single",
  "single",
  "wide",
  "single",
  "single",
];

// ── Animation presets ──────────────────────────────────────────────────
const reveal = {
  initial: { opacity: 0, y: 40 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const stagger = (delay: number) => ({
  ...reveal,
  transition: { ...reveal.transition, delay },
});

const revealUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 60 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.8, ease: "easeOut" as const, delay },
});

function BoldShieldRing({
  layers,
  depth,
}: {
  layers: readonly { name: string; detail: string }[];
  depth: number;
}) {
  if (depth >= layers.length) {
    return (
      <div
        className="mt-3 flex items-center justify-center py-6"
        style={{
          border: "1px solid rgba(255, 107, 74, 0.25)",
          background: "rgba(255, 107, 74, 0.04)",
        }}
      >
        <div className="text-center">
          <div
            className="font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: "#FF6B4A" }}
          >
            Protected
          </div>
          <div
            className="text-[0.6rem] uppercase tracking-[0.2em]"
            style={{ color: "rgba(255, 107, 74, 0.5)" }}
          >
            Core Data
          </div>
        </div>
      </div>
    );
  }

  const layer = layers[depth];
  const coralOpacity = 0.06 + depth * 0.04;

  return (
    <div
      className={`px-3 py-2.5 sm:px-4 sm:py-3 ${depth > 0 ? "mt-2" : ""}`}
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: `${2 + depth}px solid rgba(255, 107, 74, ${coralOpacity})`,
        background: "#0a0a0a",
      }}
    >
      <div className="mb-1 flex items-center gap-3">
        <span
          className="font-['Space_Grotesk'] text-lg font-bold"
          style={{ color: "#FF6B4A" }}
        >
          {depth + 1}
        </span>
        <span
          className="text-sm font-bold"
          style={{ color: "#f5f5f0" }}
        >
          {layer.name}
        </span>
        <span
          className="hidden text-[0.78rem] sm:inline"
          style={{ color: "#666666" }}
        >
          — {layer.detail}
        </span>
      </div>
      <BoldShieldRing layers={layers} depth={depth + 1} />
    </div>
  );
}

export function BoldProject() {
  return (
    <>
    <section
      id="project"
      className="relative overflow-hidden px-6 py-32 sm:px-8 md:py-40"
      style={{ background: "#0a0a0a" }}
    >
      {/* ── Section number watermark ──────────────────────────────── */}
      <div
        className="pointer-events-none absolute -left-4 top-12 select-none font-['Space_Grotesk'] text-[clamp(12rem,25vw,20rem)] font-bold leading-none tracking-tighter md:-left-8 md:top-8"
        style={{ color: "rgba(255, 255, 255, 0.04)" }}
        aria-hidden="true"
      >
        02
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* ── Section label ───────────────────────────────────────── */}
        <motion.div
          {...stagger(0)}
          className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em]"
          style={{ color: "#666666" }}
        >
          <span style={{ color: "#FF6B4A" }}>02</span>
          <span
            className="h-px w-8"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          Featured Project
        </motion.div>

        {/* ── Project name ────────────────────────────────────────── */}
        <motion.h2
          {...stagger(0.1)}
          className="mb-3 font-['Space_Grotesk'] font-bold leading-[0.95] tracking-[-0.03em]"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            color: "#f5f5f0",
          }}
        >
          {project.name}
        </motion.h2>

        <motion.p
          {...stagger(0.15)}
          className="mb-6 max-w-xl text-lg leading-relaxed"
          style={{ color: "#666666" }}
        >
          {project.subtitle}
        </motion.p>

        {/* ── Security narrative — one punchy paragraph ────────────  */}
        <motion.p
          {...stagger(0.2)}
          className="mb-20 max-w-2xl text-base leading-relaxed"
          style={{ color: "#999" }}
        >
          {project.securityNarrative}
        </motion.p>

        {/* ================================================================
            STATEMENT STATS — Oversized numbers, asymmetric grid
            Row 1: 5 + 3 + 4 = 12   Row 2: 4 + 5 + 3 = 12
            Mobile: single column. Tablet: 2 cols. Desktop: asymmetric 12-col.
            ================================================================ */}
        <motion.div {...revealUp(0)} className="mb-24">
          {/* Responsive grid via CSS custom property per card */}
          <style>{`
            .stats-grid {
              display: grid;
              gap: 1rem;
              grid-template-columns: 1fr;
            }
            @media (min-width: 640px) {
              .stats-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (min-width: 1024px) {
              .stats-grid { grid-template-columns: repeat(12, 1fr); }
              .stats-grid > [data-span] { grid-column: var(--col-span); }
            }
          `}</style>
          <div className="stats-grid">
            {statementStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                data-span
                {...stagger(0.05 * i)}
                className="px-6 py-8 sm:px-8 sm:py-10"
                style={{
                  "--col-span": `span ${stat.colSpan}`,
                  border: "1px solid rgba(255,255,255,0.08)",
                } as React.CSSProperties}
              >
                <div
                  className="font-['Space_Grotesk'] font-bold leading-none tracking-tight"
                  style={{
                    fontSize: "clamp(3rem, 6vw, 4.5rem)",
                    color: i === 3 || i === 4 ? "#FF6B4A" : "#f5f5f0",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-3 text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "#666666" }}
                >
                  {stat.label}
                </div>
                <div
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "#555" }}
                >
                  {stat.sublabel}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ================================================================
            IN PRODUCTION — Asymmetric screenshot gallery
            ================================================================ */}
        <motion.div {...revealUp(0)} className="mb-24">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: "#FF6B4A" }}
              />
              <span style={{ color: "#666666" }}>In Production</span>
            </span>
            <span
              className="h-px flex-1"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
          </div>

          {/* Asymmetric hero row: desktop 8-col + mobile 4-col */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <motion.div {...stagger(0)} className="lg:col-span-8">
              <DeviceMockup
                device="desktop"
                src={project.screenshots.filter((s) => s.device === "desktop")[0].src}
                alt={project.screenshots.filter((s) => s.device === "desktop")[0].alt}
                className="border border-white/[0.08]"
              />
            </motion.div>
            <motion.div
              {...stagger(0.05)}
              className="flex items-end lg:col-span-4"
            >
              <DeviceMockup
                device="mobile"
                src={project.screenshots.filter((s) => s.device === "mobile")[0].src}
                alt={project.screenshots.filter((s) => s.device === "mobile")[0].alt}
                className="border border-white/[0.08]"
              />
            </motion.div>
          </div>

          {/* 3-col grid of additional desktop screenshots */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {project.screenshots
              .filter((s) => s.device === "desktop")
              .slice(1, 4)
              .map((shot, i) => (
                <motion.div key={shot.src} {...stagger(0.1 + 0.05 * i)}>
                  <DeviceMockup
                    device="desktop"
                    src={shot.src}
                    alt={shot.alt}
                    className="border border-white/[0.08]"
                  />
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* ================================================================
            DEFENSE STACK — 6 security layers, numbered, prominent
            ================================================================ */}
        <motion.div {...revealUp(0)} className="mb-24">
          <div className="mb-8 flex items-center gap-3">
            <span
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: "#FF6B4A" }}
            >
              Defense in Depth
            </span>
            <span
              className="h-px flex-1"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#666666" }}
            >
              6 Layers
            </span>
          </div>

          <div role="img" aria-label="6-layer defense in depth security architecture">
            <BoldShieldRing layers={project.securityLayers} depth={0} />
          </div>
        </motion.div>

        {/* ================================================================
            FEATURE MOSAIC — varying card sizes, text-only
            ================================================================ */}
        <motion.div {...revealUp(0)} className="mb-24">
          <div className="mb-8 flex items-center gap-3">
            <span
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: "#FF6B4A" }}
            >
              Capabilities
            </span>
            <span
              className="h-px flex-1"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.features.map((feature, i) => {
              const layout = featureLayout[i] ?? "single";
              const isWide = layout === "wide";
              return (
                <motion.div
                  key={feature.name}
                  {...stagger(0.05 * i)}
                  className={`px-6 py-6 transition-colors duration-300 hover:border-[rgba(255,107,74,0.25)] sm:px-8 sm:py-8 ${
                    isWide ? "sm:col-span-2" : ""
                  }`}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="mb-2 text-sm font-bold"
                    style={{ color: "#f5f5f0" }}
                  >
                    {feature.name}
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#666666" }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ================================================================
            ARCHITECTURE — Visual stack diagram
            ================================================================ */}
        <motion.div {...revealUp(0)} className="mb-24">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "#FF6B4A" }}>
              Architecture
            </span>
            <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>
          <div role="img" aria-label="4-layer system architecture: Client, Real-time, Auth and Security, Data">
            {project.architecture.layers.map((layer, i) => {
              const isAuth = layer.name === "Auth & Security";
              return (
                <div key={layer.name}>
                  {/* Arrow connector */}
                  {i > 0 && (
                    <div className="flex justify-center py-1.5" aria-hidden="true">
                      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
                        <line x1="10" y1="0" x2="10" y2="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                        <path d="M5 17 L10 26 L15 17" stroke="rgba(255,107,74,0.3)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  {/* Layer block */}
                  <motion.div
                    {...stagger(0.08 * i)}
                    className="px-6 py-5 sm:px-8"
                    style={{
                      background: "#0a0a0a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderLeft: isAuth ? "4px solid #FF6B4A" : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="font-['Space_Grotesk'] text-base font-bold" style={{ color: "#f5f5f0" }}>
                        {layer.name}
                      </span>
                      <span className="text-sm font-medium" style={{ color: "#FF6B4A" }}>
                        {layer.tech}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#666666" }}>
                      {layer.details}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ================================================================
            REAL CODE — Haversine check-in function
            ================================================================ */}
        <motion.div {...revealUp(0)} className="mb-24">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "#FF6B4A" }}>
              Real Code
            </span>
            <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <CodeBlock
            code={project.codeSnippet.code}
            filename={project.codeSnippet.filename}
            variant="bold"
          />
        </motion.div>

        {/* ================================================================
            TEST DISTRIBUTION — where the tests focus
            ================================================================ */}
        <motion.div {...revealUp(0)} className="mb-24">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "#FF6B4A" }}>
              Test Suite
            </span>
            <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#666666" }}>
              {project.stats.testFiles} Files
            </span>
          </div>

          <TestBreakdown
            breakdown={project.testingBreakdown}
            variant="bold"
          />

          <p className="mt-4 text-sm" style={{ color: "#666666" }}>
            24 of 36 unit test files focus on security.
          </p>
        </motion.div>

        {/* ================================================================
            TECH STACK — tags
            ================================================================ */}
        <motion.div {...revealUp(0)} className="mb-24">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: "#666666" }}
            >
              Built With
            </span>
            <span
              className="h-px flex-1"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech, i) => (
              <motion.span
                key={tech}
                {...stagger(0.03 * i)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-[rgba(255,107,74,0.3)] hover:text-[#FF6B4A]"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#999",
                }}
              >
                <TechIcon name={tech} color="#FF6B4A" size={14} />
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* ================================================================
            GITHUB LINK — simple, understated
            ================================================================ */}
        {project.githubUrl && (
          <motion.div {...revealUp(0)}>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm font-medium transition-colors duration-300 hover:text-[#FF6B4A]"
              style={{ color: "#666666" }}
            >
              <span
                className="h-px w-8"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
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
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </motion.div>
        )}
      </div>
    </section>

      {/* ── Also Built ──────────────────────────────────── */}
      {getAlsoBuiltProjects().map((p) => (
        <div key={p.slug} className="mx-auto max-w-5xl px-6 pb-20 sm:px-8">
          <AlsoBuiltCard project={p} />
        </div>
      ))}
    </>
  );
}
