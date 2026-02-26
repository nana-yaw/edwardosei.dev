"use client";

import { useEffect, useState } from "react";

const SECTION_IDS = [
  "hero",
  "project",
  "story",
  "experience",
  "skills",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export function useActiveSection(): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    if (elements.length === 0) return;

    // Track which sections are currently intersecting and their ratios
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

        // Pick the section with the highest intersection ratio.
        // On ties, pick the one that appears first in document order.
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
  }, []);

  return active;
}
