"use client";

import { useEffect, useRef, useState } from "react";

const IDLE_TIMEOUT_MS = 3000;

/**
 * Returns `true` while the user is interacting (pointer/touch/scroll).
 * After `IDLE_TIMEOUT_MS` of inactivity, returns `false`.
 * Starts visible on mount for the initial timeout period.
 */
export function useIdleAutoHide(): boolean {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function resetTimer() {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), IDLE_TIMEOUT_MS);
    }

    // Start the initial hide timer
    timerRef.current = setTimeout(() => setVisible(false), IDLE_TIMEOUT_MS);

    window.addEventListener("pointermove", resetTimer, { passive: true });
    window.addEventListener("pointerdown", resetTimer, { passive: true });
    window.addEventListener("touchstart", resetTimer, { passive: true });
    window.addEventListener("scroll", resetTimer, { passive: true });
    window.addEventListener("keydown", resetTimer, { passive: true });
    window.addEventListener("wheel", resetTimer, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("pointermove", resetTimer);
      window.removeEventListener("pointerdown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("wheel", resetTimer);
    };
  }, []);

  return visible;
}
