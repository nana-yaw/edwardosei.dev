"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      ease: "easeOut" as const,
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

/** Generate a deterministic fake commit hash from a string seed */
function fakeHash(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(7, "0").slice(0, 7);
}

export function TerminalExperience() {
  const jobs = profile.experience;

  return (
    <section id="experience" className="px-5 py-20 md:py-28">
      <div className="mx-auto max-w-[800px]">
        {/* Terminal window */}
        <div className="overflow-hidden rounded-lg border border-[#21262d] bg-[#0d1117]">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-[#21262d] bg-[#161b22] px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#f85149]" />
            <span className="h-3 w-3 rounded-full bg-[#d29922]" />
            <span className="h-3 w-3 rounded-full bg-[#3fb950]" />
            <span
              className="ml-3 text-xs text-[#484f58]"
              style={{ fontFamily: "var(--font-fira-code)" }}
            >
              edward@portfolio:~/experience
            </span>
          </div>

          {/* Terminal content */}
          <motion.div
            className="p-5 text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-fira-code)" }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* Command */}
            <motion.div variants={lineVariants} className="mb-4">
              <span className="text-[#3fb950]">$ </span>
              <span className="text-[#c9d1d9]">git log --oneline --all</span>
            </motion.div>

            {jobs.map((job, jobIndex) => {
              const hash = fakeHash(job.company + job.period);
              const isLast = jobIndex === jobs.length - 1;

              return (
                <div key={job.company}>
                  {/* Commit line */}
                  <motion.div variants={lineVariants}>
                    <span className="text-[#d29922]">* </span>
                    <span className="text-[#d29922]">{hash}</span>
                    {job.current && (
                      <span className="text-[#3fb950]">
                        {" "}
                        (HEAD -&gt; main)
                      </span>
                    )}
                    <span className="font-bold text-[#c9d1d9]">
                      {" "}
                      {job.role} @ {job.company}
                    </span>
                  </motion.div>

                  {/* Location and period */}
                  <motion.div variants={lineVariants}>
                    <span className="text-[#d29922]">
                      {isLast ? "  " : "|  "}
                    </span>
                    <span className="text-[#484f58]">
                      {job.location} | {job.period}
                    </span>
                  </motion.div>

                  {/* Spacer */}
                  <motion.div variants={lineVariants}>
                    <span className="text-[#d29922]">
                      {isLast ? "  " : "|"}
                    </span>
                  </motion.div>

                  {/* Achievements */}
                  {job.achievements.map((achievement, i) => (
                    <motion.div key={i} variants={lineVariants}>
                      <span className="text-[#d29922]">
                        {isLast ? "  " : "|  "}
                      </span>
                      <span className="text-[#484f58]">- </span>
                      <span className="text-[#8b949e]">{achievement}</span>
                    </motion.div>
                  ))}

                  {/* Spacer after achievements */}
                  {!isLast && (
                    <motion.div variants={lineVariants} className="mb-1">
                      <span className="text-[#d29922]">|</span>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
