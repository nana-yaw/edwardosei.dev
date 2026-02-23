"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const groupReveal = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const categoryLabels: Record<string, string> = {
  backend: "Languages",
  frameworks: "Frameworks",
  databases: "Databases",
  cloud: "Infrastructure",
  testing: "Testing",
};

export function BoldSkills() {
  const groups = Object.entries(profile.skills) as [
    keyof typeof profile.skills,
    readonly string[],
  ][];

  return (
    <section id="skills" className="relative bg-[#0a0a0a] px-6 py-24 md:py-32 overflow-hidden">
      {/* Section number watermark */}
      <div
        className="pointer-events-none absolute left-0 top-12 select-none text-[20rem] font-bold leading-none tracking-tighter md:text-[28rem]"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "rgba(255, 255, 255, 0.03)",
        }}
        aria-hidden="true"
      >
        05
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section label */}
        <motion.p
          {...sectionReveal}
          className="mb-6 text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: "#666666" }}
        >
          <span style={{ color: "#FF6B4A" }}>05</span>
          <span className="mx-2">&mdash;</span>
          Skills
        </motion.p>

        {/* Heading */}
        <motion.h2
          {...sectionReveal}
          className="mb-16 text-3xl font-bold tracking-tight text-[#f5f5f0] md:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Technical toolkit.
        </motion.h2>

        {/* Skill groups — compact grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(([key, skills], index) => (
            <motion.div key={key} {...groupReveal(index * 0.08)}>
              {/* Category heading */}
              <h3
                className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#666666]"
              >
                {categoryLabels[key] ?? key}
              </h3>

              {/* Tags — border only, no fills, no hover effects */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="border px-3 py-1 text-sm text-[#f5f5f0]/50"
                    style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
