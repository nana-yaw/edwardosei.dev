"use client";

import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import DeviceMockup from "@/components/DeviceMockup";
import { CodeBlock } from "@/components/graphics/CodeBlock";
import { TestBreakdown } from "@/components/graphics/TestBreakdown";

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

function MinimalShieldRing({
  layers,
  depth,
}: {
  layers: readonly { name: string; detail: string }[];
  depth: number;
}) {
  if (depth >= layers.length) {
    return (
      <div className="mt-3 flex items-center justify-center rounded-md border border-[#1a1a2e]/15 py-4">
        <span
          className="text-[0.7rem] font-medium uppercase tracking-[0.15em] text-[#1a1a2e]/30"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Protected Data
        </span>
      </div>
    );
  }

  const layer = layers[depth];

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 ${depth > 0 ? "mt-2" : ""}`}
      style={{ borderColor: `rgba(26, 26, 46, ${0.06 + depth * 0.025})` }}
    >
      <div
        className="mb-1 flex items-baseline gap-2"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <span className="text-[0.75rem] font-semibold text-[#1a1a2e]/35">
          {String(depth + 1).padStart(2, "0")}
        </span>
        <span className="text-[0.85rem] font-semibold text-[#1a1a2e]">
          {layer.name}
        </span>
        <span className="hidden text-[0.78rem] text-[#1a1a2e]/45 sm:inline">
          · {layer.detail}
        </span>
      </div>
      <MinimalShieldRing layers={layers} depth={depth + 1} />
    </div>
  );
}

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
            communities, with real-time sync, role-based access, and a security
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

        {/* ── Architecture — Visual Diagram ──────────────────── */}
        <motion.div {...revealDelay(0)} className="mb-12">
          <h3
            className="mb-6 text-[1.5rem] text-[#1a1a2e]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Architecture
          </h3>

          <div
            className="relative pl-8"
            role="img"
            aria-label="4-layer system architecture"
          >
            {/* Vertical connecting line */}
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-[#1a1a2e]/12"
              aria-hidden="true"
            />

            {project.architecture.layers.map((layer, i) => {
              const isAuth = layer.name === "Auth & Security";
              return (
                <div
                  key={layer.name}
                  className={`relative ${i > 0 ? "pt-5" : ""}`}
                >
                  {/* Circle marker on the line */}
                  <div
                    className={`absolute h-[14px] w-[14px] rounded-full border-2 ${isAuth ? "border-[#1a1a2e]/50 bg-[#1a1a2e]/10" : "border-[#1a1a2e]/20 bg-[#fafaf9]"}`}
                    style={{ left: "-25px", top: i > 0 ? "22px" : "2px" }}
                    aria-hidden="true"
                  />
                  <p
                    className="text-[0.95rem] leading-relaxed text-[#1a1a2e]/75"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <strong
                      className={`font-semibold ${isAuth ? "text-[#1a1a2e]" : "text-[#1a1a2e]"}`}
                    >
                      {layer.name}
                    </strong>{" "}
                    <span className="text-[#1a1a2e]/45">({layer.tech})</span>
                    <br />
                    <span className="text-[0.88rem] text-[#1a1a2e]/50">
                      {layer.details}
                    </span>
                  </p>
                </div>
              );
            })}
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

        {/* ── Security layers — concentric visual ────────────── */}
        <motion.div {...revealDelay(0)} className="mb-12">
          <h3
            className="mb-6 text-[1.5rem] text-[#1a1a2e]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Security Layers
          </h3>

          <div
            role="img"
            aria-label="6-layer defense in depth security architecture"
          >
            <MinimalShieldRing layers={project.securityLayers} depth={0} />
          </div>
        </motion.div>

        {/* ── Real Code ──────────────────────────────────────── */}
        <motion.div {...revealDelay(0)} className="mb-12">
          <h3
            className="mb-6 text-[1.5rem] text-[#1a1a2e]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Source Code
          </h3>

          <CodeBlock
            code={project.codeSnippet.code}
            filename={project.codeSnippet.filename}
            variant="minimal"
          />
        </motion.div>

        {/* ── Test Distribution ──────────────────────────────── */}
        <motion.div {...revealDelay(0)} className="mb-12">
          <h3
            className="mb-6 text-[1.5rem] text-[#1a1a2e]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Test Suite
          </h3>

          <TestBreakdown
            breakdown={project.testingBreakdown}
            variant="minimal"
          />

          <p
            className="mt-4 text-[0.88rem] text-[#1a1a2e]/50"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {project.stats.tests} tests across {project.stats.testFiles} files.
            Security dominates.
          </p>
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
