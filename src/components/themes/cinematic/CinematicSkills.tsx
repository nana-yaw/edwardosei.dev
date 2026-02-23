"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";

const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const cardReveal = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const skillGroupLabels: Record<string, string> = {
  backend: "Languages",
  frameworks: "Frameworks",
  databases: "Databases",
  cloud: "Infrastructure",
  testing: "Testing",
};

export function CinematicSkills() {
  const groups = Object.entries(profile.skills) as [
    keyof typeof profile.skills,
    readonly string[],
  ][];

  return (
    <section
      id="skills"
      className="bg-[#0a0a0a] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-4xl">
        {/* Section label */}
        <motion.div {...sectionReveal} className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-blue-400/60" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400/80">
            Skills
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          {...sectionReveal}
          className="mb-16 text-3xl font-bold tracking-tight text-white md:text-4xl"
        >
          Technical toolkit.
        </motion.h2>

        {/* Skills grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(([key, skills], index) => (
            <motion.div
              key={key}
              {...cardReveal(index * 0.1)}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6"
            >
              {/* Group title */}
              <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-blue-400/70">
                {skillGroupLabels[key] ?? key}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/40"
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
