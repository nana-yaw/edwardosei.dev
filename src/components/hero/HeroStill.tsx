import Image from "next/image";
import still from "./hero-still.webp";
import styles from "./HeroStill.module.css";
import { OVERSCAN } from "./framing";

interface HeroStillProps {
  /** Names the diagram for assistive tech. */
  label: string;
}

// The picture is never wider than this on any screen: the stage (about 46%
// of a wide page, the page less its gutters and the label column below
// that) and the overscan round it.
const SIZES = "(min-width: 1280px) 58vw, (min-width: 640px) calc(128vw - 16rem), 128vw";

// The capture includes the same overscan the canvas has, so the studio
// floor and the model's shadow on it fade out in the picture just as they
// do live. Its background is transparent: past the stage there is only the
// floor and that shadow, fading into the page.
const OVERSCAN_BOX = {
  left: `${-OVERSCAN.x * 100}%`,
  top: `${-OVERSCAN.y * 100}%`,
  width: `${(1 + OVERSCAN.x * 2) * 100}%`,
  height: `${(1 + OVERSCAN.y * 2) * 100}%`,
} as const;

/* ── Still picture ── */
// The finished, lit state: the default image on a phone, with reduced
// motion, without WebGL and without scripts. A lit render cannot be redrawn
// as flat SVG, so this is the canvas's own last frame, captured with its
// overscan and saved beside this file. Those visitors get a picture and
// never download the 3D code. Capture it again whenever the scene changes.
//
// Where the build is about to play (wide screen, motion allowed, scripts on)
// the still is held unseen, so the build can begin from the bare idea and
// not from a finished picture that then rebuilds. It is only held back, not
// removed: with no canvas after six seconds it shows itself. `data-still` on
// the figure drops the wait when the canvas is known not to be coming, and a
// ready canvas hides the still at once and for good. The stylesheet beside
// this file does all three, and says why it is not done with a transition.
export function HeroStill({ label }: HeroStillProps) {
  return (
    <div data-hero-still className={`absolute inset-0 ${styles.heldBack}`}>
      <Image
        src={still}
        alt={label}
        sizes={SIZES}
        loading="eager"
        className="pointer-events-none absolute max-w-none"
        style={OVERSCAN_BOX}
      />
    </div>
  );
}
