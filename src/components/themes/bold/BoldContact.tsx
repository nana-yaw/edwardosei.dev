"use client";

import { profile } from "@/data/profile";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
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
    label: profile.email,
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

export function BoldContact() {
  return (
    <section id="contact" className="relative bg-[#0a0a0a] px-6 py-24 md:py-32 overflow-hidden">
      {/* Section number watermark */}
      <div
        className="pointer-events-none absolute right-0 top-12 select-none text-[20rem] font-bold leading-none tracking-tighter md:text-[28rem]"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "rgba(255, 255, 255, 0.03)",
        }}
        aria-hidden="true"
      >
        06
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section label */}
        <motion.p
          {...sectionReveal}
          className="mb-6 text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: "#666666" }}
        >
          <span style={{ color: "#FF6B4A" }}>06</span>
          <span className="mx-2">&mdash;</span>
          Contact
        </motion.p>

        {/* Oversized heading */}
        <motion.h2
          {...sectionReveal}
          className="mb-16 text-5xl font-bold tracking-tight text-[#f5f5f0] md:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Get in touch.
        </motion.h2>

        {/* Contact links — simple, just the links */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
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
                className="flex items-center gap-3 text-sm text-[#f5f5f0]/50 transition-colors duration-200 hover:text-[#f5f5f0]"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </motion.a>
            );
          })}
        </div>

        {/* Footer brand mark */}
        <motion.div
          {...sectionReveal}
          className="mt-32 border-t pt-8"
          style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <p
            className="text-2xl font-bold tracking-tight text-[#f5f5f0]/20"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            D<span style={{ color: "#FF6B4A" }}>.</span>O
            <span style={{ color: "#FF6B4A" }}>-</span>N
            <span style={{ color: "#FF6B4A" }}>.</span>E
          </p>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.25em] text-[#666666]">
            {profile.brandExpansion}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
