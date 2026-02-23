"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";

const fadeInUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: "easeOut" as const, delay },
});

export function MinimalStory() {
  return (
    <section id="story" className="bg-[#fafaf9] py-36 px-6">
      <div className="mx-auto max-w-[720px]">
        {/* Top rule separator */}
        <motion.div
          {...fadeInUp(0)}
          className="mb-16 h-px w-full bg-[#e5e5e0]"
        />

        {/* Heading */}
        <motion.h2
          {...fadeInUp(0.1)}
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-[clamp(1.75rem,4vw,2.25rem)] font-normal leading-[1.3] tracking-[-0.01em] text-[#1a1a2e]"
        >
          Origin
        </motion.h2>

        {/* Rule after heading */}
        <motion.div
          {...fadeInUp(0.15)}
          className="mt-6 mb-10 h-px w-[60px] bg-[#1a1a2e] opacity-30"
        />

        {/* Story paragraphs */}
        {profile.origin.long.map((paragraph, index) => (
          <motion.p
            key={index}
            {...fadeInUp(0.2 + index * 0.1)}
            className="mb-5 text-[17px] font-light leading-[1.8] text-[#5a5a72] last:mb-0"
          >
            {paragraph}
          </motion.p>
        ))}

        {/* Education */}
        <motion.p
          {...fadeInUp(0.4)}
          className="mt-10 text-sm italic text-[#8a8a9a]"
        >
          {profile.education.degree}, {profile.education.institution}
        </motion.p>
      </div>
    </section>
  );
}
