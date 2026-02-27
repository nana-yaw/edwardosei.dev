"use client";

import { useReducer, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import Avatar from "@/components/Avatar";
import { getFeaturedProject } from "@/data/projects";

const COMMAND_TEXT = "cat README.md";
const TYPE_SPEED_MS = 60;

interface TypingState {
  displayed: string;
  done: boolean;
}

type TypingAction =
  | { type: "reset" }
  | { type: "tick"; text: string; index: number }
  | { type: "finish"; text: string };

function typingReducer(_state: TypingState, action: TypingAction): TypingState {
  switch (action.type) {
    case "reset":
      return { displayed: "", done: false };
    case "tick":
      return { displayed: action.text.slice(0, action.index), done: false };
    case "finish":
      return { displayed: action.text, done: true };
  }
}

function useTypingEffect(text: string, speed: number) {
  const [state, dispatch] = useReducer(typingReducer, { displayed: "", done: false });
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    dispatch({ type: "reset" });

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        dispatch({ type: "finish", text });
        clearInterval(interval);
      } else {
        dispatch({ type: "tick", text, index: indexRef.current });
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return state;
}

// Build the README output from real data
function buildReadmeOutput() {
  const experience = profile.experience[0];
  const role = `${experience.role} @ ${experience.company}`;
  const stats = getFeaturedProject().stats;

  const stackItems = [
    "PHP",
    "TypeScript",
    "Kotlin",
    "Next.js",
    "Convex",
  ];

  return {
    name: profile.name,
    tagline: profile.taglines.bold,
    description: profile.taglines.terminal, // "I write code that serves communities."
    role,
    stack: stackItems.join(", "),
    currentProject: `${getFeaturedProject().name} (${stats.databaseTables} tables, ${stats.tests} tests, ${stats.securityLayers} security layers)`,
  };
}

export function TerminalHero() {
  const { displayed: typedCommand, done: commandDone } = useTypingEffect(
    COMMAND_TEXT,
    TYPE_SPEED_MS
  );
  const readme = buildReadmeOutput();

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh items-center justify-center bg-[#0d1117] px-5 pt-16 pb-20"
    >
      <div className="w-full max-w-[800px]">
        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="overflow-hidden rounded-lg border border-[#21262d] bg-[#0d1117]"
        >
          {/* Title bar with traffic lights */}
          <div className="flex items-center gap-2 border-b border-[#21262d] bg-[#161b22] px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#f85149]" />
            <span className="h-3 w-3 rounded-full bg-[#d29922]" />
            <span className="h-3 w-3 rounded-full bg-[#3fb950]" />
            <span
              className="ml-3 text-xs text-[#484f58]"
              style={{ fontFamily: "var(--font-fira-code)" }}
            >
              edward@portfolio:~
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-5 text-sm leading-relaxed">
            {/* Command line with typing effect */}
            <div
              className="flex items-center gap-2"
              style={{ fontFamily: "var(--font-fira-code)" }}
            >
              <span className="select-none text-[#3fb950]">$</span>
              <span className="text-[#c9d1d9]">
                {typedCommand}
                {!commandDone && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "linear" as const,
                    }}
                    className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[2px] bg-[#3fb950]"
                  />
                )}
              </span>
            </div>

            {/* README output — appears after typing completes */}
            {commandDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
                className="mt-5"
              >
                {/* Heading */}
                <h1
                  className="text-xl font-bold text-[#c9d1d9]"
                  style={{ fontFamily: "var(--font-fira-code)" }}
                >
                  <span className="mr-2 text-[#484f58]">#</span>
                  {readme.name}
                </h1>

                {/* Blockquote tagline */}
                <p
                  className="mt-3 border-l-2 border-[#484f58] pl-3 text-sm text-[#484f58]"
                  style={{ fontFamily: "var(--font-fira-code)" }}
                >
                  {readme.tagline}
                </p>

                {/* Description */}
                <p className="mt-4 text-sm leading-relaxed text-[#c9d1d9]/80">
                  {readme.description}
                </p>

                {/* Quick Stats heading */}
                <h2
                  className="mt-6 text-base font-semibold text-[#c9d1d9]"
                  style={{ fontFamily: "var(--font-fira-code)" }}
                >
                  <span className="mr-2 text-[#484f58]">##</span>
                  Quick Stats
                </h2>

                {/* Stats list */}
                <ul
                  className="mt-3 space-y-1.5 text-sm"
                  style={{ fontFamily: "var(--font-fira-code)" }}
                >
                  <li className="flex items-start gap-2">
                    <span className="select-none text-[#484f58]">-</span>
                    <span>
                      <span className="text-[#d29922]">Role:</span>{" "}
                      <span className="text-[#c9d1d9]/80">{readme.role}</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="select-none text-[#484f58]">-</span>
                    <span>
                      <span className="text-[#d29922]">Stack:</span>{" "}
                      <span className="text-[#c9d1d9]/80">{readme.stack}</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="select-none text-[#484f58]">-</span>
                    <span>
                      <span className="text-[#d29922]">Current project:</span>{" "}
                      <span className="text-[#c9d1d9]/80">
                        {readme.currentProject}
                      </span>
                    </span>
                  </li>
                </ul>

                {/* Blinking cursor at end */}
                <div
                  className="mt-5 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-fira-code)" }}
                >
                  <span className="select-none text-[#3fb950]">$</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "linear" as const,
                    }}
                    className="inline-block h-[1.1em] w-[0.55em] translate-y-[1px] bg-[#3fb950]"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Photo below the terminal */}
        <div className="mt-8 flex justify-center">
          <Avatar src="/photos/edward.jpg" size="md" />
        </div>
      </div>
    </section>
  );
}
