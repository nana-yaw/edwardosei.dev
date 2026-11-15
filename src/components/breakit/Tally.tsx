import { tally } from "@/data/breakIt";

interface TallyProps {
  tried: number;
  honest: number;
  className?: string;
}

/* ── Tally ── */
// The score. The big number is the joke: it never changes, and it shakes its
// head each time something is stopped (the attack timeline moves it by its
// data hook).
export function Tally({ tried, honest, className = "" }: TallyProps) {
  return (
    <p className={`flex items-end gap-3 ${className}`}>
      <span
        data-zero
        className="block font-stretch-[var(--stretch-display)] text-[3.25rem] font-bold leading-[0.8] text-accent sm:text-[5.5rem]"
      >
        {tally.gotThrough}
      </span>
      <span className="block text-[0.8125rem] leading-snug text-muted sm:text-sm">
        <span className="block font-semibold text-foreground">{tally.gotThroughLabel}</span>
        <span className="block tabular-nums">{tally.outOf(tried)}</span>
        {honest > 0 ? <span className="block tabular-nums">{tally.honest(honest)}</span> : null}
      </span>
    </p>
  );
}
