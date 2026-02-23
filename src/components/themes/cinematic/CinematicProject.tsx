"use client";

import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import DeviceMockup from "@/components/DeviceMockup";

const project = projects[0];

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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {project.screenshots
                  .filter((s) => s.device === "desktop")
                  .slice(0, 4)
                  .map((shot, i) => (
                    <motion.div key={shot.src} {...revealDelay(0.4 + 0.1 * i)}>
                      <DeviceMockup
                        device="desktop"
                        src={shot.src}
                        alt={shot.alt}
                        className="rounded-xl border border-white/[0.06]"
                      />
                    </motion.div>
                  ))}
              </div>

              {/* Mobile screenshot — smaller, standalone */}
              {project.screenshots
                .filter((s) => s.device === "mobile")
                .slice(0, 1)
                .map((shot) => (
                  <motion.div
                    key={shot.src}
                    {...revealDelay(0.8)}
                    className="mx-auto mt-6 max-w-[200px]"
                  >
                    <DeviceMockup
                      device="mobile"
                      src={shot.src}
                      alt={shot.alt}
                      className="rounded-xl border border-white/[0.06]"
                    />
                  </motion.div>
                ))}
            </div>

            {/* ── Security Defense Stack — THE hero graphic ──────── */}
            <div className="mb-10">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#4f7df5]">
                Defense in Depth · 6 Layers
              </h4>
              <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                {project.securityLayers.map((layer, i) => (
                  <div
                    key={layer.name}
                    className={`flex items-start gap-4 px-5 py-4 ${
                      i !== project.securityLayers.length - 1
                        ? "border-b border-white/[0.06]"
                        : ""
                    } ${i % 2 === 0 ? "bg-white/[0.015]" : "bg-white/[0.025]"}`}
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[rgba(79,125,245,0.1)] text-xs font-bold text-[#4f7df5]">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-[#f0f0f5]">
                        {layer.name}
                      </span>
                      <p className="mt-0.5 text-[0.8rem] leading-relaxed text-[#55556a]">
                        {layer.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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

            {/* Architecture layers */}
            <div className="mb-10">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#4f7df5]">
                System Architecture
              </h4>
              <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                {project.architecture.layers.map((layer, i) => (
                  <div
                    key={layer.name}
                    className={`grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-[140px_1fr_1fr] sm:gap-4 ${
                      i !== project.architecture.layers.length - 1
                        ? "border-b border-white/[0.06]"
                        : ""
                    } ${i % 2 === 0 ? "bg-white/[0.015]" : "bg-white/[0.025]"}`}
                  >
                    <span className="text-sm font-bold text-[#f0f0f5]">
                      {layer.name}
                    </span>
                    <span className="text-sm font-medium text-[#8888a0]">
                      {layer.tech}
                    </span>
                    <span className="text-[0.8rem] text-[#55556a]">
                      {layer.details}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech stack */}
            <div className="mb-8 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[0.78rem] font-medium text-[#8888a0]"
                >
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
  );
}
