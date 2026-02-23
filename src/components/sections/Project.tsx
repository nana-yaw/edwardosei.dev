"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicProject } from "@/components/themes/cinematic";
import { MinimalProject } from "@/components/themes/minimal";
import { BoldProject } from "@/components/themes/bold";
import { TerminalProject } from "@/components/themes/terminal";

export function Project() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicProject />;
  if (theme === "minimal") return <MinimalProject />;
  if (theme === "bold") return <BoldProject />;
  return <TerminalProject />;
}
