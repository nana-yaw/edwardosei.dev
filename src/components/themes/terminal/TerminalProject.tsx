"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import { motion, AnimatePresence } from "framer-motion";
import DeviceMockup from "@/components/DeviceMockup";
import { CodeBlock } from "@/components/graphics/CodeBlock";
import { TestBreakdown } from "@/components/graphics/TestBreakdown";

const project = projects[0];

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------
const tabs = [
  { id: "package", label: "package.json" },
  { id: "features", label: "FEATURES.md" },
  { id: "architecture", label: "architecture" },
  { id: "security", label: "security" },
  { id: "testing", label: "testing" },
  { id: "code", label: "checkIn.ts" },
  { id: "screenshots", label: "screenshots" },
] as const;

type TabId = (typeof tabs)[number]["id"];

// ---------------------------------------------------------------------------
// Color tokens (matching terminal palette)
// ---------------------------------------------------------------------------
const C = {
  bg: "#0d1117",
  text: "#c9d1d9",
  green: "#3fb950",
  yellow: "#d29922",
  red: "#f85149",
  muted: "#484f58",
  border: "#21262d",
  headerBg: "#161b22",
  keyBlue: "#79c0ff",
  stringBlue: "#a5d6ff",
} as const;

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const panelVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
} as const;

const panelTransition = {
  duration: 0.2,
  ease: "easeOut" as const,
} as const;

// ---------------------------------------------------------------------------
// Helper: map techStack entries to dependency-style key/value pairs
// ---------------------------------------------------------------------------
function techToDependencies(
  stack: readonly string[]
): { name: string; version: string }[] {
  return stack.map((entry) => {
    // entries like "Next.js 16" → { name: "next", version: "16.x" }
    const lower = entry.toLowerCase();

    if (lower.startsWith("next.js"))
      return { name: "next", version: entry.split(" ")[1] + ".x" };
    if (lower.startsWith("react"))
      return { name: "react", version: entry.split(" ")[1] + ".x" };
    if (lower.startsWith("typescript"))
      return { name: "typescript", version: entry.split(" ")[1] + ".x" };
    if (lower === "convex") return { name: "convex", version: "latest" };
    if (lower.startsWith("tailwind"))
      return { name: "tailwindcss", version: entry.split(" ")[2] + ".x" };
    if (lower.startsWith("radix")) return { name: "@radix-ui/react", version: "latest" };
    if (lower.includes("gemini"))
      return { name: "@google/generative-ai", version: "latest" };
    if (lower.includes("web push"))
      return { name: "web-push", version: "latest" };
    if (lower.includes("vitest")) return { name: "vitest", version: "latest" };
    if (lower.includes("playwright"))
      return { name: "playwright", version: "latest" };

    return { name: lower.replace(/\s+/g, "-"), version: "latest" };
  });
}

// ---------------------------------------------------------------------------
// Syntax-colored JSON primitives
// ---------------------------------------------------------------------------
function JsonKey({ children }: { children: string }) {
  return <span style={{ color: C.keyBlue }}>&quot;{children}&quot;</span>;
}

function JsonString({ children }: { children: string }) {
  return <span style={{ color: C.stringBlue }}>&quot;{children}&quot;</span>;
}

function JsonNumber({ children }: { children: number | string }) {
  return <span style={{ color: C.yellow }}>{children}</span>;
}

function Bracket({ children }: { children: React.ReactNode }) {
  return <span style={{ color: C.text }}>{children}</span>;
}

