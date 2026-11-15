/* ── Flow progress ── */
// How many parts of the build flow the pipe's lit end has reached. The scroll
// scrub writes it and the flow reads it, so the scrub never reaches into the
// flow's markup and the flow never listens to the scroll. It changes six
// times over the whole section, not once a frame.
// One page has one build flow, so one value is enough.

let partsReached = 0;
const listeners = new Set<() => void>();

export function setPartsReached(count: number): void {
  if (count === partsReached) return;
  partsReached = count;
  listeners.forEach((listener) => listener());
}

export function subscribeToPartsReached(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getPartsReached = (): number => partsReached;

/** Before any scrolling has been measured, and on the server, none are. */
export const noPartsReached = (): number => 0;
