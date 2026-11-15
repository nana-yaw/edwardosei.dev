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

    // The ways in (hire, consultation, email, remote roles) are plain links
    // in the server HTML. They carry data-track, and this one listener
    // records which was used, so they need no script of their own.
    const recordContactClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const door = event.target.closest<HTMLElement>("[data-track]")?.dataset.track;
      if (door) posthog.capture("contact_click", { door });
    };
    document.addEventListener("click", recordContactClick);
    return () => document.removeEventListener("click", recordContactClick);
  }, []);

  if (!POSTHOG_KEY) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
