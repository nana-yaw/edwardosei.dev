"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";
import Avatar from "@/components/Avatar";

const fadeInUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

export function CinematicHero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center justify-center bg-[#0a0a0a] px-6"
    >
      <div className="flex max-w-3xl flex-col items-center text-center">
        {/* Photo */}
        <div className="mb-8">
          <Avatar src="/photos/edward.jpg" size="lg" />
        </div>

        {/* Name */}
        <motion.h1
          {...fadeInUp(0.1)}
          className="font-[Inter] text-[clamp(3rem,6vw,6rem)] font-bold leading-none tracking-tight text-white"
        >
          {profile.name}
        </motion.h1>

        {/* Title */}
        <motion.p
          {...fadeInUp(0.2)}
          className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-white/40"
        >
          {profile.title}
        </motion.p>

        {/* Tagline */}
        <motion.p
          {...fadeInUp(0.3)}
          className="mt-6 max-w-lg text-lg font-light leading-relaxed text-white/50"
        >
          {profile.taglines.cinematic}
        </motion.p>

        {/* Links */}
        <motion.div
          {...fadeInUp(0.4)}
          className="mt-10 flex gap-4"
        >
          <a
            href="#project"
            className="border border-white/20 px-6 py-3 text-sm text-white/70 transition-colors duration-200 hover:border-white hover:text-white"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="border border-white/20 px-6 py-3 text-sm text-white/70 transition-colors duration-200 hover:border-white hover:text-white"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
