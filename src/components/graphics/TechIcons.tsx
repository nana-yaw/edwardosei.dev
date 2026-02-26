// TechIcons — small monochrome brand marks for recognizable technologies

interface TechIconProps {
  name: string;
  color?: string;
  size?: number;
}

const icons: Record<string, (color: string, size: number) => React.ReactNode> = {
  "react": (color, size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke={color} strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke={color} strokeWidth="1.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke={color} strokeWidth="1.5" transform="rotate(120 12 12)" />
    </svg>
  ),
  "next.js": (color, size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="1.5" />
      <path d="M8 8v8l8-8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8v8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "typescript": (color, size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="3" stroke={color} strokeWidth="1.5" />
      <text x="12" y="17" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" fontFamily="monospace">TS</text>
    </svg>
  ),
  "tailwind": (color, size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C13.35 10.82 14.52 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.65 7.18 14.48 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C8.35 16.82 9.52 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.65 13.18 9.48 12 7 12z" />
    </svg>
  ),
  "convex": (color, size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
    </svg>
  ),
  "playwright": (color, size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M8 21h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18v3" stroke={color} strokeWidth="1.5" />
      <path d="M8 10l3 3-3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "vitest": (color, size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12l5 5L20 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "gemini": (color, size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C12 2 12 8.5 8 12c4 3.5 4 10 4 10s0-6.5 4-10c-4-3.5-4-10-4-10z" fill={color} />
      <path d="M12 6c0 0 0 3.25 -2 5 2 1.75 2 5 2 5s0-3.25 2-5c-2-1.75-2-5-2-5z" fill={color} opacity="0.5" />
    </svg>
  ),
  "radix": (color, size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v18M3 12h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" />
    </svg>
  ),
  "webpush": (color, size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

// Normalize tech name to match icon keys
function normalizeKey(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes("react")) return "react";
  if (lower.includes("next")) return "next.js";
  if (lower.includes("typescript")) return "typescript";
  if (lower.includes("tailwind")) return "tailwind";
  if (lower === "convex") return "convex";
  if (lower.includes("playwright")) return "playwright";
  if (lower.includes("vitest")) return "vitest";
  if (lower.includes("gemini")) return "gemini";
  if (lower.includes("radix")) return "radix";
  if (lower.includes("web push")) return "webpush";
  return null;
}

export function TechIcon({ name, color = "currentColor", size = 16 }: TechIconProps) {
  const key = normalizeKey(name);
  if (!key || !icons[key]) return null;
  return <>{icons[key](color, size)}</>;
}

export function hasTechIcon(name: string): boolean {
  return normalizeKey(name) !== null;
}
