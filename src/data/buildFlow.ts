/* ── Copy for the build flow ──────────────────────────────── */
// The six parts of a build, the Adinkra symbol each one carries, and the
// words the flow adds to them. The Twi names, the literal translations and
// the meanings were checked against published references before they were
// written down, so change them only against a reference, never by ear.

export type SymbolId =
  | "nkyimu"
  | "ananse-ntontan"
  | "fihankra"
  | "bese-saka"
  | "hwemudua"
  | "pempamsie";

export interface BuildPart {
  id: SymbolId;
  /** The part of a product build, in the words the site already uses. */
  part: string;
  /** Twi name of the symbol. */
  name: string;
  literal: string;
  meaning: string;
  /** One plain sentence tying the meaning to that part of a build. */
  link: string;
}

export const buildPartsSection = {
  id: "parts",
  title: "What goes into a build",
} as const;

export const buildFlow = {
  // Two wordings, both approved by Edward (15 Nov 2026). The second is for
  // when the Adinkra symbols are shown.
  lede: "Every build runs through the same six parts, in this order. Each one comes with one question I ask before I move on.",
  ledeWithSymbols:
    "Every build runs through the same six parts, in this order. Each one carries the Adinkra symbol whose meaning fits it, and one question I ask before I move on.",
  labels: {
    question: "What I ask",
    meaning: "Meaning",
  },
} as const;

// In build order. The first part does not assume the owner arrives with
// mockups: an idea is as welcome.
export const parts: readonly BuildPart[] = [
  {
    id: "nkyimu",
    part: "Your idea or mockups",
    name: "Nkyimu",
    literal: "The guide lines ruled on adinkra cloth before stamping",
    meaning: "Precision, skill",
    link: "Your idea or your mockups become the guide lines, and everything I build is set to them.",
  },
  {
    id: "ananse-ntontan",
    part: "Working screens",
    name: "Ananse Ntontan",
    literal: "Spider's web",
    meaning: "Wisdom, creativity",
    link: "A flat picture becomes a screen that works, and every screen ties into the next.",
  },
  {
    id: "fihankra",
    part: "Accounts and sign-in",
    name: "Fihankra",
    literal: "Compound house",
    meaning: "Security, safety",
    link: "Your customers and your staff come in through their own door, and nobody else does.",
  },
  {
    id: "bese-saka",
    part: "Payments",
    name: "Bese Saka",
    literal: "Sack of cola nuts",
    meaning: "Affluence, abundance, trade",
    link: "Trade needs a way to take money, so payments are connected and tested before launch.",
  },
  {
    id: "hwemudua",
    part: "Testing",
    name: "Hwemudua",
    literal: "Measuring rod",
    meaning: "Examination, quality control",
    link: "Nothing ships until it has been measured.",
  },
  {
    id: "pempamsie",
    part: "Launch",
    name: "Pempamsie",
    literal: "Sew in readiness",
    meaning: "Readiness, steadfastness",
    link: "Everything is sewn up before launch day, so going live is the calm part.",
  },
];

// The question Edward asks himself at each part, in build order. Plain words
// on purpose: an owner should hear their own worry in it, not a method.
export const flowQuestions: Record<SymbolId, string> = {
  nkyimu: "What should this do for your customers?",
  "ananse-ntontan": "Can someone use it without being shown how?",
  fihankra: "Who is allowed to see what?",
  "bese-saka": "Does the money arrive, and can you prove it?",
  hwemudua: "What happens when someone does the wrong thing?",
  pempamsie: "Is it live at your own address, and still up next month?",
};

export const credit =
  "Adinkra are Akan symbols from Ghana, each carrying a proverb or an idea. The names, translations and meanings on this page follow published references. The symbols are redrawn for this site from their traditional forms. The strip patterns are kente-inspired and copy no named cloth.";

/** What a screen reader hears when a part is picked. */
export function spokenStep(part: string, question: string): string {
  return `${part}. ${buildFlow.labels.question}: ${question}`;
}
