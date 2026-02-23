"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicSkills } from "@/components/themes/cinematic";
import { MinimalSkills } from "@/components/themes/minimal";
import { BoldSkills } from "@/components/themes/bold";
import { TerminalSkills } from "@/components/themes/terminal";

export function Skills() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicSkills />;
  if (theme === "minimal") return <MinimalSkills />;
  if (theme === "bold") return <BoldSkills />;
  return <TerminalSkills />;
}
