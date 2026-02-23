"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicSkills } from "@/components/themes/cinematic";
import { MinimalSkills } from "@/components/themes/minimal";

export function Skills() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicSkills />;
  if (theme === "minimal") return <MinimalSkills />;

  return (
    <section id="skills" className="min-h-dvh flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wider text-[var(--muted)]">
          {theme} theme
        </p>
        <h1 className="mt-2 text-4xl font-bold">Skills Section</h1>
      </div>
    </section>
  );
}
