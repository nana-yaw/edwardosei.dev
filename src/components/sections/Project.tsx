"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicProject } from "@/components/themes/cinematic";
import { MinimalProject } from "@/components/themes/minimal";
import { BoldProject } from "@/components/themes/bold";

export function Project() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicProject />;
  if (theme === "minimal") return <MinimalProject />;
  if (theme === "bold") return <BoldProject />;

  return (
    <section id="project" className="min-h-dvh flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wider text-[var(--muted)]">
          {theme} theme
        </p>
        <h1 className="mt-2 text-4xl font-bold">Featured Project Section</h1>
      </div>
    </section>
  );
}
