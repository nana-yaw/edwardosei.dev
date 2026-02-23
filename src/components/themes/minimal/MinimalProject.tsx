"use client";

import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import DeviceMockup from "@/components/DeviceMockup";

const project = projects[0];

const reveal = {
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const revealDelay = (delay: number) => ({
  ...reveal,
  transition: { ...reveal.transition, delay },
});

export function MinimalProject() {
  return (
    <section id="project" className="bg-[#fafaf9] px-6 py-28 md:py-36">
      <div className="mx-auto max-w-[720px]">
        {/* ── Section heading ──────────────────────────────── */}
        <motion.p
          {...revealDelay(0)}
          className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#1a1a2e]/40"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Featured Work
        </motion.p>

        <motion.h2
          {...revealDelay(0.1)}
          className="mb-3 text-[clamp(2rem,4vw,3rem)] leading-[1.15] tracking-tight text-[#1a1a2e]"
          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
        >
          {project.name}
        </motion.h2>

        {/* ── Subtitle ─────────────────────────────────────── */}
        <motion.p
          {...revealDelay(0.15)}
          className="mb-8 text-lg leading-relaxed text-[#1a1a2e]/55"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {project.subtitle}
        </motion.p>

        {/* ── Thin rule ────────────────────────────────────── */}
        <motion.hr
          {...revealDelay(0.2)}
          className="mb-10 border-t border-[#1a1a2e]/10"
        />

        {/* ── The problem ──────────────────────────────────── */}
        <motion.div {...revealDelay(0.25)}>
          <p
            className="mb-10 text-[1.05rem] leading-[1.85] text-[#1a1a2e]/75"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            My church community needed better tools for pastoral care. What
            started as a simple idea became a production system managing 5+
            communities — with real-time sync, role-based access, and a security
            architecture I&apos;m genuinely proud of.
          </p>
        </motion.div>

        {/* ── Stats inline ─────────────────────────────────── */}
        <motion.div {...revealDelay(0.3)}>
          <p
            className="mb-10 text-[1.05rem] leading-[1.85] text-[#1a1a2e]/75"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <strong className="font-semibold text-[#1a1a2e]">
              {project.stats.databaseTables} tables.
            </strong>{" "}
            <strong className="font-semibold text-[#1a1a2e]">
              {project.stats.databaseIndexes} indexes.
            </strong>{" "}
            <strong className="font-semibold text-[#1a1a2e]">
              {project.stats.tests} tests.
            </strong>{" "}
            <strong className="font-semibold text-[#1a1a2e]">
              {project.stats.rbacRoles} RBAC roles.
            </strong>
          </p>
        </motion.div>

        {/* ── Screenshots — editorial moment ─────────────────── */}
        <motion.hr
          {...revealDelay(0.35)}
          className="mb-10 border-t border-[#1a1a2e]/10"
        />

        <motion.div {...revealDelay(0.4)} className="mb-10">
          {/* Hero screenshot — dashboard dark (the most impressive) */}
          <DeviceMockup
            device="desktop"
            src="/screenshots/dashboard-dark.png"
            alt="Dashboard in dark mode with weekly care trend chart"
            className="shadow-sm"
          />

          {/* 2-up row: one desktop + one mobile */}
          <div className="mt-6 flex items-end gap-6">
            <div className="flex-1">
              <DeviceMockup
                device="desktop"
                src="/screenshots/members-dark.png"
                alt="Members management table with filters and stats"
                className="shadow-sm"
              />
            </div>
            <div className="w-[120px] shrink-0 sm:w-[140px]">
              <DeviceMockup
                device="mobile"
                src="/screenshots/mobile-landing.png"
                alt="Mobile responsive landing page"
                className="shadow-sm"
              />
            </div>
          </div>
        </motion.div>

        <motion.hr
          {...revealDelay(0.45)}
          className="mb-10 border-t border-[#1a1a2e]/10"
        />

        {/* ── Architecture ─────────────────────────────────── */}
        <motion.div {...revealDelay(0)} className="mb-12">
          <h3
            className="mb-6 text-[1.5rem] text-[#1a1a2e]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Architecture
          </h3>

          <div className="border-t border-[#1a1a2e]/10">
            {project.architecture.layers.map((layer) => (
              <div
                key={layer.name}
                className="border-b border-[#1a1a2e]/10 py-4"
              >
                <p
                  className="text-[0.95rem] leading-relaxed text-[#1a1a2e]/75"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <strong className="font-semibold text-[#1a1a2e]">
                    {layer.name}
                  </strong>{" "}
                  — {layer.tech}. {layer.details}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Security narrative pull-quote ─────────────────── */}
        <motion.div {...revealDelay(0)} className="mb-12">
          <blockquote
            className="border-l-[3px] border-[#1a1a2e]/25 py-1 pl-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <p className="text-[1.1rem] leading-[1.85] italic text-[#1a1a2e]/80">
              {project.securityNarrative}
            </p>
          </blockquote>
        </motion.div>

        {/* ── Security layers — numbered list ──────────────── */}
        <motion.div {...revealDelay(0)} className="mb-12">
          <h3
            className="mb-6 text-[1.5rem] text-[#1a1a2e]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Security Layers
          </h3>

          <ol
            className="space-y-3"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {project.securityLayers.map((layer, i) => (
              <li
                key={layer.name}
                className="text-[0.95rem] leading-relaxed text-[#1a1a2e]/75"
              >
                <span className="mr-2 font-semibold text-[#1a1a2e]/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong className="font-semibold text-[#1a1a2e]">
                  {layer.name}
                </strong>{" "}
                — {layer.detail}
              </li>
            ))}
          </ol>
        </motion.div>

        {/* ── Tech stack — inline with middots ─────────────── */}
        <motion.div {...revealDelay(0)} className="mb-12">
          <p
            className="text-sm leading-loose text-[#1a1a2e]/40"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {project.techStack.map((tech, i) => (
              <span key={tech}>
                {tech}
                {i < project.techStack.length - 1 && (
                  <span className="mx-2">&middot;</span>
                )}
              </span>
            ))}
          </p>
        </motion.div>

        {/* ── Features — simple text blocks ────────────────── */}
        <motion.div {...revealDelay(0)}>
          <h3
            className="mb-8 text-[1.5rem] text-[#1a1a2e]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Features
          </h3>

          <div
            className="space-y-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {project.features.map((feature) => (
              <div key={feature.name}>
                <p className="mb-1 text-[0.95rem] font-semibold text-[#1a1a2e]">
                  {feature.name}
                </p>
                <p className="text-[0.9rem] leading-[1.8] text-[#1a1a2e]/60">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
