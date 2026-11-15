import { Fragment } from "react";
import { intro } from "@/data/breakIt";

// Each line rises into place on first paint. Done with a CSS transition from
// @starting-style, not script, so the server-rendered text never flashes away
// before it animates. The global reduced-motion rule makes it instant.
const RISE =
  "block transition-[translate,opacity] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] starting:translate-y-[0.35em] starting:opacity-0";

// Words stay whole so a line never breaks inside one; letters are separate
// boxes so each can be knocked about on its own.
function flinchingLetters(text: string) {
  const words = text.split(" ");
  return words.map((word, wordIndex) => (
    <Fragment key={word}>
      {wordIndex > 0 ? " " : null}
      <span className="inline-block whitespace-nowrap">
        {Array.from(word).map((letter, letterIndex) => {
          const isLastStop = wordIndex === words.length - 1 && letter === ".";
          return (
            <span
              key={`${letter}${letterIndex}`}
              data-flinch
              // The full stop is the same amber dot that falls down the stack.
              className={`inline-block ${isLastStop ? "text-accent" : ""}`}
            >
              {letter}
            </span>
          );
        })}
      </span>
    </Fragment>
  ));
}

interface AttackHeadlineProps {
  /** The section is labelled by this heading. */
  id: string;
}

/* ── Headline ── */
// Three short lines set as large as the column allows. Assistive tech gets
// the sentence once, whole; the split copy is for the eye only. A second-level
// heading: it opens a section of the home page, whose one h1 is the hero's.
export function AttackHeadline({ id }: AttackHeadlineProps) {
  return (
    <h2
      id={id}
      className="text-[clamp(3.25rem,16.5vw,6.5rem)] font-bold leading-[0.92] lg:text-[clamp(4.5rem,8.2vw,7.75rem)]"
    >
      <span className="sr-only">{intro.headline}</span>
      <span aria-hidden="true">
        {intro.lines.map((line, lineIndex) => (
          <span
            key={line.text}
            className={RISE}
            style={{ transitionDelay: `${lineIndex * 90}ms` }}
          >
            {line.flinches ? flinchingLetters(line.text) : line.text}
          </span>
        ))}
      </span>
    </h2>
  );
}
