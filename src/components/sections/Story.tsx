"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicStory } from "@/components/themes/cinematic";
import { MinimalStory } from "@/components/themes/minimal";
import { BoldStory } from "@/components/themes/bold";
import { TerminalStory } from "@/components/themes/terminal";

export function Story() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicStory />;
  if (theme === "minimal") return <MinimalStory />;
  if (theme === "bold") return <BoldStory />;
  return <TerminalStory />;
}
