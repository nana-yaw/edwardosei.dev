"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicContact } from "@/components/themes/cinematic";
import { MinimalContact } from "@/components/themes/minimal";
import { BoldContact } from "@/components/themes/bold";
import { TerminalContact } from "@/components/themes/terminal";

export function Contact() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicContact />;
  if (theme === "minimal") return <MinimalContact />;
  if (theme === "bold") return <BoldContact />;
  return <TerminalContact />;
}