function Indent({
  level = 1,
  children,
}: {
  level?: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ paddingLeft: level * 24 }} className="leading-relaxed">
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab content: package.json
// ---------------------------------------------------------------------------
function PackageTab() {
  const deps = techToDependencies(project.techStack);

  return (
    <div
      className="text-sm leading-7"
      style={{ fontFamily: "var(--font-fira-code)" }}
    >
      <Bracket>{"{"}</Bracket>

      <Indent>
        <JsonKey>name</JsonKey>: <JsonString>{project.slug}</JsonString>,
      </Indent>
      <Indent>
        <JsonKey>description</JsonKey>:{" "}
        <JsonString>{project.subtitle}</JsonString>,
      </Indent>

      {/* blank line */}
      <Indent>
        <JsonKey>stats</JsonKey>: <Bracket>{"{"}</Bracket>
      </Indent>
      <Indent level={2}>
        <JsonKey>tables</JsonKey>: <JsonNumber>{project.stats.databaseTables}</JsonNumber>,
      </Indent>
      <Indent level={2}>
        <JsonKey>indexes</JsonKey>: <JsonNumber>{project.stats.databaseIndexes}</JsonNumber>,
      </Indent>
      <Indent level={2}>
        <JsonKey>tests</JsonKey>: <JsonString>{project.stats.tests}</JsonString>,
      </Indent>
      <Indent level={2}>
        <JsonKey>rbacRoles</JsonKey>: <JsonNumber>{project.stats.rbacRoles}</JsonNumber>,
      </Indent>
      <Indent level={2}>
        <JsonKey>securityLayers</JsonKey>:{" "}
        <JsonNumber>{project.stats.securityLayers}</JsonNumber>
      </Indent>
      <Indent>
        <Bracket>{"}"}</Bracket>,
      </Indent>

      {/* blank line */}
      <Indent>
        <JsonKey>dependencies</JsonKey>: <Bracket>{"{"}</Bracket>
      </Indent>
      {deps.map((dep, i) => (
        <Indent key={dep.name} level={2}>
          <JsonKey>{dep.name}</JsonKey>: <JsonString>{dep.version}</JsonString>
          {i < deps.length - 1 ? "," : ""}
        </Indent>
      ))}
      <Indent>
        <Bracket>{"}"}</Bracket>
      </Indent>

      <Bracket>{"}"}</Bracket>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab content: FEATURES.md
// ---------------------------------------------------------------------------
function FeaturesTab() {
  return (
    <div
      className="space-y-5 text-sm"
      style={{ fontFamily: "var(--font-fira-code)" }}
    >
      {/* File heading */}
      <div>
        <span style={{ color: C.green }} className="font-bold">
          # Features
        </span>
      </div>

      {project.features.map((feat) => (
        <div key={feat.name} className="space-y-1">
          <div style={{ color: C.text }} className="font-bold">
            ## {feat.name}
          </div>
          <div style={{ color: C.muted }} className="pl-1 text-xs leading-5">
            {feat.description}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab content: architecture
// ---------------------------------------------------------------------------
function ArchitectureTab() {
  const layers = project.architecture.layers;

  return (
    <div
      className="text-sm"
      style={{ fontFamily: "var(--font-fira-code)" }}
    >
      {/* Command prompt */}
      <div className="mb-4" style={{ color: C.green }}>
        $ cat architecture.md
      </div>

      {/* ASCII box diagram */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-[340px]">
          {layers.map((layer, i) => {
            const isFirst = i === 0;
            const isLast = i === layers.length - 1;

            return (
              <div key={layer.name}>
                {/* top border for first layer */}
                {isFirst && (
                  <div style={{ color: C.green }} className="whitespace-pre">
                    {"┌─────────────────────────────────────────────┐"}
                  </div>
                )}

                {/* layer content row */}
                <div style={{ color: C.green }} className="whitespace-pre">
                  {"│  "}
                  <span style={{ color: C.text }} className="font-bold">
                    {layer.name.padEnd(12)}
                  </span>
                  <span style={{ color: C.green }}>
                    {layer.tech.padEnd(31)}
                  </span>
                  {"│"}
                </div>

                {/* separator or bottom border */}
                {isLast ? (
                  <div style={{ color: C.green }} className="whitespace-pre">
                    {"└─────────────────────────────────────────────┘"}
                  </div>
                ) : (
                  <div style={{ color: C.green }} className="whitespace-pre">
                    {"├─────────────────────────────────────────────┤"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Layer details below the diagram */}
      <div className="mt-6 space-y-3">
        {layers.map((layer) => (
          <div key={layer.name}>
            <span style={{ color: C.text }} className="font-bold">
              {layer.name}
            </span>
            <span style={{ color: C.muted }}> &mdash; {layer.details}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab content: security (THE STAR)
// ---------------------------------------------------------------------------
function SecurityTab() {
  return (
    <div
      className="text-sm"
      style={{ fontFamily: "var(--font-fira-code)" }}
    >
      {/* Command prompt */}
      <div className="mb-4" style={{ color: C.green }}>
        $ ./run-security-audit.sh
      </div>

      {/* Audit results */}
      <div className="space-y-2">
        {project.securityAudit.map((item) => (
          <div key={item.check} className="flex flex-wrap gap-x-2">
            <span style={{ color: C.green }} className="font-bold shrink-0">
              [PASS]
            </span>
            <span style={{ color: C.text }} className="shrink-0">
              {item.check}
            </span>
            <span style={{ color: C.muted }}>
              &mdash; {item.detail}
            </span>
          </div>
        ))}
      </div>

      {/* Summary line */}
      <div className="mt-6" style={{ color: C.green }}>
        <span className="font-bold">&#10003;</span> All{" "}
        {project.securityAudit.length} checks passed
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab content: testing
// ---------------------------------------------------------------------------
function TestingTab() {
  return (
    <div
      className="text-sm"
      style={{ fontFamily: "var(--font-fira-code)" }}
    >
      {/* Command prompt */}
      <div className="mb-4" style={{ color: C.green }}>
        $ npm run test -- --summary
      </div>

      {/* Unit tests */}
      <div className="mb-4">
        <div style={{ color: C.text }} className="font-bold">
          Unit &amp; Component Tests (Vitest)
        </div>
        <div style={{ color: C.muted }} className="pl-4 text-xs leading-6">
          {project.testing.unit.replace("Vitest, ", "")}
        </div>
      </div>

      {/* E2E tests */}
      <div className="mb-4">
        <div style={{ color: C.text }} className="font-bold">
          E2E Tests (Python Playwright)
        </div>
        <div style={{ color: C.muted }} className="pl-4 text-xs leading-6">
          {project.testing.e2e.replace("Python Playwright, ", "")}
        </div>
      </div>

      {/* Mutation tests */}
      <div className="mb-4">
        <div style={{ color: C.text }} className="font-bold">
          Mutation Testing (Stryker)
        </div>
        <div style={{ color: C.muted }} className="pl-4 text-xs leading-6">
          {project.testing.mutation.replace("Stryker, ", "")}
        </div>
      </div>

      {/* Security tests */}
      <div className="mb-4">
        <div style={{ color: C.text }} className="font-bold">
          Security Testing
        </div>
        <div style={{ color: C.muted }} className="pl-4 text-xs leading-6">
          {project.testing.security}
        </div>
      </div>

      {/* Divider */}
      <div style={{ color: C.muted }} className="my-4">
        {"───────────────────────────────────────"}
      </div>

      {/* Summary */}
      <div style={{ color: C.green }} className="font-bold">
        Total: {project.stats.tests} tests across {project.stats.testFiles}{" "}
        files
      </div>

      {/* Visual breakdown */}
      <div className="mt-6">
        <div className="mb-3 text-sm font-bold" style={{ color: C.text }}>
          File Distribution
        </div>
        <TestBreakdown
          breakdown={project.testingBreakdown}
          variant="terminal"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab content: screenshots
// ---------------------------------------------------------------------------
function ScreenshotsTab() {
  return (
    <div
      className="text-sm"
      style={{ fontFamily: "var(--font-fira-code)" }}
    >
      {/* Command prompt */}
      <div className="mb-4" style={{ color: C.green }}>
        $ ls ./screenshots/
      </div>

      {/* Screenshot grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {project.screenshots.map((shot) => (
          <div key={shot.src}>
            <DeviceMockup
              device={shot.device}
              src={shot.src}
              alt={shot.alt}
            />
            <div
              className="mt-2 truncate text-xs"
              style={{ color: C.muted }}
            >
              {shot.src.split("/").pop()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab content: checkIn.ts (code snippet)
// ---------------------------------------------------------------------------
function CodeTab() {
  return (
    <div>
      {/* Command prompt */}
      <div className="mb-4 text-sm" style={{ color: C.green, fontFamily: "var(--font-fira-code)" }}>
        $ cat src/attendance/checkIn.ts
      </div>
      <CodeBlock
        code={project.codeSnippet.code}
        filename={project.codeSnippet.filename}
        variant="terminal"
        className="border-0 rounded-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab content router
// ---------------------------------------------------------------------------
function TabContent({ tabId }: { tabId: TabId }) {
  switch (tabId) {
    case "package":
      return <PackageTab />;
    case "features":
      return <FeaturesTab />;
    case "architecture":
      return <ArchitectureTab />;
    case "security":
      return <SecurityTab />;
    case "testing":
      return <TestingTab />;
    case "code":
      return <CodeTab />;
    case "screenshots":
      return <ScreenshotsTab />;
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function TerminalProject() {
  const [activeTab, setActiveTab] = useState<TabId>("package");

  return (
    <section
      id="project"
      className="px-5 py-20 md:py-28"
      style={{ backgroundColor: C.bg }}
    >
      {/* Section label */}
      <div className="mx-auto max-w-[900px]">
        <div
          className="mb-2 text-xs"
          style={{ color: C.muted, fontFamily: "var(--font-fira-code)" }}
        >
          {"// ls ~/projects"}
        </div>
        <h2
          className="mb-10 text-2xl font-bold md:text-3xl"
          style={{ color: C.text, fontFamily: "var(--font-fira-code)" }}
        >
          projects
          <span style={{ color: C.green }}>.</span>
          explorer
        </h2>

        {/* ─── Terminal window ─── */}
        <div
          className="overflow-hidden rounded-lg border"
          style={{ borderColor: C.border, backgroundColor: C.bg }}
        >
          {/* Header bar with traffic lights + title */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ backgroundColor: C.headerBg }}
          >
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: C.red }}
              aria-hidden="true"
            />
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: C.yellow }}
              aria-hidden="true"
            />
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: C.green }}
              aria-hidden="true"
            />
            <span
              className="ml-2 text-xs"
              style={{
                color: C.muted,
                fontFamily: "var(--font-fira-code)",
              }}
            >
              {project.slug}
            </span>
          </div>

          {/* Tab bar */}
          <div
            className="flex overflow-x-auto border-b scrollbar-none"
            style={{
              borderColor: C.border,
              backgroundColor: C.headerBg,
            }}
            role="tablist"
            aria-label="Project explorer tabs"
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative shrink-0 cursor-pointer px-4 py-2.5 text-xs transition-colors duration-150"
                  style={{
                    fontFamily: "var(--font-fira-code)",
                    color: isActive ? C.text : C.muted,
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.color = C.text;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.color = C.muted;
                  }}
                >
                  {tab.label}
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="terminal-tab-indicator"
                      className="absolute right-0 bottom-0 left-0 h-[2px]"
                      style={{ backgroundColor: C.green }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content area */}
          <div
            className="relative min-h-[360px] p-5 md:p-6"
            style={{ backgroundColor: C.bg }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={activeTab}
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={panelTransition}
              >
                <TabContent tabId={activeTab} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── GitHub link below the terminal ─── */}
        <div className="mt-6">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm transition-colors duration-150"
            style={{
              color: C.green,
              fontFamily: "var(--font-fira-code)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            <span style={{ color: C.muted }}>$</span> open{" "}
            {project.githubUrl}
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
