"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";

const reveal = (delay: number = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

export function BoldStory() {
  return (
    <section
      id="story"
      className="relative overflow-hidden bg-[#0a0a0a] px-6 py-28 md:px-10 md:py-40"
    >
      {/* Section number watermark */}
      <div
        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none text-[20rem] font-bold leading-none text-[#f5f5f0] opacity-[0.03] md:right-10 md:text-[28rem]"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
        aria-hidden="true"
      >
        03
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section label */}
        <motion.div {...reveal(0)} className="mb-16">
          <span
            className="text-xs font-medium uppercase tracking-[0.25em] text-[#666]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <span className="text-[#FF6B4A]">03</span>
            <span className="mx-3 text-[#666]">&mdash;</span>
            Origin
          </span>
        </motion.div>

        {/* Content offset to the right for asymmetry */}
        <div className="ml-auto max-w-[720px]">
          {/* Pull quote */}
          <motion.blockquote
            {...reveal(0.1)}
            className="mb-16 border-l-[3px] border-[#FF6B4A] pl-8"
          >
            <p
              className="text-2xl font-bold leading-snug text-[#f5f5f0] md:text-[2.5rem] md:leading-[1.15]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              I chose software development because of what it can do for
              people&apos;s daily lives<span className="text-[#FF6B4A]">.</span>
            </p>
          </motion.blockquote>

          {/* Story paragraphs */}
          {profile.origin.long.map((paragraph, index) => (
            <motion.p
              key={index}
              {...reveal(0.2 + index * 0.1)}
              className="mb-6 text-base leading-[1.8] text-[#999] last:mb-0"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {paragraph}
            </motion.p>
          ))}

          {/* Education */}
          <motion.p
            {...reveal(0.4)}
            className="mt-12 text-sm italic text-[#555]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {profile.education.degree} &mdash; {profile.education.institution}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
