import { AdinkraSymbol } from "@/components/adinkra/AdinkraSymbol";
import {
  buildFlow,
  buildPartsSection,
  credit,
  flowQuestions,
  parts,
  spokenStep,
  type BuildPart,
} from "@/data/buildFlow";
import { showAdinkra } from "@/data/culture";
import { FlowSteps, type FlowStep } from "./FlowSteps";
import styles from "./BuildFlow.module.css";

/** What a part adds to its step when the Adinkra symbols are shown. */
function withSymbol(part: BuildPart): Pick<FlowStep, "mark" | "byline" | "note"> {
  return {
    mark: <AdinkraSymbol id={part.id} label={part.name} className={styles.symbol} />,
    byline: (
      <span lang="tw" className={styles.twi}>
        {part.name}
      </span>
    ),
    note: (
      <dl className={styles.note}>
        <dt>{buildFlow.labels.meaning}</dt>
        <dd>{part.meaning}</dd>
      </dl>
    ),
  };
}

/* ── What goes into a build ── */
// The six parts as a flow on one pipe, each with the question asked there.
// What a node carries is settled here, on the server: its Adinkra symbol with
// the Twi name and meaning, or, with the symbols switched off, its number.
// The steps only receive the result, so with the switch off no symbol and no
// name is sent to the browser at all.
export function BuildFlow() {
  const titleId = `${buildPartsSection.id}-title`;
  const steps = parts.map((part, index): FlowStep => {
    const question = flowQuestions[part.id];
    const carried = showAdinkra
      ? withSymbol(part)
      : { mark: <span className={styles.number}>{index + 1}</span> };
    return {
      part: part.part,
      question,
      explanation: part.link,
      spoken: spokenStep(part.part, question),
      ...carried,
    };
  });

  return (
    <section
      id={buildPartsSection.id}
      aria-labelledby={titleId}
      className="mx-auto w-full max-w-page px-4 pt-24 sm:px-8 lg:px-12 lg:pt-32"
    >
      {/* The row gap leaves room for the pipe's branch under the heading. */}
      <div className="grid items-end gap-x-16 gap-y-9 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <h2 id={titleId} className="max-w-[12ch] text-section">
          {buildPartsSection.title}
        </h2>
        <p className="max-w-[56ch] text-lede text-muted">
          {showAdinkra ? buildFlow.ledeWithSymbols : buildFlow.lede}
        </p>
      </div>
      <FlowSteps steps={steps} askLabel={buildFlow.labels.question} />
      {showAdinkra ? <p className="mt-10 max-w-[80ch] text-sm text-muted">{credit}</p> : null}
    </section>
  );
}
