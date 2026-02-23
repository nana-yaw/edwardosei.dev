"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";

const fadeInUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

const stats = [
  { value: profile.stats.yearsExperience, label: "Years Experience" },
  { value: profile.stats.countriesWorked, label: "Countries" },
];

export function CinematicStory() {
  return (
    <section
      id="story"
      className="relative bg-[#0a0a0a] px-6 py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section Label */}
        <motion.div
          {...fadeInUp(0)}
          className="mb-12 flex items-center gap-4"
        >
          <div className="h-px w-12 bg-white/20" />
          <span className="text-xs font-medium uppercase tracking-wider text-white/40">
            Origin Story
          </span>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid gap-16 md:grid-cols-[1fr_auto] md:gap-20">
          {/* Left column — text */}
          <div>
            {/* Title */}
            <motion.h2
              {...fadeInUp(0.1)}
              className="mb-10 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              From physics to code.
            </motion.h2>

            {/* Story paragraphs */}
            {profile.origin.long.map((paragraph, index) => (
              <motion.p
                key={index}
                {...fadeInUp(0.2 + index * 0.1)}
                className="mb-6 max-w-2xl text-base leading-relaxed text-white/50 last:mb-0"
              >
                {paragraph}
              </motion.p>
            ))}

            {/* Education */}
            <motion.p
              {...fadeInUp(0.4)}
              className="mt-8 text-sm text-white/25"
            >
              {profile.education.degree} &mdash;{" "}
              {profile.education.institution}, {profile.education.year}
            </motion.p>
          </div>

          {/* Right column — stats */}
          <div className="flex flex-row gap-6 md:flex-col md:justify-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeInUp(0.3 + index * 0.15)}
                className="flex-1 border border-white/10 px-8 py-8 md:flex-initial"
              >
                <p className="text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-white/40">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
