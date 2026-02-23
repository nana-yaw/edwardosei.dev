"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicHero } from "@/components/themes/cinematic";
import { MinimalHero } from "@/components/themes/minimal";
import { BoldHero } from "@/components/themes/bold";
import { TerminalHero } from "@/components/themes/terminal";

export function Hero() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicHero />;
  if (theme === "minimal") return <MinimalHero />;
  if (theme === "bold") return <BoldHero />;
  return <TerminalHero />;
}
