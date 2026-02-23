"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { resumeUrl } from "@/data/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function MinimalContact() {
  return (
    <section id="contact" className="bg-[#fafaf9] py-36 px-6">
      <div className="mx-auto max-w-[720px]">
        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
          className="text-4xl text-[#1a1a2e]"
        >
          Get in touch
        </motion.h2>

        {/* Contact links — magazine colophon style */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-14 flex flex-col gap-6"
        >
          <a
            href={`mailto:${profile.email}`}
            className="text-[15px] leading-loose text-[#3a3a4a] underline-offset-4 decoration-[#e5e5e0] hover:underline hover:decoration-[#1a1a2e] transition-colors duration-200"
          >
            {profile.email}
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] leading-loose text-[#3a3a4a] underline-offset-4 decoration-[#e5e5e0] hover:underline hover:decoration-[#1a1a2e] transition-colors duration-200"
          >
            GitHub
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] leading-loose text-[#3a3a4a] underline-offset-4 decoration-[#e5e5e0] hover:underline hover:decoration-[#1a1a2e] transition-colors duration-200"
          >
            LinkedIn
          </a>
        </motion.div>

        {/* Resume download */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10"
        >
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] leading-loose text-[#3a3a4a] underline underline-offset-4 decoration-[#e5e5e0] hover:decoration-[#1a1a2e] transition-colors duration-200"
          >
            Download Resume (PDF)
          </a>
        </motion.div>

        {/* Footer */}
        <motion.footer
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-32"
        >
          <hr className="mb-10 border-t border-[#e5e5e0]" />

          <p
            style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
            className="text-sm italic text-[#8a8a9a]"
          >
            {profile.brand}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-[#8a8a9a]">
            {profile.brandExpansion}
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
