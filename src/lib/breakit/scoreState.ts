import { verdicts, type OutcomeKind } from "@/data/breakIt";

/* ── Score state ── */
// One reducer for the score. An attack is counted as tried the moment it is
// thrown, so the press answers back at once, but it only counts as stopped
// (or delivered) when it lands on screen. If the visitor throws the next one
// first, the interrupted attack is settled before the new one starts.

export interface Thrown {
  kind: OutcomeKind;
  /** A short copy of what was sent, shown back as text. Null for the ready-made attacks. */
  echo: string | null;
}

export interface ScoreState {
  /** Id of the latest attack, so a late landing from an old one is ignored. */
  run: number;
  /** Thrown and still falling. */
  pending: Thrown | null;
  /** The last result that landed. */
  shown: Thrown | null;
  /** Run id of `shown`. Zero before anything has landed. */
  landedRun: number;
  tried: number;
  stopped: number;
  honest: number;
  /** Layers that have stopped something at least once. */
  setOff: readonly number[];
}

export type ScoreAction =
  | { type: "launch"; run: number; thrown: Thrown }
  | { type: "land"; run: number };

export const initialScoreState: ScoreState = {
  run: 0,
  pending: null,
  shown: null,
  landedRun: 0,
  tried: 0,
  stopped: 0,
  honest: 0,
  setOff: [],
};

function settle(state: ScoreState): ScoreState {
  if (state.pending === null) return state;
  const { layer } = verdicts[state.pending.kind];
  const wasStopped = layer !== null;
  return {
    ...state,
    pending: null,
    shown: state.pending,
    landedRun: state.run,
    stopped: wasStopped ? state.stopped + 1 : state.stopped,
    honest: wasStopped ? state.honest : state.honest + 1,
    setOff: wasStopped && !state.setOff.includes(layer) ? [...state.setOff, layer] : state.setOff,
  };
}

export function scoreReducer(state: ScoreState, action: ScoreAction): ScoreState {
  if (action.type === "launch") {
    const settled = settle(state);
    const isAttack = verdicts[action.thrown.kind].layer !== null;
    return {
      ...settled,
      run: action.run,
      pending: action.thrown,
      tried: isAttack ? settled.tried + 1 : settled.tried,
    };
  }
  if (action.run !== state.run) return state;
  return settle(state);
}
