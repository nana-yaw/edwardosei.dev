"use client";

import { useTheme } from "@/hooks/useTheme";
import { CinematicNav } from "@/components/themes/cinematic";
import { MinimalNav } from "@/components/themes/minimal";
import { BoldNav } from "@/components/themes/bold";
import { TerminalNav } from "@/components/themes/terminal";

export function Nav() {
  const { theme } = useTheme();

  if (theme === "cinematic") return <CinematicNav />;
  if (theme === "minimal") return <MinimalNav />;
  if (theme === "bold") return <BoldNav />;
  return <TerminalNav />;
}
