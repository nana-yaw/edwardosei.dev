"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
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

function JsonKey({ children }: { children: React.ReactNode }) {
  return <span className="text-[#79c0ff]">{children}</span>;
}

function JsonString({ children }: { children: React.ReactNode }) {
  return <span className="text-[#a5d6ff]">{children}</span>;
}

function JsonBrace({ children }: { children: React.ReactNode }) {
  return <span className="text-[#c9d1d9]">{children}</span>;
}

type SkillCategory = keyof typeof profile.skills;

const skillCategories: SkillCategory[] = [
  "backend",
  "frameworks",
  "databases",
  "cloud",
  "testing",
];

export function TerminalSkills() {
  return (
    <section id="skills" className="px-5 py-20 md:py-28">
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
              edward@portfolio:~/skills
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
              <span className="text-[#c9d1d9]">cat skills.json | jq</span>
            </motion.div>

            {/* Opening brace */}
            <motion.div variants={lineVariants}>
              <JsonBrace>{"{"}</JsonBrace>
            </motion.div>

            {skillCategories.map((category, catIndex) => {
              const skills = profile.skills[category];
              const isLastCategory =
                catIndex === skillCategories.length - 1;

              return (
                <div key={category}>
                  {/* Key */}
                  <motion.div variants={lineVariants}>
                    <span className="text-[#484f58]">{"  "}</span>
                    <JsonKey>&quot;{category}&quot;</JsonKey>
                    <JsonBrace>: [</JsonBrace>
                  </motion.div>

                  {/* Values */}
                  {skills.map((skill, i) => {
                    const isLastSkill = i === skills.length - 1;
                    return (
                      <motion.div key={skill} variants={lineVariants}>
                        <span className="text-[#484f58]">{"    "}</span>
                        <JsonString>&quot;{skill}&quot;</JsonString>
                        {!isLastSkill && (
                          <JsonBrace>,</JsonBrace>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Closing bracket */}
                  <motion.div variants={lineVariants}>
                    <span className="text-[#484f58]">{"  "}</span>
                    <JsonBrace>]{isLastCategory ? "" : ","}</JsonBrace>
                  </motion.div>
                </div>
              );
            })}

            {/* Closing brace */}
            <motion.div variants={lineVariants}>
              <JsonBrace>{"}"}</JsonBrace>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
