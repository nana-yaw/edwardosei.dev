"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const jobReveal = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export function BoldExperience() {
  return (
    <section id="experience" className="relative bg-[#0a0a0a] px-4 py-12 sm:px-6 sm:py-24 md:py-32 overflow-hidden">
      {/* Section number watermark */}
      <div
        className="pointer-events-none absolute right-0 top-12 select-none text-[10rem] font-bold leading-none tracking-tighter sm:text-[20rem] md:text-[28rem]"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "rgba(255, 255, 255, 0.03)",
        }}
        aria-hidden="true"
      >
        04
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Asymmetric: content offset to the right */}
        <div className="md:ml-[16%] lg:ml-[20%]">
          {/* Section label */}
          <motion.p
            {...sectionReveal}
            className="mb-6 text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: "#666666" }}
          >
            <span style={{ color: "#FF6B4A" }}>04</span>
            <span className="mx-2">&mdash;</span>
            Experience
          </motion.p>

          {/* Jobs */}
          <div className="space-y-12 sm:space-y-20">
            {profile.experience.map((job, index) => (
              <motion.div
                key={`${job.company}-${job.period}`}
                {...jobReveal(index * 0.15)}
              >
                {/* Company name — oversized */}
                <div className="flex items-baseline gap-4">
                  <h3
                    className="text-2xl font-bold tracking-tight text-[#f5f5f0] sm:text-4xl md:text-5xl lg:text-6xl"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {job.company}
                  </h3>
                  {job.current && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                      className="flex flex-shrink-0 items-center gap-1.5 border border-[#FF6B4A]/30 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[#FF6B4A]"
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B4A] opacity-50" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />
                      </span>
                      Current
                    </motion.span>
                  )}
                </div>

                {/* Role + period */}
                <p className="mt-3 text-sm text-[#666666]">
                  {job.role} &middot; {job.location}
                  <span className="mx-2">/</span>
                  {job.period}
                </p>

                {/* Achievements */}
                <ul className="mt-6 space-y-3 md:max-w-2xl">
                  {job.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm leading-relaxed text-[#f5f5f0]/50"
                    >
                      <span
                        className="mt-[7px] block h-1.5 w-1.5 flex-shrink-0"
                        style={{ backgroundColor: "#FF6B4A" }}
                        aria-hidden="true"
                      />
                      {achievement}
                    </li>
                  ))}
                </ul>

                {/* Separator between jobs */}
                {index < profile.experience.length - 1 && (
                  <div
                    className="mt-20 h-px w-16"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
