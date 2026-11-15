/* ── Adinkra symbols and kente strips: on or off ──────────── */
// These designs may need the National Folklore Board's permission before a
// commercial site uses them. Edward chose to launch with them on (15 Nov
// 2026); building with NEXT_PUBLIC_SHOW_ADINKRA=false turns them off.
// Only server components read this, and hand what it decides to the client
// as props, so the server and the browser can never disagree about it.

export const showAdinkra = process.env.NEXT_PUBLIC_SHOW_ADINKRA !== "false";
