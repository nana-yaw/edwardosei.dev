"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * Initializes PostHog and provides the context.
 * Only activates when NEXT_PUBLIC_POSTHOG_KEY is set.
 */
export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false, // We track custom events instead
    });
  }, []);

  if (!POSTHOG_KEY) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

/**
 * Tracks theme-related events. Place inside both PostHogProvider and ThemeProvider.
 */
export function PostHogThemeTracker() {
  const ph = usePostHog();
  const { theme, isStory } = useTheme();

  // Track theme changes
  useEffect(() => {
    if (!ph) return;
    ph.capture("theme_changed", { theme, is_story: isStory });
  }, [theme, isStory, ph]);

  return null;
}
