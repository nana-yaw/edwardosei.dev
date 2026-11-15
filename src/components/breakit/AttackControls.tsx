import { useState, type FormEvent } from "react";
import { attackButtons, form, type ButtonAttackKind } from "@/data/breakIt";

interface AttackControlsProps {
  /** False until the page is interactive, so nothing can submit before then. */
  ready: boolean;
  onAttack: (kind: ButtonAttackKind) => void;
  onThrow: (typed: string) => void;
}

/* ── Attack controls ── */
// Three ready-made attacks and a box for the visitor's own. Nothing here
// talks to a server: the form has no action, the field has no name, and the
// submit handler stops the browser before it can navigate.
export function AttackControls({ ready, onAttack, onThrow }: AttackControlsProps) {
  // Lives in memory for as long as the page is open, and nowhere else.
  const [typed, setTyped] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onThrow(typed);
  }

  return (
    <div>
      <ul role="list" className="grid grid-cols-3 gap-2 sm:gap-3">
        {attackButtons.map((attack) => (
          <li key={attack.kind}>
            <button
              type="button"
              disabled={!ready}
              onClick={() => onAttack(attack.kind)}
              className="group flex h-full w-full flex-col gap-2 border border-border bg-surface p-2.5 text-left hover:border-accent disabled:hover:border-border disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-0.5 active:border-accent active:bg-accent active:text-accent-ink sm:gap-3 sm:p-4"
            >
              {/* The request about to be thrown: the same dot that falls down the stack. */}
              <span
                aria-hidden="true"
                className="block size-2 rounded-full bg-accent group-active:bg-accent-ink sm:size-2.5"
              />
              <span className="block font-stretch-[var(--stretch-display)] text-sm font-bold leading-tight sm:text-lg sm:leading-tight">
                {attack.label}
              </span>
              <span className="mt-auto hidden text-sm leading-snug text-muted group-active:text-accent-ink sm:block">
                {attack.detail}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} noValidate className="mt-5">
        <label htmlFor="own-attack" className="block text-sm text-muted">
          {form.label}
        </label>
        <div className="mt-2 flex">
          <input
            id="own-attack"
            type="text"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            disabled={!ready}
            placeholder={form.placeholder}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="h-12 min-w-0 flex-1 border border-r-0 border-border bg-surface px-4 text-base placeholder:text-muted focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!ready}
            className="h-12 shrink-0 whitespace-nowrap bg-accent px-5 font-semibold text-accent-ink hover:bg-foreground active:translate-y-0.5 active:bg-muted disabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {form.submit}
          </button>
        </div>
      </form>

      <p className="mt-3 text-sm text-muted">{form.notice}</p>
      <noscript>
        <p className="mt-2 text-sm text-muted">{form.noScript}</p>
      </noscript>
    </div>
  );
}
