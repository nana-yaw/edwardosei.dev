"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicStory } from "@/components/themes/cinematic";

export function Story() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicStory />;

  return (
    <section id="story" className="min-h-dvh flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wider text-[var(--muted)]">
          {theme} theme
        </p>
        <h1 className="mt-2 text-4xl font-bold">Origin Story Section</h1>
      </div>
    </section>
  );
}
