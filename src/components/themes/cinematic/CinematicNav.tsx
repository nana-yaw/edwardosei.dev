"use client";

import { useState, useEffect } from "react";
import { navItems, resumeUrl } from "@/data/navigation";
import type { SectionId } from "@/hooks/useActiveSection";

export function CinematicNav({ activeSection }: { activeSection: SectionId | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[#050505]/85 border-b border-white/[0.06]"
          : "py-5 bg-transparent"
      }`}
    >
      {/* devONE brand mark */}
      <a
        href="#hero"
        className="text-lg font-light tracking-[0.15em] text-white/90"
      >
        devONE
      </a>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={`text-sm font-medium transition-colors tracking-wide ${
                activeSection === item.href.slice(1)
                  ? "text-white/90"
                  : "text-white/40 hover:text-white/90"
              }`}
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
            className="text-sm font-medium text-white/40 hover:text-white/90 transition-colors tracking-wide"
          >
            Resume
          </a>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="flex md:hidden flex-col gap-[5px] p-1"
        aria-label="Toggle navigation"
      >
        <span className="block w-[22px] h-[2px] bg-white/40 rounded-full" />
        <span className="block w-[22px] h-[2px] bg-white/40 rounded-full" />
        <span className="block w-[22px] h-[2px] bg-white/40 rounded-full" />
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <ul className="absolute top-full left-0 right-0 flex flex-col gap-4 px-6 py-6 bg-[#050505]/95 border-b border-white/[0.06] md:hidden">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === item.href.slice(1)
                    ? "text-white/90"
                    : "text-white/50 hover:text-white/90"
                }`}
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
              className="text-sm font-medium text-white/50 hover:text-white/90 transition-colors"
            >
              Resume
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}
