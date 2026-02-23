"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";

const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const itemReveal = (delay: number) => ({
  initial: { opacity: 0, x: -12 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export function CinematicExperience() {
  return (
    <section
      id="experience"
      className="bg-[#0a0a0a] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-3xl">
        {/* Section label */}
        <motion.div {...sectionReveal} className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-blue-400/60" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400/80">
            Experience
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          {...sectionReveal}
          className="mb-16 text-3xl font-bold tracking-tight text-white md:text-4xl"
        >
          Where I&apos;ve built things.
        </motion.h2>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-12">
          {/* Vertical line */}
          <div
            className="absolute left-0 top-0 h-full w-px md:left-3"
            style={{
              background:
                "linear-gradient(to bottom, rgba(96,165,250,0.5), transparent)",
            }}
          />

          {profile.experience.map((job, index) => (
            <motion.div
              key={`${job.company}-${job.period}`}
              {...itemReveal(index * 0.15)}
              className="relative mb-16 last:mb-0"
            >
              {/* Timeline dot */}
              <div className="absolute -left-8 top-1.5 h-2.5 w-2.5 rounded-full border border-blue-400/60 bg-[#0a0a0a] md:-left-[1.125rem]" />

              {/* Period */}
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.15em] text-white/30">
                {job.period}
              </p>

              {/* Role */}
              <h3 className="text-xl font-bold text-white md:text-2xl">
                {job.role}
              </h3>

              {/* Company & Location */}
              <p className="mt-1 text-sm text-white/40">
                {job.company} &middot; {job.location}
              </p>

              {/* Achievements */}
              <ul className="mt-4 space-y-2">
                {job.achievements.map((achievement, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-white/50"
                  >
                    <span className="mt-2 block h-1 w-1 flex-shrink-0 rounded-full bg-white/20" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
