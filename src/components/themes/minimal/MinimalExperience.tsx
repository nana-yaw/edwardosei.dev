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

export function MinimalExperience() {
  return (
    <section id="experience" className="bg-[#fafaf9] py-36 px-6">
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
          Experience
        </motion.h2>

        {/* Rule under heading */}
        <motion.hr
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-6 mb-16 border-t border-[#e5e5e0]"
        />

        {/* Jobs */}
        <div className="flex flex-col">
          {profile.experience.map((job, i) => (
            <motion.div
              key={`${job.company}-${job.period}`}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Thin rule between jobs (not before the first) */}
              {i > 0 && (
                <hr className="my-14 border-t border-[#e5e5e0]" />
              )}

              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-12">
                {/* Left column — period & location */}
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#8a8a9a] leading-relaxed">
                    {job.period}
                  </span>
                  <span className="text-sm text-[#8a8a9a] leading-relaxed">
                    {job.location}
                  </span>
                </div>

                {/* Right column — role, company, achievements */}
                <div>
                  <h3
                    className="text-lg font-semibold text-[#1a1a2e] leading-snug"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {job.role}
                  </h3>
                  <p className="mt-1 text-[15px] text-[#5a5a72]">
                    {job.company}
                  </p>

                  <ul className="mt-6 flex flex-col gap-3">
                    {job.achievements.map((achievement) => (
                      <li
                        key={achievement}
                        className="relative pl-5 text-[15px] leading-loose text-[#3a3a4a]"
                      >
                        <span className="absolute left-0 top-[0.65em] block h-[3px] w-[3px] rounded-full bg-[#c0c0b8]" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
