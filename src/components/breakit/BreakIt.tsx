"use client";

import { useReducer, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  breakItAnchor,
  intro,
  layers,
  nastySample,
  stage,
  tally,
  verdicts,
  type ButtonAttackKind,
  type OutcomeKind,
} from "@/data/breakIt";
import { buildAttackTimeline, type AttackPattern } from "@/lib/breakit/attackTimeline";
import { classifyAttack } from "@/lib/breakit/classifyAttack";
import { shortenEcho } from "@/lib/breakit/echo";
import { initialScoreState, scoreReducer } from "@/lib/breakit/scoreState";
import { prefersMotion } from "@/lib/breakit/motion";
import { AttackControls } from "./AttackControls";
import { AttackHeadline } from "./AttackHeadline";
import { EndingBeat } from "./EndingBeat";
import { LayerList } from "./LayerList";
import { LayerLabels, LayerStack } from "./LayerStack";
import { Tally } from "./Tally";
import { VerdictPanel } from "./VerdictPanel";

gsap.registerPlugin(useGSAP);

// Demo-only pacing for "you are clicking too fast". These describe this toy
// and nothing else.
const RAPID_THROWS = 4;
const RAPID_WINDOW_MS = 2500;

const ATTACKS_TO_EARN_ENDING = 3;

// Most attacks are one request. These arrive as a crowd.
const PATTERNS: Partial<Record<OutcomeKind, AttackPattern>> = {
  spam: "drip",
  flood: "flood",
  rapid: "rush",
};

const subscribeToNothing = () => () => {};

