"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";
import { HEAD_LINE, MOTION_OK, useFlowMode } from "@/components/pipe/useFlowMode";
import { getPartsReached, noPartsReached, subscribeToPartsReached } from "@/lib/flowProgress";
import styles from "./BuildFlow.module.css";

export interface FlowStep {
  /** The part of a build, in the words the site already uses. */
  part: string;
  question: string;
  /** One plain sentence about that part. */
  explanation: string;
  /** What a screen reader hears when the part is picked. */
  spoken: string;
  /** What the node's box shows. */
  mark: ReactNode;
  /** A second line under the part's name, where there is one. */
  byline?: ReactNode;
  /** A note under the node, where there is one. */
  note?: ReactNode;
}

interface FlowStepsProps {
  /** In build order. */
  steps: readonly FlowStep[];
  /** The words set over each question. */
  askLabel: string;
}

/** A phone step lights once it is a little way into the screen. */
const SEEN_MARGIN = "0px 0px -18% 0px";
/** How far down its box the reading line rests after a part is picked: past
 * the top, where the part counts as reached, and well short of the next. */
const LANDING = 0.75;

const flag = (on: boolean) => (on ? "" : undefined);

/* ── Flow steps ── */
// The six parts as one ordered list, laid down the page the way the pipe
// runs. The server sends every word of every step, lit and still, and that is
// what stays with scripts off or reduced motion. Scripts only ever add to it.
// On a phone each step lights once as it is reached. From 768px the page pipe
// itself runs through the nodes, and the scroll decides which part is lit:
// nothing here plays by a clock, so the reader sets the pace both ways.
// Every word and drawing arrives as a prop: the section decides on the server
// what a node carries, and this only lays it out and lights it.
export function FlowSteps({ steps, askLabel }: FlowStepsProps) {
  const last = steps.length - 1;
  const list = useRef<HTMLOListElement>(null);
  const mode = useFlowMode();
  const live = mode === "live";
  // Written by the pipe's scrub as its lit end passes each node.
  const reached = useSyncExternalStore(subscribeToPartsReached, getPartsReached, noPartsReached);
  const [spoken, setSpoken] = useState("");

  // Phones: no timeline and nothing tied to scroll. Each step is marked once.
  useEffect(() => {
    const items = list.current;
    if (mode !== "reveal" || !items) return;

    const watcher = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
          entry.target.setAttribute("data-seen", "");
          watcher.unobserve(entry.target);
        });
      },
      { rootMargin: SEEN_MARGIN },
    );
    items.querySelectorAll(":scope > li").forEach((step) => watcher.observe(step));

    return () => watcher.disconnect();
  }, [mode]);

  // Picking a part moves the page, and the page lights the part. The lit
  // state is never set from here, so it cannot disagree with the scroll.
  function goTo(event: MouseEvent<HTMLButtonElement>, index: number) {
    setSpoken(steps[index].spoken);

    const box = event.currentTarget.querySelector("[data-flow-box]");
    if (!box) return;
    const place = box.getBoundingClientRect();
    const readingLine = window.innerHeight * HEAD_LINE;
    window.scrollTo({
      top: window.scrollY + place.top + place.height * LANDING - readingLine,
      behavior: window.matchMedia(MOTION_OK).matches ? "smooth" : "auto",
    });
  }

  // Six h3s in every mode. Live, the heading holds the button, since a
  // button may not hold a heading, and the name inside it is a plain span.
  const Label = live ? "span" : "div";
  const Name = live ? "span" : "h3";

  return (
    <>
      <ol ref={list} role="list" data-flow data-mode={mode} className={styles.flow}>
        {steps.map((step, index) => {
          const current = live && index === reached - 1;

          const nodeBody = (
            <>
              <span data-flow-box className={styles.box}>
                {/* Silent: whatever it shows is also said in words beside it,
                    or by the list's own count. */}
                <span aria-hidden="true" className="contents">
                  {step.mark}
                </span>
                {index === 0 ? <span data-flow-port="in" className={styles.port} /> : null}
                {index === last ? <span data-flow-port="out" className={styles.port} /> : null}
              </span>
              <Label className={styles.label}>
                <Name className={styles.name}>{step.part}</Name>
                {step.byline}
              </Label>
            </>
          );

          return (
            <li
              key={step.part}
              className={styles.step}
              data-lit={flag(live && index < reached)}
              data-current={flag(current)}
            >
              {/* The pipe to the next node, for the looks where the page pipe
                  does not draw it. */}
              <span aria-hidden="true" className={styles.drop}>
                <span className={styles.dropLit} />
              </span>
              <div>
                {live ? (
                  <h3 className={styles.nodeHeading}>
                    <button
                      type="button"
                      aria-current={current ? "step" : undefined}
                      className={styles.node}
                      onClick={(event) => goTo(event, index)}
                    >
                      {nodeBody}
                    </button>
                  </h3>
                ) : (
                  <div className={styles.node}>{nodeBody}</div>
                )}
                {step.note}
              </div>
              <div className={styles.body}>
                <div>
                  <p className={styles.askLabel}>{askLabel}</p>
                  <p className={styles.question}>{step.question}</p>
                </div>
                <p className={styles.explain}>{step.explanation}</p>
              </div>
            </li>
          );
        })}
      </ol>
      {/* Speaks only when the reader picks a part, never as the page scrolls. */}
      {live ? (
        <p aria-live="polite" className="sr-only">
          {spoken}
        </p>
      ) : null}
    </>
  );
}
