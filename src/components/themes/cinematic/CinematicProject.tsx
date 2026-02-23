"use client";

import { projects } from "@/data/projects";
import { motion } from "framer-motion";

const project = projects[0];

const stats = [
  { value: String(project.stats.databaseTables), label: "Tables" },
  { value: String(project.stats.databaseIndexes), label: "Indexes" },
  { value: String(project.stats.tests), label: "Tests" },
  { value: String(project.stats.rbacRoles), label: "RBAC Roles" },
];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const revealWithDelay = (delay: number) => ({
  ...reveal,
  transition: { ...reveal.transition, delay },
});

export function CinematicProject() {
  return (
    <section
      id="project"
      className="relative z-[2] px-6 py-32"
    >
      {/* Subtle radial background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,125,245,0.04)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-[1200px]">
        {/* Section label */}
        <motion.div
          {...revealWithDelay(0)}
          className="mb-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#4f7df5]"
        >
          <span className="inline-block h-px w-6 bg-[#4f7df5]" />
          Featured Project
        </motion.div>

        {/* Section title */}
        <motion.h2
          {...revealWithDelay(0.1)}
          className="mb-12 text-center text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight tracking-tight text-[#f0f0f5]"
        >
          The project I&apos;m most proud of.
        </motion.h2>

        {/* Project card */}
        <motion.div
          {...revealWithDelay(0.2)}
          className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-[#0f0f17] to-[#0f0f17]/80 transition-all duration-500 hover:border-[rgba(79,125,245,0.2)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.4),0_0_60px_rgba(79,125,245,0.05)]"
        >
          {/* Project header */}
          <div className="flex flex-wrap items-start justify-between gap-4 px-8 pt-10 sm:px-12">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(79,125,245,0.15)] bg-[rgba(79,125,245,0.1)] px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-[#4f7df5]">
              Full-Stack PWA
            </span>
          </div>

          {/* Project body */}
          <div className="px-8 pb-10 pt-6 sm:px-12 sm:pb-12">
            {/* Name */}
            <h3 className="mb-2 text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold leading-[1.1] tracking-tight text-[#f0f0f5]">
              {project.name}
            </h3>

            {/* Subtitle */}
            <p className="mb-8 max-w-2xl text-[1.1rem] leading-relaxed text-[#8888a0]">
              {project.longDescription}
            </p>

            {/* Stats row */}
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-5 text-center transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="bg-gradient-to-br from-[#4f7df5] via-[#8b5cf6] to-[#22d3ee] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[0.72rem] font-medium tracking-wide text-[#55556a]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tech stack badges */}
            <div className="mb-8 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-1.5 text-[0.78rem] font-semibold tracking-tight text-[#8888a0] transition-all duration-300 hover:border-[rgba(79,125,245,0.2)] hover:bg-[rgba(79,125,245,0.08)] hover:text-[#4f7df5]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Features grid */}
            <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.features.map((feature) => (
                <div
                  key={feature.name}
                  className="rounded-xl border border-transparent bg-white/[0.015] p-4 transition-all duration-300 hover:border-white/[0.06] hover:bg-white/[0.03]"
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

            {/* Architecture diagram */}
            <div>
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
          </div>

          {/* Project footer */}
          <div className="flex flex-wrap gap-3 px-8 pb-10 sm:px-12">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-2.5 text-sm font-medium text-[#8888a0] transition-all duration-300 hover:border-white/10 hover:text-[#f0f0f5]"
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