/* ── Try to break it ── */
// The whole section, under its own anchor. Everything it shows is rendered
// on the server and reads fine with scripts off; scripts add the attacks. It
// is a simulation end to end: no request is ever made, and what is typed is
// held in memory, shown back as text and gone when the page closes.
export function BreakIt() {
  const titleId = `${breakItAnchor}-title`;
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const runCounter = useRef(0);
  const recentThrows = useRef<number[]>([]);
  const [state, dispatch] = useReducer(scoreReducer, initialScoreState);
  // False in the server HTML and during hydration, true after: the controls
  // stay disabled until a press can actually be handled.
  const ready = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const { contextSafe } = useGSAP({ scope: root });

  // A sliding window: keep mashing and the telling-off keeps coming; pause
  // for a moment and the attacks go back to normal.
  function isTooFast(now: number): boolean {
    const recent = recentThrows.current.filter((time) => now - time < RAPID_WINDOW_MS);
    recent.push(now);
    recentThrows.current = recent;
    return recent.length >= RAPID_THROWS;
  }

  function launch(requested: OutcomeKind, echo: string | null) {
    const stageRoot = root.current;
    if (!stageRoot) return;

    const kind = isTooFast(performance.now()) ? "rapid" : requested;
    runCounter.current += 1;
    const run = runCounter.current;
    dispatch({ type: "launch", run, thrown: { kind, echo: kind === "rapid" ? null : echo } });

    // Built inside the GSAP context so it is cleaned up with the component.
    contextSafe(() => {
      timeline.current?.kill();
      timeline.current = buildAttackTimeline(
        stageRoot,
        { layer: verdicts[kind].layer, pattern: PATTERNS[kind] ?? "single" },
        () => dispatch({ type: "land", run }),
      );
      // Reduced motion: no travel and no jolt, just the finished picture.
      if (!prefersMotion()) timeline.current.progress(1);
    })();
  }

  function handleAttack(kind: ButtonAttackKind) {
    launch(kind, kind === "nasty" ? nastySample : null);
  }

  function handleThrow(typed: string) {
    const kind = classifyAttack(typed);
    launch(kind, kind === "empty" ? null : shortenEcho(typed));
  }

  const shownVerdict = state.shown ? verdicts[state.shown.kind] : null;
  const inFlight = state.pending !== null;
  const caughtLayer = !inFlight && shownVerdict ? shownVerdict.layer : null;

  let title: string = stage.idleTitle;
  if (shownVerdict) {
    title =
      shownVerdict.layer === null
        ? stage.passedTitle
        : stage.caughtTitle(shownVerdict.layer + 1, layers[shownVerdict.layer].name);
  }
  const line = shownVerdict ? shownVerdict.line : stage.idleLine;
  const echo = state.shown?.echo ?? null;
  // What was sent closes the sentence: the visible copy is hidden from
  // assistive tech, and for the nasty attack the plain-text echo is the point.
  let announcement = "";
  if (shownVerdict) {
    announcement = `${title} ${line} ${tally.spoken(state.tried, state.honest)}`;
    if (echo !== null) announcement += ` ${stage.echoLabel} ${echo}`;
  }

  return (
    // "ph-no-capture" asks the site's analytics, if it ever records sessions,
    // to leave this block out. The section sends nothing itself; this keeps the
    // promise on the page true whatever the analytics settings are.
    <section
      ref={root}
      id={breakItAnchor}
      aria-labelledby={titleId}
      className="ph-no-capture pt-20 lg:pt-28"
    >
      <div className="mx-auto grid w-full max-w-page grid-cols-1 gap-y-7 px-4 pb-16 pt-4 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-x-16 lg:px-12 lg:pb-20 lg:pt-6">
        {/* Two columns from 1024px. Below that the wrappers dissolve and the
            four blocks stack as: dare, stack, controls, ending, in one column
            no wider than the screen, however wide the text box would like to be. */}
        <div className="contents lg:flex lg:flex-col">
          <div className="order-1">
            <AttackHeadline id={titleId} />
            <p className="mt-5 font-medium lg:mt-6">{intro.notice}</p>
            <p className="mt-2 max-w-[40ch] text-lede text-muted">{intro.lede}</p>
          </div>
          <div className="order-3 lg:mt-9">
            <AttackControls ready={ready} onAttack={handleAttack} onThrow={handleThrow} />
          </div>
        </div>

        <div className="contents lg:flex lg:flex-col">
          {/* Phone: drawing on the left, verdict then tally on the right.
              From 640px: drawing and names side by side with the tally in the
              corner under the names, and the verdict across the full width.
              From 1024px the column is half the page: the names keep at least
              12rem and the drawing gives way, and until 1280px the drawing is
              too short to hold the tally under the names, so it takes a row of
              its own there. */}
          <div className="order-2 grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] grid-rows-[auto_1fr] items-start gap-x-4 gap-y-4 sm:grid-cols-[18rem_minmax(0,1fr)] sm:grid-rows-[auto_auto] sm:gap-y-6 lg:grid-cols-[minmax(0,18rem)_minmax(12rem,1fr)] lg:grid-rows-[auto_auto_auto] xl:grid-rows-[auto_auto]">
            <LayerStack
              className="row-span-2 sm:row-span-1"
              layers={layers}
              label={stage.figureLabel}
              caughtLayer={caughtLayer}
            />
            <LayerLabels
              className="hidden sm:col-start-2 sm:row-start-1 sm:block sm:self-stretch"
              layers={layers}
              caughtLayer={caughtLayer}
              setOffLayers={state.setOff}
            />
            <VerdictPanel
              className="col-start-2 row-start-1 sm:col-span-2 sm:col-start-1 sm:row-start-2 lg:row-start-3 xl:row-start-2"
              title={title}
              line={line}
              echo={echo}
              isCaught={shownVerdict !== null && shownVerdict.layer !== null}
              isStale={inFlight}
              landedRun={state.landedRun}
              announcement={announcement}
            />
            <Tally
              className="col-start-2 row-start-2 sm:row-start-1 sm:self-end sm:justify-self-end lg:row-start-2 xl:row-start-1"
              tried={state.tried}
              honest={state.honest}
            />
          </div>
          <div className="order-4 lg:mt-6">
            <EndingBeat
              progress={Math.min(state.stopped / ATTACKS_TO_EARN_ENDING, 1)}
              earned={state.stopped >= ATTACKS_TO_EARN_ENDING}
            />
          </div>
        </div>
      </div>

      <LayerList setOffLayers={state.setOff} />
    </section>
  );
}
