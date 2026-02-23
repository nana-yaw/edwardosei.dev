"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { themes, themeOrder } from "@/lib/themes";

export function ThemeChooser() {
  const { setTheme, hasChosen } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (hasChosen) {
      router.replace("/portfolio");
    }
  }, [hasChosen, router]);

  if (hasChosen) return null;

  function handlePick(themeId: (typeof themeOrder)[number]) {
    setTheme(themeId);
    router.push("/portfolio");
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 bg-[#0a0a0a]">
      {/* Brand mark */}
      <div className="mb-12 text-center">
        <h1
          className="text-4xl sm:text-5xl font-light tracking-[0.3em] text-white"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          devONE
        </h1>
        <p className="mt-3 text-sm tracking-[0.15em] uppercase text-neutral-500">
          Edward Osei-Nyarko
        </p>
      </div>

      {/* Theme prompt */}
      <p className="mb-10 text-neutral-400 text-center text-sm">
        Choose how you want to experience this portfolio.
      </p>

      {/* Theme cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {themeOrder.map((id, i) => {
          const t = themes[id];
          return (
            <motion.button
              key={id}
              onClick={() => handlePick(id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group relative flex flex-col items-start p-6 rounded-lg border border-neutral-800 bg-neutral-950 text-left transition-colors hover:border-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
            >
              {/* Gradient swatch */}
              <div
                className="w-full h-2 rounded-full mb-4"
                style={{ background: t.preview }}
              />

              <span className="text-lg font-medium text-white">
                {t.name}
              </span>
              <span className="text-xs uppercase tracking-wider text-neutral-500 mt-0.5">
                {t.subtitle}
              </span>
              <span className="text-sm text-neutral-400 mt-2">
                {t.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </main>
  );
}
