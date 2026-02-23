"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
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

function YamlKey({ children }: { children: React.ReactNode }) {
  return <span className="text-[#3fb950]">{children}</span>;
}

function YamlValue({ children }: { children: React.ReactNode }) {
  return <span className="text-[#c9d1d9]">{children}</span>;
}

function YamlBlock({ text }: { text: string }) {
  // Split long text into ~70 char lines for terminal feel
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current.length + word.length + 1 > 70 && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);

  return (
    <>
      {lines.map((line, i) => (
        <motion.div key={i} variants={lineVariants}>
          <span className="text-[#484f58]">{"  "}</span>
          <YamlValue>{line}</YamlValue>
        </motion.div>
      ))}
    </>
  );
}

export function TerminalStory() {
  return (
    <section id="story" className="px-5 py-20 md:py-28">
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
              edward@portfolio:~/about
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
              <span className="text-[#c9d1d9]">cat about.yaml</span>
            </motion.div>

            {/* name */}
            <motion.div variants={lineVariants}>
              <YamlKey>name: </YamlKey>
              <YamlValue>{profile.name}</YamlValue>
            </motion.div>

            {/* title */}
            <motion.div variants={lineVariants}>
              <YamlKey>title: </YamlKey>
              <YamlValue>{profile.title}</YamlValue>
            </motion.div>

            {/* location */}
            <motion.div variants={lineVariants}>
              <YamlKey>location: </YamlKey>
              <YamlValue>{profile.location}</YamlValue>
            </motion.div>

            {/* education block */}
            <motion.div variants={lineVariants} className="mt-2">
              <YamlKey>education:</YamlKey>
            </motion.div>
            <motion.div variants={lineVariants}>
              <span className="text-[#484f58]">{"  "}</span>
              <YamlKey>degree: </YamlKey>
              <YamlValue>{profile.education.degree}</YamlValue>
            </motion.div>
            <motion.div variants={lineVariants}>
              <span className="text-[#484f58]">{"  "}</span>
              <YamlKey>institution: </YamlKey>
              <YamlValue>{profile.education.institution}</YamlValue>
            </motion.div>
            <motion.div variants={lineVariants}>
              <span className="text-[#484f58]">{"  "}</span>
              <YamlKey>year: </YamlKey>
              <YamlValue>{profile.education.year}</YamlValue>
            </motion.div>

            {/* origin block */}
            <motion.div variants={lineVariants} className="mt-4">
              <YamlKey>origin: </YamlKey>
              <span className="text-[#484f58]">|</span>
            </motion.div>
            {profile.origin.long.map((paragraph, i) => (
              <div key={i} className={i > 0 ? "mt-2" : ""}>
                <YamlBlock text={paragraph} />
              </div>
            ))}

            {/* philosophy block */}
            <motion.div variants={lineVariants} className="mt-4">
              <YamlKey>philosophy: </YamlKey>
              <span className="text-[#484f58]">|</span>
            </motion.div>
            <YamlBlock text="Every project I take on starts with the same question: who does this help?" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
