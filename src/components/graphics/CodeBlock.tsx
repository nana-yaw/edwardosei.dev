"use client";

// ---------------------------------------------------------------------------
// CodeBlock — syntax-highlighted code display for real project code
// Inline regex tokenizer for TypeScript. Zero dependencies.
// ---------------------------------------------------------------------------

type TokenType =
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "function"
  | "type"
  | "operator"
  | "punctuation"
  | "text";

interface Token {
  type: TokenType;
  value: string;
}

// Order matters — earlier patterns match first
const TOKEN_PATTERNS: [TokenType, RegExp][] = [
  ["comment", /\/\/.*$/m],
  ["string", /"[^"]*"|'[^']*'|`[^`]*`/],
  ["number", /\b\d+(\.\d+)?(e\d+)?\b/],
  [
    "keyword",
    /\b(?:const|let|var|function|return|if|else|import|export|from|type|interface|class|new|typeof|instanceof|async|await)\b/,
  ],
  ["type", /\b(?:number|string|boolean|void|any|never|null|undefined)\b/],
  ["function", /\b[a-zA-Z_]\w*(?=\s*\()/],
  ["operator", /=>|===|!==|==|!=|>=|<=|&&|\|\||\*\*|[+\-*/%=<>!&|^~]/],
  ["punctuation", /[{}()\[\];:,.]/],
];

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let remaining = code;

  while (remaining.length > 0) {
    let matched = false;

    for (const [type, pattern] of TOKEN_PATTERNS) {
      const match = remaining.match(
        new RegExp(`^(${pattern.source})`, pattern.flags)
      );
      if (match) {
        tokens.push({ type, value: match[0] });
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Consume whitespace or single characters as plain text
      const wsMatch = remaining.match(/^\s+/);
      if (wsMatch) {
        tokens.push({ type: "text", value: wsMatch[0] });
        remaining = remaining.slice(wsMatch[0].length);
      } else {
        // Single character — identifier fragment or unknown
        const identMatch = remaining.match(/^[a-zA-Z_]\w*/);
        if (identMatch) {
          tokens.push({ type: "text", value: identMatch[0] });
          remaining = remaining.slice(identMatch[0].length);
        } else {
          tokens.push({ type: "text", value: remaining[0] });
          remaining = remaining.slice(1);
        }
      }
    }
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Color palettes per theme variant
// ---------------------------------------------------------------------------
type Variant = "cinematic" | "minimal" | "bold" | "terminal";

interface ColorPalette {
  bg: string;
  headerBg: string;
  border: string;
  text: string;
  keyword: string;
  string: string;
  number: string;
  comment: string;
  function: string;
  type: string;
  operator: string;
  punctuation: string;
  filename: string;
  lineNumber: string;
  dot: string;
}

const PALETTES: Record<Variant, ColorPalette> = {
  cinematic: {
    bg: "#0d0d14",
    headerBg: "#12121c",
    border: "rgba(79, 125, 245, 0.12)",
    text: "#c9d1d9",
    keyword: "#4f7df5",
    string: "#3fb950",
    number: "#d29922",
    comment: "#55556a",
    function: "#d2a8ff",
    type: "#79c0ff",
    operator: "#8888a0",
    punctuation: "#8888a0",
    filename: "#4f7df5",
    lineNumber: "#33334a",
    dot: "#4f7df5",
  },
  minimal: {
    bg: "#f8f8f6",
    headerBg: "#f0f0ec",
    border: "rgba(26, 26, 46, 0.12)",
    text: "#1a1a2e",
    keyword: "#7928ca",
    string: "#16a34a",
    number: "#b45309",
    comment: "#9ca3af",
    function: "#2563eb",
    type: "#0891b2",
    operator: "#6b7280",
    punctuation: "#6b7280",
    filename: "#1a1a2e",
    lineNumber: "#c4c4c0",
    dot: "#1a1a2e",
  },
  bold: {
    bg: "#0a0a0a",
    headerBg: "#111111",
    border: "rgba(255, 255, 255, 0.08)",
    text: "#999",
    keyword: "#FF6B4A",
    string: "#3fb950",
    number: "#f0c674",
    comment: "#555555",
    function: "#f5f5f0",
    type: "#FF8F73",
    operator: "#888",
    punctuation: "#666666",
    filename: "#FF6B4A",
    lineNumber: "#333",
    dot: "#FF6B4A",
  },
  terminal: {
    bg: "#0d1117",
    headerBg: "#161b22",
    border: "#21262d",
    text: "#c9d1d9",
    keyword: "#ff7b72",
    string: "#a5d6ff",
    number: "#d29922",
    comment: "#484f58",
    function: "#d2a8ff",
    type: "#79c0ff",
    operator: "#c9d1d9",
    punctuation: "#c9d1d9",
    filename: "#3fb950",
    lineNumber: "#484f58",
    dot: "#3fb950",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface CodeBlockProps {
  code: string;
  filename: string;
  variant: Variant;
  className?: string;
}

export function CodeBlock({ code, filename, variant, className }: CodeBlockProps) {
  const p = PALETTES[variant];
  const tokens = tokenize(code);
  const lines = code.split("\n");
  const lineCount = lines.length;

  // Build tokenized lines for rendering
  const tokenizedLines: Token[][] = [];
  let currentLine: Token[] = [];

  for (const token of tokens) {
    // Split tokens that span multiple lines
    const parts = token.value.split("\n");
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        tokenizedLines.push(currentLine);
        currentLine = [];
      }
      if (parts[i].length > 0) {
        currentLine.push({ type: token.type, value: parts[i] });
      }
    }
  }
  tokenizedLines.push(currentLine);

  return (
    <div
      className={`overflow-hidden rounded-xl ${className ?? ""}`}
      style={{ border: `1px solid ${p.border}` }}
    >
      {/* File tab header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: p.headerBg }}
      >
        {/* Dots */}
        {variant !== "minimal" && (
          <div className="flex gap-1.5" aria-hidden="true">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
          </div>
        )}
        <span
          className="text-xs font-medium"
          style={{
            color: p.filename,
            fontFamily: "var(--font-fira-code), monospace",
          }}
        >
          {filename}
        </span>
      </div>

      {/* Code area */}
      <div
        className="overflow-x-auto px-4 py-4"
        style={{ background: p.bg }}
      >
        <pre
          className="text-[0.8rem] leading-6"
          style={{
            fontFamily: "var(--font-fira-code), monospace",
            color: p.text,
            margin: 0,
          }}
        >
          <code>
            {tokenizedLines.slice(0, lineCount).map((lineTokens, lineIdx) => (
              <div key={lineIdx} className="flex">
                {/* Line number */}
                <span
                  className="mr-4 inline-block w-6 shrink-0 select-none text-right"
                  style={{ color: p.lineNumber }}
                  aria-hidden="true"
                >
                  {lineIdx + 1}
                </span>
                {/* Tokens */}
                <span>
                  {lineTokens.length === 0 ? (
                    "\u00A0"
                  ) : (
                    lineTokens.map((token, tIdx) => (
                      <span
                        key={tIdx}
                        style={{ color: p[token.type] || p.text }}
                      >
                        {token.value}
                      </span>
                    ))
                  )}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
