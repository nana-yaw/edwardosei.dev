"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicContact } from "@/components/themes/cinematic";
import { MinimalContact } from "@/components/themes/minimal";
import { BoldContact } from "@/components/themes/bold";

export function Contact() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicContact />;
  if (theme === "minimal") return <MinimalContact />;
  if (theme === "bold") return <BoldContact />;

  return (
    <section id="contact" className="min-h-dvh flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wider text-[var(--muted)]">
          {theme} theme
        </p>
        <h1 className="mt-2 text-4xl font-bold">Contact Section</h1>
      </div>
    </section>
  );
}
