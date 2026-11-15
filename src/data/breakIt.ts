/* ── Copy for "Try to break it" ───────────────────────────── */
// Every word this section shows lives here. The defences are described in
// general terms on purpose: nothing says how any real product is protected,
// and the numbers are the size of a made-up attack, never a real limit.
// No line says how a layer tells an attack from a real person either: naming
// the check would tell the attacker what to change.

import { homePath } from "./navigation";

/** Where the section sits on the home page. */
export const breakItAnchor = "break-it";

export const intro = {
  headline: "Go on. Try to break it.",
  // Set as three short lines. The last one flinches when an attack lands.
  lines: [
    { text: "Go on.", flinches: false },
    { text: "Try to", flinches: false },
    { text: "break it.", flinches: true },
  ],
  lede: "Six layers stand between this page and whatever you throw at it. Pick an attack, or bring your own.",
  // Shown right under the dare, so a curious visitor aims at this demo and
  // not at a live product.
  notice: "This is a simulation. Nothing you type leaves the page.",
} as const;

/* ── The six layers ── */

export interface LabLayer {
  name: string;
  detail: string;
}

// Top plate first: the order a request meets them.
export const layers: readonly LabLayer[] = [
  {
    name: "Checks what you type",
    detail: "Every field has a shape. Anything that does not fit is turned away at the start.",
  },
  {
    name: "Slows down floods",
    detail: "Too many requests too fast and you wait your turn, however nicely you ask.",
  },
  {
    name: "Spots bots",
    detail: "Automated sign-ups get spotted and quietly shown out. Real people walk straight in.",
  },
  {
    name: "Cleans what is shown back",
    detail: "Code pasted into a text box comes back as plain text. It never runs.",
  },
  {
    name: "Guards the door",
    detail: "Private pages check who you are and what you may see, every single time.",
  },
  {
    name: "Writes it all down",
    detail: "Every attempt is recorded, so there is always a trail to follow afterwards.",
  },
];

/* ── Attacks and what the layers say back ── */

export type OutcomeKind =
  | "spam"
  | "nasty"
  | "flood"
  | "rapid"
  | "empty"
  | "long"
  | "markup"
  | "sql"
  | "log"
  | "door"
  | "pitch"
  | "honest";

export interface Verdict {
  /** Index into `layers` of the layer that stops it. Null means it is let through. */
  layer: number | null;
  line: string;
}

export const verdicts: Record<OutcomeKind, Verdict> = {
  spam: {
    layer: 2,
    line: "400 sign-ups in one burst. Bots. Shown out.",
  },
  nasty: {
    layer: 3,
    line: "A script where a name goes. It came back as plain text, looking silly.",
  },
  flood: {
    layer: 1,
    line: "5,000 requests at once? Slow down. They wait their turn like everyone else.",
  },
  rapid: {
    layer: 1,
    line: "That is a lot of clicks in a row. Join the queue.",
  },
  empty: {
    layer: 0,
    line: "An empty message. Even the bots try harder than that.",
  },
  long: {
    layer: 0,
    line: "A lot of text for one small box. Measured, frowned at, sent back.",
  },
  markup: {
    layer: 3,
    line: "Markup in a text box. Shown back as plain text, so none of it runs.",
  },
  sql: {
    layer: 0,
    line: "That looks like SQL. Here it is just text. The database never hears it.",
  },
  log: {
    layer: 5,
    line: "Covering your tracks? The record only grows. That went in too.",
  },
  door: {
    layer: 4,
    line: "Looking for the back door? It asked who you are and stayed shut.",
  },
  pitch: {
    layer: 2,
    line: "A link and a sales pitch. This layer has met your kind before.",
  },
  honest: {
    layer: null,
    line: "That one was fine. It went straight through, as real people should.",
  },
};

export const attackButtons = [
  { kind: "spam", label: "Spam the form", detail: "400 fake sign-ups" },
  { kind: "nasty", label: "Paste something nasty", detail: "A script tag for a name" },
  { kind: "flood", label: "Flood it", detail: "5,000 requests at once" },
] as const;

export type ButtonAttackKind = (typeof attackButtons)[number]["kind"];

/** What the "nasty" button pretends to paste. Only ever shown back as text. */
export const nastySample = '<script>alert("gotcha")</script>';

export const form = {
  label: "Or type your own attack",
  placeholder: "A script tag, some SQL, or just hello",
  submit: "Throw it",
  // The full sentence sits by the headline; this repeats the promise at the box.
  notice: "Nothing you type leaves the page.",
  noScript: "The attacks need JavaScript switched on. The rest of this page does not.",
} as const;

export const stage = {
  figureLabel:
    "Six plates stacked one above the other, one for each layer a request has to pass.",
  idleTitle: "Nothing thrown yet.",
  idleLine: "The layers are bored.",
  passedTitle: "Let through.",
  caughtTitle: (layerNumber: number, layerName: string) =>
    `Stopped at layer ${layerNumber}. ${layerName}.`,
  echoLabel: "You sent",
} as const;

const honestDelivered = (count: number) =>
  count === 1 ? "1 honest message delivered" : `${count} honest messages delivered`;

export const tally = {
  // The joke of the page: this number is not wired to anything.
  gotThrough: "0",
  gotThroughLabel: "got through",
  outOf: (tried: number) => (tried === 1 ? "out of 1 attack" : `out of ${tried} attacks`),
  honest: honestDelivered,
  // Carries the honest count too, so a second honest message reads
  // differently from the first and is announced again.
  spoken: (tried: number, honest: number) =>
    `Attacks tried: ${tried}. Got through: 0.${honest > 0 ? ` ${honestDelivered(honest)}.` : ""}`,
} as const;

export const ending = {
  statement: "Your product gets the same six layers.",
  link: { label: "Hire me for a project", href: `${homePath}#contact` },
} as const;

export const layerList = {
  title: "What each layer does",
  /** Said after a layer's name once it has stopped something. */
  setOff: "set off",
  progress: (setOff: number, total: number) =>
    setOff === total
      ? `All ${total} set off. You have met the whole stack.`
      : `Set off so far: ${setOff} of ${total}. The text box reaches the rest.`,
} as const;
