"use client";

import { useEffect, useRef, useState } from "react";

const SECTION_IDS = [
  "hero",
  "project",
  "story",
  "experience",
  "skills",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/**
 * Scroll-spy hook — returns the ID of the section most visible in
 * the viewport. Uses IntersectionObserver with a MutationObserver
 * to re-attach whenever section DOM elements are replaced (e.g.
 * when switching into/out of Story mode swaps components).
 */
export function useActiveSection(): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);
  const [scanKey, setScanKey] = useState(0);
  const prevElementsRef = useRef<string>("");

  // MutationObserver: bump scanKey when section elements change
  useEffect(() => {
    function checkForChanges() {
      const sig = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        // Use element reference identity via a data attribute or tagName+className
        return el ? `${id}:${el.tagName}:${el.className.slice(0, 20)}` : `${id}:null`;
      }).join("|");

      if (sig !== prevElementsRef.current) {
        prevElementsRef.current = sig;
        setScanKey((k) => k + 1);
      }
    }

    const mutation = new MutationObserver(() => {
      // Debounce: wait for React to finish committing
      requestAnimationFrame(checkForChanges);
    });

    mutation.observe(document.body, { childList: true, subtree: true });

    // Initial check
    checkForChanges();

    return () => mutation.disconnect();
  }, []);

  // IntersectionObserver: re-runs whenever scanKey changes (DOM changed)
  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ratios.set(entry.target.id, entry.intersectionRatio);
          } else {
            ratios.delete(entry.target.id);
          }
        }

        let bestId: SectionId | null = null;
        let bestRatio = 0;

        for (const id of SECTION_IDS) {
          const ratio = ratios.get(id);
          if (ratio !== undefined && ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId !== null) {
          setActive(bestId);
        }
      },
      {
        rootMargin: "-20% 0px -20% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [scanKey]);

  return active;
}
