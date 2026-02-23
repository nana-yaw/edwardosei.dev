"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicHero } from "@/components/themes/cinematic";
import { MinimalHero } from "@/components/themes/minimal";

export function Hero() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicHero />;
  if (theme === "minimal") return <MinimalHero />;

  return (
    <section id="hero" className="min-h-dvh flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wider text-[var(--muted)]">
          {theme} theme
        </p>
        <h1 className="mt-2 text-4xl font-bold">Hero Section</h1>
      </div>
    </section>
  );
}
