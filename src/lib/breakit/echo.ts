/* ── What is shown back ── */
// The visitor's own words come back under the verdict, cut short so a long
// paste cannot push the panel apart.

const ECHO_CHARACTERS = 72;

/** A high surrogate is the first half of an emoji or other character outside the basic plane. */
function isHighSurrogate(code: number): boolean {
  return code >= 0xd800 && code <= 0xdbff;
}

export function shortenEcho(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= ECHO_CHARACTERS) return trimmed;
  const cut = trimmed.slice(0, ECHO_CHARACTERS);
  // A cut through the middle of an emoji leaves half of it, which shows as a
  // broken character.
  const whole = isHighSurrogate(cut.charCodeAt(cut.length - 1)) ? cut.slice(0, -1) : cut;
  return `${whole}...`;
}
