"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const skillGroups = [
  { label: "Languages", items: profile.skills.backend },
  { label: "Frameworks", items: profile.skills.frameworks },
  { label: "Databases", items: profile.skills.databases },
  { label: "Infrastructure", items: profile.skills.cloud },
  { label: "Testing", items: profile.skills.testing },
] as const;

export function MinimalSkills() {
  return (
    <section id="skills" className="bg-[#fafaf9] py-36 px-6">
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
          Skills
        </motion.h2>

        {/* Rule under heading */}
        <motion.hr
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-6 mb-16 border-t border-[#e5e5e0]"
        />

        {/* Skill groups */}
        <div className="flex flex-col gap-12">
          {skillGroups.map((group) => (
            <motion.div
              key={group.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[#8a8a9a]">
                {group.label}
              </p>
              <p className="text-[15px] leading-loose text-[#3a3a4a]">
                {group.items.join(" \u00B7 ")}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
