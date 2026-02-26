export type ThemeId = "cinematic" | "minimal" | "bold" | "terminal" | "story";

/** Pure (non-story) theme IDs */
export type PureThemeId = Exclude<ThemeId, "story">;

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  subtitle: string;
  description: string;
  preview: string;
  font: {
    heading: string;
    body: string;
    mono?: string;
  };
}

export const themes: Record<ThemeId, ThemeDefinition> = {
  cinematic: {
    id: "cinematic",
    name: "Showcase",
    subtitle: "Dark & Cinematic",
    description: "The work speaks through restraint on dark.",
    preview: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
    font: { heading: "Inter", body: "Inter" },
  },
  minimal: {
    id: "minimal",
    name: "Editorial",
    subtitle: "Clean & Minimal",
    description: "Everything intentional, nothing decorative.",
    preview: "linear-gradient(135deg, #fafaf9 0%, #e8e8e4 100%)",
    font: { heading: "Playfair Display", body: "Inter" },
  },
  bold: {
    id: "bold",
    name: "Statement",
    subtitle: "Bold & Creative",
    description: "Bold because the work demands it.",
    preview: "linear-gradient(135deg, #0a0a0a 0%, #7c3aed 100%)",
    font: { heading: "Space Grotesk", body: "Space Grotesk" },
  },
  terminal: {
    id: "terminal",
    name: "Engineer",
    subtitle: "Interactive Terminal",
    description: "Like SSH-ing into a well-documented system.",
    preview: "linear-gradient(135deg, #0a0e17 0%, #1a2332 100%)",
    font: { heading: "Inter", body: "Inter", mono: "Fira Code" },
  },
  story: {
    id: "story",
    name: "Story",
    subtitle: "The Full Experience",
    description: "See all four themes as you scroll.",
    preview:
      "conic-gradient(from 0deg, #0a0a0a, #fafaf9, #7c3aed, #4ade80)",
    font: { heading: "Inter", body: "Inter" },
  },
};

export const themeOrder: ThemeId[] = [
  "minimal",
  "cinematic",
  "bold",
  "terminal",
];
export const defaultTheme: ThemeId = "story";
