"use client";

import { useState, useEffect } from "react";
import { navItems, resumeUrl } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";

export function MinimalNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-[#fafaf9]/85 transition-[border-color] duration-300 ${
        scrolled ? "border-b border-[#e5e5e0]" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[720px] items-center justify-between px-6 py-5">
        {/* devONE logo — Playfair Display italic */}
        <a
          href="#hero"
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-lg italic tracking-tight text-[#1a1a2e]"
        >
          devONE
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              {(() => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <a
                    href={item.href}
                    className={`group relative text-[13px] font-medium transition-colors duration-250 ${
                      isActive ? "text-[#1a1a2e]" : "text-[#5a5a72] hover:text-[#1a1a2e]"
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-px bg-[#1a1a2e] transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                  </a>
                );
              })()}
            </li>
          ))}
          <li>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-[13px] font-medium text-[#5a5a72] transition-colors duration-250 hover:text-[#1a1a2e]"
            >
              Resume
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#1a1a2e] transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex md:hidden flex-col gap-[5px] p-1"
          aria-label="Toggle navigation"
        >
          <span
            className={`block h-px w-[20px] bg-[#1a1a2e] transition-transform duration-200 ${
              mobileOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-[20px] bg-[#1a1a2e] transition-opacity duration-200 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-[20px] bg-[#1a1a2e] transition-transform duration-200 ${
              mobileOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#e5e5e0] bg-[#fafaf9]/95 px-6 py-6 md:hidden">
          <ul className="flex flex-col gap-5">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-[13px] font-medium transition-colors ${
                    activeSection === item.href.slice(1)
                      ? "text-[#1a1a2e]"
                      : "text-[#5a5a72] hover:text-[#1a1a2e]"
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
                className="text-[13px] font-medium text-[#5a5a72] transition-colors hover:text-[#1a1a2e]"
              >
                Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
