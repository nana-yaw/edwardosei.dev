"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems, resumeUrl } from "@/data/navigation";

function DevOneBrand() {
  return (
    <a
      href="#hero"
      className="text-xl font-bold tracking-wide text-[#f5f5f0]"
      style={{ fontFamily: "var(--font-space-grotesk)" }}
    >
      dev<span className="text-[#FF6B4A]">ONE</span>
    </a>
  );
}

export function BoldNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] transition-all duration-300 ${
        scrolled ? "border-b border-white/[0.08]" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        {/* Logo — left-aligned */}
        <DevOneBrand />

        {/* Desktop links — pushed far right with generous spacing */}
        <ul className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-xs font-medium uppercase tracking-[0.2em] text-[#666] transition-colors duration-200 hover:text-[#f5f5f0]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium uppercase tracking-[0.2em] text-[#666] transition-colors duration-200 hover:text-[#f5f5f0]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          <motion.span
            animate={
              mobileOpen
                ? { rotate: 45, y: 7, backgroundColor: "#f5f5f0" }
                : { rotate: 0, y: 0, backgroundColor: "#666666" }
            }
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="block h-[2px] w-[22px] rounded-full"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15, ease: "easeOut" as const }}
            className="block h-[2px] w-[22px] rounded-full bg-[#666]"
          />
          <motion.span
            animate={
              mobileOpen
                ? { rotate: -45, y: -7, backgroundColor: "#f5f5f0" }
                : { rotate: 0, y: 0, backgroundColor: "#666666" }
            }
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="block h-[2px] w-[22px] rounded-full"
          />
        </button>
      </div>

      {/* Mobile menu — full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-[#0a0a0a] px-10 md:hidden"
          >
            <ul className="flex flex-col gap-8">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut" as const,
                    delay: index * 0.05,
                  }}
                >
                  <a
                    href={item.href}
                    onClick={closeMobile}
                    className="flex items-center gap-4 text-2xl font-bold text-[#f5f5f0] transition-colors duration-200 hover:text-[#FF6B4A]"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    <span
                      className="text-xs font-medium text-[#FF6B4A]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      0{index + 1}
                    </span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut" as const,
                  delay: navItems.length * 0.05,
                }}
              >
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className="flex items-center gap-4 text-2xl font-bold text-[#f5f5f0] transition-colors duration-200 hover:text-[#FF6B4A]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  <span
                    className="text-xs font-medium text-[#FF6B4A]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    0{navItems.length + 1}
                  </span>
                  Resume
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
