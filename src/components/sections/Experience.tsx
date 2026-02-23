"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicExperience } from "@/components/themes/cinematic";
import { MinimalExperience } from "@/components/themes/minimal";

export function Experience() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicExperience />;
  if (theme === "minimal") return <MinimalExperience />;

  return (
    <section id="experience" className="min-h-dvh flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wider text-[var(--muted)]">
          {theme} theme
        </p>
        <h1 className="mt-2 text-4xl font-bold">Experience Section</h1>
      </div>
    </section>
  );
}
