"use client";

import { useTheme } from "@/hooks/useTheme";

export function Story() {
  const { theme } = useTheme();

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
