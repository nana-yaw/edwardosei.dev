import type { OutcomeKind } from "@/data/breakIt";

/* ── What did they type? ── */
// Harmless pattern checks that sort typed text into a kind of attack, so the
// right layer can react. This is theatre, not a filter: nothing here is how
// input should be validated for real, and the text never leaves this function.

// Demo-only number: it paces the simulation and describes no real system.
const LONG_INPUT_CHARACTERS = 280;

const SCRIPT = /<\s*script\b|javascript:|\bon[a-z]+\s*=/i;
const MARKUP = /<\s*\/?\s*[a-z!][^>]*>/i;

const SQL: readonly RegExp[] = [
  /'\s*(or|and)\s+[^=\s]+\s*=/i,
  /\b(or|and)\s+1\s*=\s*1\b/i,
  /\bunion\s+(all\s+)?select\b/i,
  /\bdrop\s+(table|database)\b/i,
  /\bselect\s+\*/i,
  /\b(insert\s+into|delete\s+from)\s+\w+/i,
  /['"]\s*;?\s*--/,
  /;\s*(drop|delete|truncate|update|insert)\b/i,
];

const COVER_TRACKS =
  /\b(delete|clear|wipe|erase|remove|hide|edit|cover)\b.{0,40}\b(logs?|records?|history|evidence|tracks|trail)\b/i;

const BACK_DOOR =
  /(^|[\s/])(admin|wp-admin)\b|\/login\b|\.\.\/|\/etc\/passwd|\.env\b|\bpassword\s*[:=]|\blet me in\b|\bopen sesame\b/i;

const SALES_PITCH =
  /https?:\/\/|\bwww\.|\b(free money|buy now|click here|act now|you have won|casino|crypto|followers)\b/i;

export function classifyAttack(typed: string): OutcomeKind {
  const text = typed.trim();
  if (text.length === 0) return "empty";
  // Length first, so the patterns below only ever run on a short string.
  if (text.length > LONG_INPUT_CHARACTERS) return "long";
  if (SCRIPT.test(text)) return "nasty";
  if (MARKUP.test(text)) return "markup";
  if (SQL.some((pattern) => pattern.test(text))) return "sql";
  if (COVER_TRACKS.test(text)) return "log";
  if (BACK_DOOR.test(text)) return "door";
  if (SALES_PITCH.test(text)) return "pitch";
  return "honest";
}
