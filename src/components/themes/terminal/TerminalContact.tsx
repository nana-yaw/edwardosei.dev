"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { resumeUrl } from "@/data/navigation";

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

function ContactLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#79c0ff] underline-offset-2 transition-colors duration-150 hover:underline hover:brightness-125"
    >
      {children}
    </a>
  );
}

export function TerminalContact() {
  // Strip protocol for display
  const githubDisplay = profile.github.replace("https://", "");
  const linkedinDisplay = profile.linkedin.replace("https://", "");

  return (
    <section id="contact" className="px-5 py-20 md:py-28">
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
              edward@portfolio:~/contact
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
            {/* Connect command */}
            <motion.div variants={lineVariants} className="mb-4">
              <span className="text-[#3fb950]">$ </span>
              <span className="text-[#c9d1d9]">connect --with edward</span>
            </motion.div>

            {/* Contact info */}
            <motion.div variants={lineVariants}>
              <span className="text-[#3fb950]">Email:    </span>
              <ContactLink href={`mailto:${profile.email}`}>
                {profile.email}
              </ContactLink>
            </motion.div>
            <motion.div variants={lineVariants}>
              <span className="text-[#3fb950]">GitHub:   </span>
              <ContactLink href={profile.github}>
                {githubDisplay}
              </ContactLink>
            </motion.div>
            <motion.div variants={lineVariants}>
              <span className="text-[#3fb950]">LinkedIn: </span>
              <ContactLink href={profile.linkedin}>
                {linkedinDisplay}
              </ContactLink>
            </motion.div>

            {/* Resume download */}
            <motion.div variants={lineVariants} className="mt-6">
              <span className="text-[#3fb950]">$ </span>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#79c0ff] underline-offset-2 transition-colors duration-150 hover:underline hover:brightness-125"
              >
                open ./resume.pdf
              </a>
            </motion.div>

            {/* Echo command */}
            <motion.div variants={lineVariants} className="mt-6">
              <span className="text-[#3fb950]">$ </span>
              <span className="text-[#c9d1d9]">
                echo &quot;Thanks for visiting&quot;
              </span>
            </motion.div>
            <motion.div variants={lineVariants}>
              <span className="text-[#c9d1d9]">Thanks for visiting</span>
            </motion.div>

            {/* Exit command */}
            <motion.div variants={lineVariants} className="mt-6">
              <span className="text-[#3fb950]">$ </span>
              <span className="text-[#c9d1d9]">exit 0</span>
            </motion.div>
            <motion.div variants={lineVariants}>
              <span className="text-[#484f58]">{"// "}</span>
              <span className="text-[#3fb950]">{profile.brand}</span>
              <span className="text-[#484f58]">
                {" // "}{profile.brandExpansion}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer below terminal */}
        <motion.p
          className="mt-6 text-center text-xs text-[#484f58]"
          style={{ fontFamily: "var(--font-fira-code)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" as const }}
        >
          {"exit 0 // "}{profile.brand}{" // "}{profile.brandExpansion}
        </motion.p>
      </div>
    </section>
  );
}
