"use client";

import { useState, useEffect } from "react";
import { navItems } from "@/data/navigation";

export function CinematicNav() {
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
      {/* D.O-N.E brand mark */}
      <a
        href="#hero"
        className="text-lg font-light tracking-[0.25em] text-white/90"
      >
        D.O-N.E
      </a>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="text-sm font-medium text-white/40 hover:text-white/90 transition-colors tracking-wide"
            >
              {item.label}
            </a>
          </li>
        ))}
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
                className="text-sm font-medium text-white/50 hover:text-white/90 transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
