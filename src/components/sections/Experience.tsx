"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicExperience } from "@/components/themes/cinematic";
import { MinimalExperience } from "@/components/themes/minimal";
import { BoldExperience } from "@/components/themes/bold";
import { TerminalExperience } from "@/components/themes/terminal";

export function Experience() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicExperience />;
  if (theme === "minimal") return <MinimalExperience />;
  if (theme === "bold") return <BoldExperience />;
  return <TerminalExperience />;
}
