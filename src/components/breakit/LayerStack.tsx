import { layerList, type LabLayer } from "@/data/breakIt";
import {
  DOT_POOL,
  DOT_RADIUS,
  RAIL,
  STAGE_VIEW,
  labelTopPercent,
  plateFaces,
} from "@/lib/breakit/stageGeometry";

interface LayerStackProps {
  /** Top plate first. */
  layers: readonly LabLayer[];
  /** Accessible name for the drawing. */
  label: string;
  /** Layer currently holding a stopped request, or null. */
  caughtLayer: number | null;
  className?: string;
}

interface LayerLabelsProps {
  /** Top plate first. */
  layers: readonly LabLayer[];
  /** Layer currently holding a stopped request, or null. */
  caughtLayer: number | null;
  /** Layers that have stopped something at least once. */
  setOffLayers: readonly number[];
  className?: string;
}

// Plates settle into place one after another on first paint. CSS only, on a
// wrapper, so it never fights the script-driven jolts on the plate inside.
const SETTLE =
  "transition-[translate,opacity] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] starting:-translate-y-6 starting:opacity-0";

/* ── Layer stack ── */
// The six plates, the rail a request falls along and a pool of dots for the
// choreography to move. Rendered still and complete on the server; scripts
// only ever nudge transforms and opacity on the data-* hooks.
export function LayerStack({ layers, label, caughtLayer, className = "" }: LayerStackProps) {
  // Painted from the base up so each plate overlaps the one below it.
  const paintOrder = layers.map((_, index) => layers.length - 1 - index);

  return (
    <div
      className={`relative ${className}`}
      style={{ aspectRatio: `${STAGE_VIEW.width} / ${STAGE_VIEW.height}` }}
    >
      <svg
        viewBox={`0 0 ${STAGE_VIEW.width} ${STAGE_VIEW.height}`}
        role="img"
        aria-label={label}
        className="block h-full w-full"
        fill="none"
        strokeLinejoin="round"
      >
        {paintOrder.map((index) => {
          const faces = plateFaces(index);
          const isCaught = caughtLayer === index;
          return (
            <g
              key={index}
              className={SETTLE}
              // Base first, so the stack builds upward.
              style={{ transitionDelay: `${(layers.length - 1 - index) * 70}ms` }}
            >
              <g
                data-plate={index}
                stroke={isCaught ? "var(--accent)" : "var(--muted)"}
                strokeWidth={isCaught ? 2.5 : 1.25}
              >
                <polygon vectorEffect="non-scaling-stroke" fill="var(--bg)" points={faces.front} />
                <polygon vectorEffect="non-scaling-stroke" fill="var(--bg)" points={faces.side} />
                <polygon vectorEffect="non-scaling-stroke" fill="var(--surface)" points={faces.top} />
                {/* A resting tint, so the result is readable with no motion at all. */}
                <polygon
                  stroke="none"
                  fill="var(--accent)"
                  opacity={isCaught ? 0.16 : 0}
                  points={faces.top}
                />
                <polygon
                  data-plate-flash={index}
                  stroke="none"
                  fill="var(--accent)"
                  opacity={0}
                  points={faces.top}
                />
              </g>
            </g>
          );
        })}
        <line
          vectorEffect="non-scaling-stroke"
          stroke="var(--border)"
          strokeWidth={1.5}
          x1={RAIL.x}
          y1={RAIL.top}
          x2={RAIL.x}
          y2={RAIL.bottom}
        />
        <line
          data-rail-fill
          vectorEffect="non-scaling-stroke"
          stroke="var(--accent)"
          strokeWidth={2.5}
          opacity={0}
          x1={RAIL.x}
          y1={RAIL.top}
          x2={RAIL.x}
          y2={RAIL.bottom}
        />
        {Array.from({ length: DOT_POOL }, (_, index) => (
          <circle
            key={index}
            data-dot
            cx={RAIL.x}
            cy={RAIL.top}
            r={DOT_RADIUS}
            fill="var(--accent)"
            opacity={0}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Layer names ── */
// Set level with their plates, as on the home page stack. Needs to be as tall
// as the drawing beside it; shown from 640px up. On a phone the verdict takes
// this column and the names live in the list further down. A name too long
// for its column wraps rather than running past it. A layer that has stopped
// something gets a filled square on its dash and says so in words, so the
// colour is never the only sign.
export function LayerLabels({
  layers,
  caughtLayer,
  setOffLayers,
  className = "",
}: LayerLabelsProps) {
  return (
    <ol role="list" className={`relative text-[0.9375rem] leading-tight ${className}`}>
      {layers.map((layer, index) => {
        const isCaught = caughtLayer === index;
        const isSetOff = setOffLayers.includes(index);
        return (
          <li
            key={layer.name}
            className="absolute inset-x-0 -translate-y-1/2 text-balance"
            style={{ top: `${labelTopPercent(index)}%` }}
          >
            <span
              data-layer-label
              className={`flex items-center gap-2 ${isCaught ? "font-bold text-accent" : ""}`}
            >
              <span
                aria-hidden="true"
                className={`relative block h-px w-4 shrink-0 ${isSetOff ? "bg-accent" : "bg-border"}`}
              >
                {isSetOff ? (
                  <span
                    data-set-off
                    className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 bg-accent"
                  />
                ) : null}
              </span>
              <span className={`tabular-nums ${isCaught ? "" : "text-muted"}`}>{index + 1}</span>
              {layer.name}
              {isSetOff ? <span className="sr-only">, {layerList.setOff}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
