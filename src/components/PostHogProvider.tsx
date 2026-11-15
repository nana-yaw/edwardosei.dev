"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

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
      // The break-it section promises that nothing typed leaves the page. A
      // recording switched on from the dashboard would break that promise,
      // so it is off here, where the code decides.
      disable_session_recording: true,
    });
  }, []);

  if (!POSTHOG_KEY) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
