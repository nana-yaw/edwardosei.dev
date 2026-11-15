import { layerList, layers } from "@/data/breakIt";

interface LayerListProps {
  /** Layers that have stopped something at least once. */
  setOffLayers: readonly number[];
}

/* ── What each layer does ── */
// The plain-words version of the stack, readable with scripts off. With them
// on, a number takes the accent and a filled square once its layer has
// stopped something, and the item says so in words, which turns the list into
// a quiet score card that does not lean on colour. Its headings sit one and
// two levels under the section's own, which is a second-level heading.
export function LayerList({ setOffLayers }: LayerListProps) {
  return (
    <div className="mx-auto w-full max-w-page px-4 pb-28 pt-20 sm:px-8 lg:px-12 lg:pb-36 lg:pt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
        <h3 className="text-section">{layerList.title}</h3>
        {setOffLayers.length > 0 ? (
          <p className="tabular-nums text-muted">
            {layerList.progress(setOffLayers.length, layers.length)}
          </p>
        ) : null}
      </div>
      <ol
        role="list"
        className="mt-12 grid gap-x-12 border-b border-border sm:grid-cols-2 lg:grid-cols-3"
      >
        {layers.map((layer, index) => {
          const isSetOff = setOffLayers.includes(index);
          return (
            <li key={layer.name} className="border-t border-border py-8">
              <span
                aria-hidden="true"
                className={`flex items-center gap-3 font-stretch-[var(--stretch-display)] text-title font-bold tabular-nums ${
                  isSetOff ? "text-accent" : "text-muted"
                }`}
              >
                {index + 1}
                {isSetOff ? <span data-set-off className="block size-2.5 bg-accent" /> : null}
              </span>
              <h4 className="mt-3 text-title">{layer.name}</h4>
              {isSetOff ? <p className="sr-only">{layerList.setOff}</p> : null}
              <p className="mt-2 max-w-[38ch] text-muted">{layer.detail}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
