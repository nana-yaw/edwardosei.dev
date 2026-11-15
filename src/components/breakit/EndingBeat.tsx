import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ending } from "@/data/breakIt";
import { prefersMotion } from "@/lib/breakit/motion";

interface EndingBeatProps {
  /** 0..1, how close the visitor is to having seen enough. */
  progress: number;
  /** True once enough attacks have been stopped. */
  earned: boolean;
}

/* ── Ending ── */
// The point of the page, for a business owner. Always in the HTML and always
// a working link; the rule above it fills as attacks are stopped, and when it
// is full the line steps forward from quiet to loud.
export function EndingBeat({ progress, earned }: EndingBeatProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!earned || !prefersMotion()) return;
      gsap.from("[data-ending-word]", {
        opacity: 0,
        y: "0.8em",
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.05,
        delay: 0.5,
      });
      gsap.from("[data-ending-link]", {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.95,
      });
    },
    { scope, dependencies: [earned] },
  );

  return (
    <div ref={scope} className="relative border-t border-border pt-5">
      <span
        aria-hidden="true"
        className="absolute -top-px left-0 block h-0.5 w-full origin-left bg-accent transition-transform duration-500 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p
          className={`max-w-[18ch] font-stretch-[var(--stretch-display)] text-title font-semibold ${earned ? "" : "text-muted"}`}
        >
          {ending.statement.split(" ").map((word, index) => (
            <span key={`${word}${index}`}>
              <span data-ending-word className="inline-block">
                {word}
              </span>{" "}
            </span>
          ))}
        </p>
        <a
          data-ending-link
          href={ending.link.href}
          className={`inline-flex h-12 items-center whitespace-nowrap border px-6 font-semibold ${
            earned
              ? "border-accent bg-accent text-accent-ink hover:border-foreground hover:bg-foreground active:bg-muted"
              : "border-border hover:border-accent active:text-muted"
          }`}
        >
          {ending.link.label}
        </a>
      </div>
    </div>
  );
}
