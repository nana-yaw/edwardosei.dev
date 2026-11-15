import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { stage } from "@/data/breakIt";
import { prefersMotion } from "@/lib/breakit/motion";

/** With reduced motion every press lands at once, so the live region waits
 * this long after the last one before it speaks: a burst of presses is one
 * sentence, not one each. */
const QUIET_MS = 500;

interface VerdictPanelProps {
  title: string;
  line: string;
  /** What was sent, already shortened. Only ever rendered as text. */
  echo: string | null;
  /** True when a layer stopped it, so the title takes the accent. */
  isCaught: boolean;
  /** True while the next attack is still falling. */
  isStale: boolean;
  /** Changes once per result; replays the type-out. Zero before any attack. */
  landedRun: number;
  /** The whole result as one sentence, for the live region. Spoken only once it has settled. */
  announcement: string;
  className?: string;
}

/* ── Verdict ── */
// What the stack says back. The visible copy is split into words so it can
// type out; a visually hidden live region carries the same result whole, so
// a screen reader hears it once and never word by word.
export function VerdictPanel({
  title,
  line,
  echo,
  isCaught,
  isStale,
  landedRun,
  announcement,
  className = "",
}: VerdictPanelProps) {
  const scope = useRef<HTMLDivElement>(null);
  // The result the live region may speak. It trails the one on screen, so
  // the region stays empty while an attack falls and an interrupted one is
  // never spoken: only the latest result, once it has landed.
  const [spokenRun, setSpokenRun] = useState(0);

  useEffect(() => {
    if (landedRun === 0) return;
    const timer = window.setTimeout(() => setSpokenRun(landedRun), prefersMotion() ? 0 : QUIET_MS);
    return () => window.clearTimeout(timer);
  }, [landedRun]);

  useGSAP(
    () => {
      if (landedRun === 0 || !prefersMotion()) return;
      gsap.from("[data-verdict-title]", { opacity: 0, x: -14, duration: 0.3, ease: "power3.out" });
      // The echo, when there is one, arrives as the last word.
      gsap.from("[data-word], [data-echo]", {
        opacity: 0,
        y: "0.7em",
        duration: 0.45,
        ease: "power3.out",
        stagger: 0.024,
        delay: 0.08,
      });
    },
    { scope, dependencies: [landedRun] },
  );

  const hasResult = landedRun > 0;
  const settled = !isStale && spokenRun === landedRun;

  return (
    <div ref={scope} className={`min-w-0 sm:min-h-[11rem] xl:min-h-[9.75rem] ${className}`}>
      <p role="status" aria-live="polite" className="sr-only">
        {settled ? announcement : ""}
      </p>

      {/* Keyed by result so each one gets fresh nodes to animate. Hidden from
          assistive tech once the live region has a result to speak instead. */}
      <div key={landedRun} aria-hidden={hasResult} className={isStale ? "opacity-40" : ""}>
        <p
          data-verdict-title
          className={`font-stretch-[var(--stretch-display)] text-[0.9375rem] font-bold leading-snug sm:text-xl ${isCaught ? "text-accent" : ""}`}
        >
          {title}
        </p>
        <p className="mt-2 text-[0.9375rem] leading-snug sm:text-statement">
          {line.split(" ").map((word, index) => (
            <span key={`${word}${index}`}>
              <span data-word className="inline-block">
                {word}
              </span>{" "}
            </span>
          ))}
        </p>
        {echo === null ? null : (
          <p
            data-echo
            className="mt-2 text-[0.8125rem] leading-snug text-muted [overflow-wrap:anywhere] sm:mt-3 sm:text-sm"
          >
            {stage.echoLabel} <span className="text-foreground">{echo}</span>
          </p>
        )}
      </div>
    </div>
  );
}
