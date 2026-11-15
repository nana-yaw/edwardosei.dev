"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, AgXToneMapping, NeutralToneMapping, PCFShadowMap, type ToneMapping } from "three";
import { build } from "@/data/heroPicture";
import { OVERSCAN } from "./framing";
import { HeroScene, type HeroSceneProps } from "./HeroScene";
import { CHIP_HEIGHT, snap, type StageBox } from "./overlay";
import { clayPreset } from "./presets/clay";
import { type StylePreset } from "./presets/types";
import { VIEW_DIRECTION } from "./projection";

type HeroCanvasProps = Omit<HeroSceneProps, "style" | "family" | "tokens" | "box">;

const TONE_MAPPINGS: Record<StylePreset["rendering"]["toneMapping"], ToneMapping> = {
  neutral: NeutralToneMapping,
  agx: AgXToneMapping,
  aces: ACESFilmicToneMapping,
};

/** How far back the camera stands, and how deep a slice of the world it draws: tight round the model, for depth precision. */
const CAMERA_DISTANCE = 40;
const CAMERA_SLICE = 7;

// A word: the page's one typeface, narrow and medium, on a chip of the
// page's own dark so it reads over clay, pipe and screen alike. The
// brackets are what make it code. About the size of the labels beside the
// picture. Its height is `CHIP_HEIGHT`, set on each chip below, so the word
// is placed with the same number it is sized with. It waits unseen until
// its pulse sets off.
const TOKEN =
  "absolute left-0 top-0 box-border flex origin-left items-center whitespace-nowrap rounded-sm bg-background/85 px-1.5 text-[0.875rem] font-medium leading-none text-accent opacity-0 will-change-transform [font-stretch:75%]";

/** The page's own font family, once its fonts have loaded: the screens are painted in it, so they must not be painted before. */
function usePageFamily(): string | null {
  const [family, setFamily] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    const read = () => {
      if (mounted) setFamily(getComputedStyle(document.body).fontFamily);
    };
    // If the fonts fail the screens are still painted, in whatever the page fell back to.
    void document.fonts.ready.then(read, read);
    return () => {
      mounted = false;
    };
  }, []);
  return family;
}

// The browser keeps a layout size in 64ths of a CSS pixel and cuts off the
// rest, and the renderer then rounds that size times the pixel ratio down.
// So a size the layout cannot hold exactly would lose a whole device pixel.
const LAYOUT_STEP = 1 / 64;

/** `size` as a whole number of device pixels, in CSS pixels the layout can hold: exact where it can, a hair over where it cannot, so it still rounds down to that whole number. */
function heldSize(size: number, ratio: number): number {
  const whole = Math.round(size * ratio) / ratio;
  return Number.isInteger(whole / LAYOUT_STEP) ? whole : whole + LAYOUT_STEP * 1.5;
}

/**
 * Sizes the canvas's box: the stage and the overscan round it, with every
 * edge on a whole device pixel, so the drawing buffer has one pixel for each
 * device pixel of the box and CSS does not scale it on its way to the
 * screen. That is exact at a pixel ratio of 1 or 2. At a ratio in between
 * the buffer still gets its whole number of pixels, and is stretched across
 * the box by under a twentieth of one (see `heldSize`). `boxRef` is kept
 * current for the scene.
 */
function useSnappedBox(holderRef: RefObject<HTMLDivElement | null>, boxRef: RefObject<StageBox>): void {
  useLayoutEffect(() => {
    const element = holderRef.current;
    const stage = element?.parentElement;
    if (!element || !stage) return;
    const fit = () => {
      const ratio = Math.min(window.devicePixelRatio, 2);
      const rect = stage.getBoundingClientRect();
      const left = snap(rect.left - rect.width * OVERSCAN.x, ratio);
      const top = snap(rect.top - rect.height * OVERSCAN.y, ratio);
      const right = snap(rect.right + rect.width * OVERSCAN.x, ratio);
      const bottom = snap(rect.bottom + rect.height * OVERSCAN.y, ratio);
      element.style.left = `${left - rect.left}px`;
      element.style.top = `${top - rect.top}px`;
      element.style.width = `${heldSize(right - left, ratio)}px`;
      element.style.height = `${heldSize(bottom - top, ratio)}px`;
      boxRef.current = { width: rect.width, height: rect.height, left: rect.left - left, top: rect.top - top, pixelRatio: ratio };
    };
    // A window dragged to a screen with another pixel ratio changes neither
    // the stage's size nor the window's, so the two watchers below never
    // hear of it. A resolution query can only say that the ratio is no
    // longer what it was, so it is asked again after every change.
    let ratioQuery: MediaQueryList | null = null;
    const fitToRatio = () => {
      fit();
      ratioQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      ratioQuery.addEventListener("change", fitToRatio, { once: true });
    };
    fitToRatio();
    const watcher = new ResizeObserver(fit);
    watcher.observe(stage);
    window.addEventListener("resize", fit);
    return () => {
      watcher.disconnect();
      window.removeEventListener("resize", fit);
      ratioQuery?.removeEventListener("change", fitToRatio);
    };
  }, [holderRef, boxRef]);
}

/* ── Canvas ── */
// Orthographic, from the direction the stage is measured in. Antialiased,
// at the device's own pixel ratio up to 2, on the faster GPU where there are
// two. Soft shadows from the key light. Drawn on demand: once the build is
// over it stays still, and drawing nothing costs nothing. Decorative for
// assistive tech; the still underneath keeps the diagram's name.
export function HeroCanvas(scene: HeroCanvasProps) {
  // The site has one look, and the hero wears it.
  const style = clayPreset;
  const holder = useRef<HTMLDivElement>(null);
  const tokens = useRef<(HTMLSpanElement | null)[]>([]);
  const box = useRef<StageBox>({ width: 1, height: 1, left: 0, top: 0, pixelRatio: 1 });
  const family = usePageFamily();
  useSnappedBox(holder, box);

  return (
    <div ref={holder} className="absolute">
      {family === null ? null : (
        <Canvas
          orthographic
          shadows={{ type: PCFShadowMap }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: TONE_MAPPINGS[style.rendering.toneMapping],
            toneMappingExposure: style.rendering.exposure,
          }}
          frameloop="demand"
          dpr={[1, 2]}
          camera={{
            position: [
              VIEW_DIRECTION[0] * CAMERA_DISTANCE,
              VIEW_DIRECTION[1] * CAMERA_DISTANCE,
              VIEW_DIRECTION[2] * CAMERA_DISTANCE,
            ],
            near: CAMERA_DISTANCE - CAMERA_SLICE,
            far: CAMERA_DISTANCE + CAMERA_SLICE,
          }}
          resize={{ scroll: false }}
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        >
          <HeroScene {...scene} style={style} family={family} tokens={tokens} box={box} />
        </Canvas>
      )}
      {/* Decoration only: the same words are in no label, and the picture's name is on the still. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {build.plumbing.tokens.map((token, index) => (
          <span
            key={token}
            ref={(node) => {
              tokens.current[index] = node;
            }}
            data-hero-token
            className={TOKEN}
            style={{ height: CHIP_HEIGHT }}
          >
            {token}
          </span>
        ))}
      </div>
    </div>
  );
}
