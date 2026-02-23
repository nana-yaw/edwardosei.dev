"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";
import Avatar from "@/components/Avatar";

const fadeInUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const, delay },
});

export function MinimalHero() {
  return (
    <section className="flex min-h-dvh items-center bg-[#fafaf9] px-6">
      <div className="mx-auto w-full max-w-[720px] py-32">
        {/* Photo */}
        <div className="mb-8">
          <Avatar src="/photos/edward.jpg" size="lg" />
        </div>

        {/* Label */}
        <motion.p
          {...fadeInUp(0.1)}
          className="mb-6 text-[13px] font-medium uppercase tracking-[0.08em] text-[#8a8a9a]"
        >
          {profile.title}
        </motion.p>

        {/* Name */}
        <motion.h1
          {...fadeInUp(0.2)}
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-[clamp(2.5rem,7vw,4.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1a1a2e]"
        >
          {profile.firstName}
          <br />
          {profile.lastName}
        </motion.h1>

        {/* Thin divider */}
        <motion.div
          {...fadeInUp(0.3)}
          className="my-8 h-px w-[60px] bg-[#1a1a2e] opacity-30"
        />

        {/* Tagline */}
        <motion.p
          {...fadeInUp(0.4)}
          className="max-w-lg text-lg font-light leading-[1.8] text-[#5a5a72]"
        >
          {profile.taglines.minimal}
        </motion.p>
      </div>
    </section>
  );
}
