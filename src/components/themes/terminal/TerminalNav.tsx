"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems, resumeUrl } from "@/data/navigation";

export function TerminalNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const handleNavClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-[#161b22] transition-[border-color] duration-200 ${
        scrolled ? "border-b border-[#21262d]" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3">
        {/* Logo — terminal prompt style */}
        <a
          href="#hero"
          className="flex items-center gap-0 text-sm"
          style={{ fontFamily: "var(--font-fira-code)" }}
        >
          <span className="text-[#484f58]">[</span>
          <span className="text-[#3fb950]">devONE</span>
          <span className="text-[#484f58]">]</span>
          <span className="ml-1.5 text-[#484f58]">~$</span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-xs text-[#484f58] transition-colors duration-150 hover:text-[#c9d1d9]"
                style={{ fontFamily: "var(--font-fira-code)" }}
              >
                ./{item.label.toLowerCase()}
              </a>
            </li>
          ))}
          <li>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#484f58] transition-colors duration-150 hover:text-[#c9d1d9]"
              style={{ fontFamily: "var(--font-fira-code)" }}
            >
              ./resume.pdf
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          <motion.span
            animate={
              mobileOpen
                ? { rotate: 45, y: 7, backgroundColor: "#c9d1d9" }
                : { rotate: 0, y: 0, backgroundColor: "#484f58" }
            }
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="block h-[2px] w-5 rounded-full"
          />
          <motion.span
            animate={
              mobileOpen
                ? { opacity: 0, scaleX: 0 }
                : { opacity: 1, scaleX: 1 }
            }
            transition={{ duration: 0.15, ease: "easeOut" as const }}
            className="block h-[2px] w-5 rounded-full bg-[#484f58]"
          />
          <motion.span
            animate={
              mobileOpen
                ? { rotate: -45, y: -7, backgroundColor: "#c9d1d9" }
                : { rotate: 0, y: 0, backgroundColor: "#484f58" }
            }
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="block h-[2px] w-5 rounded-full"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="overflow-hidden border-t border-[#21262d] bg-[#161b22] md:hidden"
          >
            {navItems.map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut" as const,
                  delay: i * 0.04,
                }}
              >
                <a
                  href={item.href}
                  onClick={handleNavClick}
                  className="block px-5 py-3 text-xs text-[#484f58] transition-colors duration-150 hover:bg-[#0d1117] hover:text-[#c9d1d9]"
                  style={{ fontFamily: "var(--font-fira-code)" }}
                >
                  <span className="text-[#3fb950]">$</span>{" "}
                  ./{item.label.toLowerCase()}
                </a>
              </motion.li>
            ))}
            <motion.li
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.15,
                ease: "easeOut" as const,
                delay: navItems.length * 0.04,
              }}
            >
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavClick}
                className="block px-5 py-3 text-xs text-[#484f58] transition-colors duration-150 hover:bg-[#0d1117] hover:text-[#c9d1d9]"
                style={{ fontFamily: "var(--font-fira-code)" }}
              >
                <span className="text-[#3fb950]">$</span>{" "}
                ./resume.pdf
              </a>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
