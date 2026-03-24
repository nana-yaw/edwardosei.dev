"use client";

import { getFeaturedProject, getAlsoBuiltProjects } from "@/data/projects";
import { motion } from "framer-motion";
import DeviceMockup from "@/components/DeviceMockup";
import { ScreenshotCarousel } from "@/components/ScreenshotCarousel";
import { CodeBlock } from "@/components/graphics/CodeBlock";
import { TestBreakdown } from "@/components/graphics/TestBreakdown";
import { TechIcon } from "@/components/graphics/TechIcons";
import { AlsoBuiltCard } from "@/components/AlsoBuiltCard";

/* ── Concentric Shield — recursive nesting for defense-in-depth ──────── */
function ShieldRing({
  layers,
  depth,
}: {
  layers: readonly { name: string; detail: string }[];
  depth: number;
}) {
  if (depth >= layers.length) {
    return (
      <div className="mt-2 flex items-center justify-center rounded-lg border border-[rgba(79,125,245,0.2)] bg-[rgba(79,125,245,0.06)] py-5">
        <div className="text-center">
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#4f7df5]">
            Protected
          </div>
          <div className="text-[0.55rem] uppercase tracking-[0.15em] text-[#4f7df5]/50">
            Core Data
          </div>
        </div>
      </div>
    );
  }

  const layer = layers[depth];
  const borderOpacity = 0.06 + depth * 0.04;
  const bgOpacity = 0.008 + depth * 0.006;
  const badgeOpacity = 0.08 + depth * 0.025;

  return (
    <div
      className={`rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 ${depth > 0 ? "mt-2" : ""}`}
      style={{
        borderColor: `rgba(79, 125, 245, ${borderOpacity})`,
        background: `rgba(79, 125, 245, ${bgOpacity})`,
      }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[0.6rem] font-bold text-[#4f7df5]"
          style={{ background: `rgba(79, 125, 245, ${badgeOpacity})` }}
        >
          {depth + 1}
        </span>
        <span className="text-[0.78rem] font-bold text-[#f0f0f5]">
          {layer.name}
        </span>
        <span className="hidden text-[0.68rem] text-[#55556a] sm:inline">
          — {layer.detail}
        </span>
      </div>
      <ShieldRing layers={layers} depth={depth + 1} />
    </div>
  );
}

const project = getFeaturedProject();

const stats = [
  { value: String(project.stats.databaseTables), label: "Tables" },
  { value: String(project.stats.databaseIndexes), label: "Indexes" },
  { value: String(project.stats.tests), label: "Tests" },
  { value: String(project.stats.securityLayers), label: "Defense Layers" },
  { value: "24", label: "Security Test Files" },
  { value: String(project.stats.rbacRoles), label: "RBAC Roles" },
];

const reveal = {
  initial: { opacity: 0, y: 30 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const revealDelay = (delay: number) => ({
  ...reveal,
  transition: { ...reveal.transition, delay },
});

export function CinematicProject() {
  return (
    <>
    <section id="project" className="relative z-[2] px-6 py-32">
      <div className="mx-auto max-w-[1200px]">
        {/* Section label */}
        <motion.div
          {...revealDelay(0)}
          className="mb-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#4f7df5]"
        >
          <span className="inline-block h-px w-6 bg-[#4f7df5]" />
          Featured Project
        </motion.div>

        <motion.h2
          {...revealDelay(0.1)}
          className="mb-12 text-center text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight tracking-tight text-[#f0f0f5]"
        >
          The project I&apos;m most proud of.
        </motion.h2>

        {/* Project card */}
        <motion.div
          {...revealDelay(0.2)}
          className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0f0f17]"
        >
          <div className="px-8 pt-10 sm:px-12">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(79,125,245,0.15)] bg-[rgba(79,125,245,0.1)] px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-[#4f7df5]">
              Full-Stack PWA
            </span>
          </div>

          <div className="px-8 pb-10 pt-6 sm:px-12 sm:pb-12">
            <h3 className="mb-2 text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold leading-[1.1] tracking-tight text-[#f0f0f5]">
              {project.name}
            </h3>
            <p className="mb-10 max-w-2xl text-[1.05rem] leading-relaxed text-[#8888a0]">
              {project.longDescription}
            </p>

            {/* ── In Production — Screenshot showcase ────────────── */}
            <div className="mb-10">
              <motion.div
                {...revealDelay(0.3)}
                className="mb-4 flex items-center gap-3"
              >
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4f7df5]">
                  In Production
                </h4>
                <span className="h-px flex-1 bg-white/[0.06]" />
              </motion.div>

              <motion.div {...revealDelay(0.4)}>
                <ScreenshotCarousel
                  screenshots={project.screenshots}
                  filter="desktop"
                  interval={4000}
                  variant="mockup"
                  className="rounded-xl border border-white/[0.06]"
                />
              </motion.div>

              {/* Mobile screenshot carousel */}
              <motion.div
                {...revealDelay(0.8)}
                className="mx-auto mt-6 max-w-[200px]"
              >
                <ScreenshotCarousel
                  screenshots={project.screenshots}
                  filter="mobile"
                  interval={5000}
                  variant="mockup"
                />
              </motion.div>
            </div>

            {/* ── Security Defense Stack — Concentric Shield ──────── */}
            <div className="mb-10">
              <motion.div
                {...revealDelay(0.3)}
                className="mb-5 flex items-center gap-3"
              >
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4f7df5]">
                  Defense in Depth · 6 Layers
                </h4>
                <span className="h-px flex-1 bg-white/[0.06]" />
              </motion.div>
              <motion.div
                {...revealDelay(0.4)}
                role="img"
                aria-label="6-layer defense in depth security architecture protecting core data"
              >
                <ShieldRing layers={project.securityLayers} depth={0} />
              </motion.div>
            </div>

            {/* Stats row — security numbers prominent */}
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-5 text-center"
                >
                  <div className="text-2xl font-extrabold tracking-tight text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[0.72rem] font-medium text-[#55556a]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Test Distribution — where the tests focus ────── */}
            <div className="mb-10">
              <motion.div
                {...revealDelay(0)}
                className="mb-5 flex items-center gap-3"
              >
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4f7df5]">
                  Test Suite · {project.stats.testFiles} Files
                </h4>
                <span className="h-px flex-1 bg-white/[0.06]" />
              </motion.div>
              <motion.div {...revealDelay(0.1)}>
                <TestBreakdown
                  breakdown={project.testingBreakdown}
                  variant="cinematic"
                />
              </motion.div>
            </div>

            {/* ── Architecture — Visual stack diagram ────────────── */}
            <div className="mb-10">
              <motion.div
                {...revealDelay(0)}
                className="mb-5 flex items-center gap-3"
              >
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4f7df5]">
                  System Architecture
                </h4>
                <span className="h-px flex-1 bg-white/[0.06]" />
              </motion.div>
              <div
                role="img"
                aria-label="4-layer system architecture: Client, Real-time, Auth and Security, Data"
              >
                {project.architecture.layers.map((layer, i) => {
                  const isAuth = layer.name === "Auth & Security";
                  return (
                    <div key={layer.name}>
                      {/* Arrow connector between layers */}
                      {i > 0 && (
                        <div
                          className="flex justify-center py-1"
                          aria-hidden="true"
                        >
                          <svg
                            width="20"
                            height="24"
                            viewBox="0 0 20 24"
                            fill="none"
                          >
                            <line
                              x1="10"
                              y1="0"
                              x2="10"
                              y2="16"
                              stroke="rgba(79,125,245,0.2)"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M5 14 L10 22 L15 14"
                              stroke="rgba(79,125,245,0.25)"
                              strokeWidth="1.5"
                              fill="none"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                      {/* Layer box */}
                      <motion.div
                        {...revealDelay(0.1 + i * 0.1)}
                        className={`rounded-xl px-5 py-4 ${
                          isAuth
                            ? "border-[1.5px] border-[rgba(79,125,245,0.35)] bg-[rgba(79,125,245,0.04)]"
                            : "border border-white/[0.08] bg-white/[0.015]"
                        }`}
                      >
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="text-sm font-bold text-[#f0f0f5]">
                            {layer.name}
                          </span>
                          <span className="text-[0.75rem] font-medium text-[#4f7df5]">
                            {layer.tech}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[0.78rem] leading-relaxed text-[#55556a]">
                          {layer.details}
                        </p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Real Code — Haversine check-in ───────────────── */}
            <div className="mb-10">
              <motion.div
                {...revealDelay(0)}
                className="mb-5 flex items-center gap-3"
              >
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4f7df5]">
                  Real Code
                </h4>
                <span className="h-px flex-1 bg-white/[0.06]" />
              </motion.div>
              <motion.div {...revealDelay(0.1)}>
                <CodeBlock
                  code={project.codeSnippet.code}
                  filename={project.codeSnippet.filename}
                  variant="cinematic"
                />
              </motion.div>
            </div>

            {/* Tech stack */}
            <div className="mb-8 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[0.78rem] font-medium text-[#8888a0]"
                >
                  <TechIcon name={tech} color="#4f7df5" size={14} />
                  {tech}
                </span>
              ))}
            </div>

            {/* Features */}
            <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.features.map((feature) => (
                <div
                  key={feature.name}
                  className="rounded-xl bg-white/[0.015] p-4"
                >
                  <p className="mb-1 text-sm font-bold text-[#f0f0f5]">
                    {feature.name}
                  </p>
                  <p className="text-[0.8rem] leading-relaxed text-[#55556a]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap gap-3 border-t border-white/[0.06] px-8 py-6 sm:px-12">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-2.5 text-sm font-medium text-[#8888a0] transition-colors hover:border-white/10 hover:text-[#f0f0f5]"
              >
                Source Code
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>

      {/* ── Also Built ──────────────────────────────────── */}
      {getAlsoBuiltProjects().map((p) => (
        <div key={p.slug} className="mx-auto max-w-5xl px-6 pb-20 sm:px-10 lg:px-16">
          <AlsoBuiltCard project={p} />
        </div>
      ))}
    </>
  );
}
