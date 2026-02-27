import type { PureThemeId } from "@/lib/themes";
import type { SectionId } from "@/hooks/useActiveSection";

/** Maps each page section to the theme it renders in Story mode. */
export const STORY_SECTION_THEMES: Record<SectionId, PureThemeId> = {
  hero: "cinematic",
  project: "cinematic",
  story: "minimal",
  experience: "bold",
  skills: "cinematic",
  contact: "minimal",
};
