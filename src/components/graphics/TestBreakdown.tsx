"use client";

// ---------------------------------------------------------------------------
// TestBreakdown — horizontal stacked bar chart showing test file distribution
// Communicates engineering priorities: security dominates the test suite.
// ---------------------------------------------------------------------------

type Variant = "cinematic" | "minimal" | "bold" | "terminal";

type ColorKey = "security" | "core" | "feature" | "e2e";

interface BreakdownItem {
  category: string;
  files: number;
  color: ColorKey;
}

interface VariantColors {
  security: string;
  core: string;
  feature: string;
  e2e: string;
  bg: string;
  text: string;
  muted: string;
  barBg: string;
}

const VARIANT_COLORS: Record<Variant, VariantColors> = {
  cinematic: {
    security: "#4f7df5",
    core: "#3fb950",
    feature: "#d29922",
    e2e: "#d2a8ff",
    bg: "transparent",
    text: "#f0f0f5",
    muted: "#55556a",
    barBg: "rgba(255,255,255,0.04)",
  },
  minimal: {
    security: "#1a1a2e",
    core: "#6b7280",
    feature: "#9ca3af",
    e2e: "#c4c4c0",
    bg: "transparent",
    text: "#1a1a2e",
    muted: "#1a1a2e80",
    barBg: "rgba(26,26,46,0.06)",
  },
  bold: {
    security: "#FF6B4A",
    core: "#f5f5f0",
    feature: "#888",
    e2e: "#555",
    bg: "transparent",
    text: "#f5f5f0",
    muted: "#666666",
    barBg: "rgba(255,255,255,0.04)",
  },
  terminal: {
    security: "#f85149",
    core: "#3fb950",
    feature: "#d29922",
    e2e: "#79c0ff",
    bg: "transparent",
    text: "#c9d1d9",
    muted: "#484f58",
    barBg: "rgba(255,255,255,0.04)",
  },
};

interface TestBreakdownProps {
  breakdown: readonly BreakdownItem[];
  variant: Variant;
  className?: string;
}

export function TestBreakdown({
  breakdown,
  variant,
  className,
}: TestBreakdownProps) {
  const colors = VARIANT_COLORS[variant];
  const total = breakdown.reduce((sum, item) => sum + item.files, 0);

  return (
    <div className={className}>
      {/* Stacked bar */}
      <div
        className="flex h-10 overflow-hidden rounded-lg"
        style={{ background: colors.barBg }}
        role="img"
        aria-label={`Test file distribution: ${breakdown.map((b) => `${b.category} ${b.files} files`).join(", ")}`}
      >
        {breakdown.map((item) => {
          const pct = (item.files / total) * 100;
          return (
            <div
              key={item.category}
              className="flex items-center justify-center transition-all duration-300"
              style={{
                width: `${pct}%`,
                background: colors[item.color],
                minWidth: pct > 5 ? undefined : "24px",
              }}
            >
              {pct > 10 && (
                <span
                  className="text-[0.65rem] font-bold"
                  style={{
                    color:
                      variant === "minimal" ? "#fafaf9" : "#0a0a0a",
                  }}
                >
                  {item.files}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {breakdown.map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: colors[item.color] }}
            />
            <span
              className="text-[0.75rem]"
              style={{ color: colors.muted }}
            >
              {item.category}
            </span>
            <span
              className="text-[0.75rem] font-semibold"
              style={{ color: colors.text }}
            >
              {item.files}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
