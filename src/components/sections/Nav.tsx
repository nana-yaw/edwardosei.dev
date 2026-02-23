"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicNav } from "@/components/themes/cinematic";

export function Nav() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicNav />;

  // Placeholder nav for other themes
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[var(--bg)]/80 border-b border-[var(--border)]">
      <span className="text-sm font-medium text-[var(--text)]">D.O-N.E</span>
      <span className="text-xs text-[var(--muted)]">{theme} nav</span>
    </nav>
  );
}
