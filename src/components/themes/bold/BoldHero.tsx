"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" as const, delay },
});

export function BoldHero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh items-center overflow-hidden bg-[#0a0a0a] px-6 md:px-10"
    >
      {/* Section number watermark */}
      <div
        className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 select-none text-[20rem] font-bold leading-none text-[#f5f5f0] opacity-[0.03] md:left-10 md:text-[28rem]"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
        aria-hidden="true"
      >
        01
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] py-32">
        <div className="grid items-end gap-12 md:grid-cols-[1fr_auto] md:gap-8 lg:gap-16">
          {/* Left column — Name and identity */}
          <div>
            {/* Title label */}
            <motion.p
              {...fadeIn(0)}
              className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-[#666]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {profile.title}
            </motion.p>

            {/* Name — massive staggered type */}
            <div
              className="mb-8"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              <motion.h1
                {...fadeIn(0.1)}
                className="text-[clamp(4rem,10vw,8rem)] font-bold leading-[0.85] tracking-tight text-[#f5f5f0]"
              >
                {profile.firstName}
              </motion.h1>
              <motion.h1
                {...fadeIn(0.2)}
                className="ml-[5vw] text-[clamp(4rem,10vw,8rem)] font-bold leading-[0.85] tracking-tight text-[#f5f5f0] md:ml-[8vw]"
              >
                {profile.lastName}
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.p
              {...fadeIn(0.35)}
              className="max-w-md text-base leading-relaxed text-[#666] md:text-lg"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {profile.taglines.bold}
            </motion.p>

            {/* EO initials circle */}
            <motion.div
              {...fadeIn(0.45)}
              className="mt-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#FF6B4A]"
            >
              <span
                className="text-sm font-bold tracking-wide text-[#FF6B4A]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                EO
              </span>
            </motion.div>
          </div>

          {/* Right column — Statement stat */}
          <motion.div
            {...fadeIn(0.3)}
            className="flex flex-col items-start md:items-end"
          >
            <p
              className="text-[clamp(5rem,12vw,10rem)] font-bold leading-none tracking-tighter text-[#f5f5f0]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              280<span className="text-[#FF6B4A]">+</span>
            </p>
            <p
              className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-[#666]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              automated tests
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
