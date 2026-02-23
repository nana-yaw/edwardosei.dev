"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, FileDown } from "lucide-react";
import { resumeUrl } from "@/data/navigation";

const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const linkReveal = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const contactLinks = [
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: "GitHub",
    href: profile.github,
    icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    href: profile.linkedin,
    icon: Linkedin,
    external: true,
  },
];

export function CinematicContact() {
  return (
    <section
      id="contact"
      className="bg-[#0a0a0a] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        {/* Section label */}
        <motion.div
          {...sectionReveal}
          className="mb-4 flex items-center justify-center gap-3"
        >
          <span className="h-px w-8 bg-blue-400/60" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400/80">
            Contact
          </span>
          <span className="h-px w-8 bg-blue-400/60" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          {...sectionReveal}
          className="mb-12 text-3xl font-bold tracking-tight text-white md:text-4xl"
        >
          Get in touch
        </motion.h2>

        {/* Contact links */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {contactLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                {...linkReveal(index * 0.1)}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex w-full items-center justify-center gap-3 border border-white/[0.1] px-8 py-4 text-sm text-white/50 transition-colors duration-200 hover:border-white/30 hover:text-white/80 sm:w-auto"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </motion.a>
            );
          })}
        </div>

        {/* Resume download */}
        <motion.div {...sectionReveal} className="mt-10">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/[0.1] px-6 py-3 text-sm text-white/50 transition-colors duration-200 hover:border-white/30 hover:text-white/80"
          >
            <FileDown className="h-4 w-4" />
            Download Resume
          </a>
        </motion.div>

        {/* Footer brand mark */}
        <motion.div
          {...sectionReveal}
          className="mt-24 border-t border-white/[0.06] pt-8"
        >
          <p className="text-lg font-semibold tracking-tight text-white/20">
            {profile.brand}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/10">
            {profile.brandExpansion}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
