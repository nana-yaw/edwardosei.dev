/* ── The screens ──────────────────────────────────── */
// The made-up product, painted onto offscreen 2D canvases for the 3D scene:
// an order screen for the front wall, a checkout for the phone and a banner
// for each notification. Real words and numbers in the page's own typeface.
// Each is laid out in the pixels of its own texture, on whole pixels, and
// sized for a 1440 wide window, where nothing ends up under about ten CSS
// pixels on screen. At a 1280 wide window, the narrowest the two-column
// layout gets, the smallest strings are about nine. Every word comes from
// src/data/heroPicture.ts and every colour from the style preset.

import { CanvasTexture, SRGBColorSpace } from "three";
import { checkout, dashboard, type Notification } from "@/data/heroPicture";
import { type NotificationStyle, type Screen, type Tone } from "./presets/types";
import { type ScreenSize } from "./stage";

/** What painting needs from the page: its colours resolved, and its typeface. */
export interface Painter {
  /** Turns one of the preset's CSS colours into a string a 2D canvas accepts. */
  resolve: (css: string) => string;
  /** The page's own font family, read from computed style once its fonts have loaded. */
  family: string;
}

interface Ink {
  size: number;
  tone: Tone;
  weight?: number;
  align?: CanvasTextAlign;
  /** Longer text is narrowed to fit, never clipped. */
  maxWidth?: number;
}

type Draw = CanvasRenderingContext2D;

/** A notification's canvas, in pixels. Its plane takes the same proportions. */
export const NOTE_PIXELS = { width: 640, height: 232 } as const;

function surface({ width, height }: ScreenSize): { canvas: HTMLCanvasElement; context: Draw } {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("A hero screen could not be painted: no 2D canvas context.");
  return { canvas, context };
}

/** Bound to one canvas: text and rounded panels in the preset's tones, always on whole pixels. */
function tools(context: Draw, { resolve, family }: Painter) {
  return {
    text(value: string, x: number, baseline: number, { size, tone, weight = 500, align = "left", maxWidth }: Ink) {
      context.font = `${weight} ${size}px ${family}`;
      context.textAlign = align;
      context.fillStyle = resolve(tone);
      context.fillText(value, Math.round(x), Math.round(baseline), maxWidth);
    },
    width(value: string, size: number, weight: number) {
      context.font = `${weight} ${size}px ${family}`;
      return context.measureText(value).width;
    },
    panel(x: number, y: number, width: number, height: number, radius: number, fill: Tone | null, stroke?: Tone) {
      context.beginPath();
      context.roundRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height), radius);
      if (fill) {
        context.fillStyle = resolve(fill);
        context.fill();
      }
      if (stroke) {
        context.lineWidth = 4;
        context.strokeStyle = resolve(stroke);
        context.stroke();
      }
    },
    dot(x: number, y: number, radius: number, tone: Tone) {
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = resolve(tone);
      context.fill();
    },
  };
}

/* ── The front wall: a shop's orders ── */
// 2048 by 1266. The right fifth of the wall stands behind the phone, so
// everything that has to be read is in the left four fifths. Few things,
// set large: a title, three counts, three orders, a week of bars. Counts and
// statuses, one currency, and bars that go up and down like an ordinary week.
export function paintDashboard(size: ScreenSize, painter: Painter, screen: Screen): HTMLCanvasElement {
  const { canvas, context } = surface(size);
  const { text, panel, dot } = tools(context, painter);
  const { tones } = screen;
  const round = Math.round(size.width * screen.cornerRadius);
  panel(0, 0, size.width, size.height, 0, tones.surface);

  // Top bar: a mark, the page's name, a search field, whether the shop is open.
  panel(84, 60, 76, 76, 18, tones.ink);
  text(dashboard.title, 190, 130, { size: 92, tone: tones.ink, weight: 700 });
  panel(560, 48, 560, 100, 50, tones.panel, tones.line);
  context.beginPath();
  context.arc(618, 94, 17, 0, Math.PI * 2);
  context.moveTo(631, 107);
  context.lineTo(646, 122);
  context.lineWidth = 6;
  context.strokeStyle = painter.resolve(tones.quiet);
  context.stroke();
  text(dashboard.search, 668, 114, { size: 50, tone: tones.quiet });
  panel(1170, 54, 286, 88, 44, null, tones.line);
  dot(1222, 98, 13, tones.accent);
  text(dashboard.open, 1256, 116, { size: 52, tone: tones.ink, weight: 600 });
  dot(1900, 98, 44, tones.panel);
  panel(0, 190, size.width, 4, 0, tones.line);

  // Three counts.
  dashboard.figures.forEach((figure, index) => {
    const x = 84 + index * 468;
    panel(x, 244, 440, 262, round, tones.panel);
    text(figure.label, x + 40, 326, { size: 52, tone: tones.quiet });
    text(figure.value, x + 38, 462, { size: 128, tone: tones.ink, weight: 700 });
  });
  panel(1488, 244, 600, 262, round, tones.panel);

  // Today's orders: a number, what was ordered, what it came to, where it stands.
  panel(84, 556, 908, 626, round, tones.panel);
  text(dashboard.listTitle, 124, 646, { size: 60, tone: tones.ink, weight: 600 });
  dashboard.orders.forEach((order, index) => {
    const top = 690 + index * 160;
    panel(124, top, 828, 4, 0, tones.line);
    text(order.id, 124, top + 104, { size: 58, tone: tones.ink, weight: 600 });
    text(order.items, 336, top + 104, { size: 54, tone: tones.quiet });
    text(order.amount, 706, top + 104, { size: 58, tone: tones.ink, weight: 600, align: "right" });
    const settled = order.status === dashboard.settled;
    panel(738, top + 36, 214, 92, 46, settled ? tones.accent : null, settled ? undefined : tones.line);
    text(order.status, 845, top + 100, {
      size: 50,
      tone: settled ? tones.onAccent : tones.quiet,
      weight: 600,
      align: "center",
      maxWidth: 190,
    });
  });

  // Orders per day: plain bars, today's in the accent.
  panel(1020, 556, 440, 626, round, tones.panel);
  text(dashboard.chartTitle, 1056, 646, { size: 52, tone: tones.ink, weight: 600, maxWidth: 368 });
  const most = Math.max(...dashboard.counts);
  dashboard.counts.forEach((count, index) => {
    const x = 1056 + index * 54;
    const height = Math.round((count / most) * 340);
    panel(x, 1076 - height, 36, height, 10, index === dashboard.today ? tones.accent : tones.line);
    text(dashboard.days[index], x + 18, 1146, { size: 48, tone: tones.quiet, align: "center" });
  });
  panel(1488, 556, 600, 626, round, tones.panel);
  return canvas;
}

/* ── The phone: one order's checkout ── */
// 640 by 1120. The top of the screen is left quiet: that is where the
// notifications land. Four things: whose order, what is in it, the total,
// the button.
export function paintCheckout(size: ScreenSize, painter: Painter, screen: Screen): HTMLCanvasElement {
  const { canvas, context } = surface(size);
  const { text, panel } = tools(context, painter);
  const { tones } = screen;
  panel(0, 0, size.width, size.height, 0, tones.surface);
  text(checkout.title, 44, 400, { size: 74, tone: tones.ink, weight: 700 });
  text(checkout.customer, 44, 474, { size: 58, tone: tones.quiet });
  panel(32, 524, 576, 150, 30, tones.panel);
  text(checkout.line.label, 68, 620, { size: 60, tone: tones.quiet });
  text(checkout.line.value, 572, 620, { size: 60, tone: tones.ink, weight: 600, align: "right" });
  text(checkout.totalLabel, 44, 798, { size: 64, tone: tones.ink, weight: 600 });
  text(checkout.total, 596, 806, { size: 96, tone: tones.ink, weight: 700, align: "right" });
  panel(32, 872, 576, 164, 82, tones.accent);
  text(checkout.pay, 320, 978, { size: 72, tone: tones.onAccent, weight: 700, align: "center", maxWidth: 500 });
  panel(240, 1076, 160, 12, 6, tones.line);
  return canvas;
}

/* ── A notification ── */
// A small dark banner with round corners on a clear canvas. What happened
// is the title, alone on its line; how much is set apart under it, larger
// and in the accent, with the order it belongs to beside it.
export function paintNote(note: Notification, painter: Painter, style: NotificationStyle): HTMLCanvasElement {
  const { canvas, context } = surface(NOTE_PIXELS);
  const { width, height } = NOTE_PIXELS;
  const { text, panel, dot, width: measure } = tools(context, painter);
  panel(2, 2, width - 4, height - 4, Math.round(height * style.cornerRadius), style.card, style.detail);
  dot(54, 76, 15, style.dot);
  text(note.title, 88, 96, { size: 62, tone: style.title, weight: 600, maxWidth: width - 88 - 40 });
  text(note.amount, 44, 188, { size: 82, tone: style.amount, weight: 700 });
  const taken = measure(note.amount, 82, 700);
  text(note.detail, width - 40, 186, { size: 62, tone: style.detail, align: "right", maxWidth: width - 44 - taken - 40 - 28 });
  return canvas;
}

/** A screen's texture: mipmapped and trilinear by default, and sampled as widely as the renderer allows, because it is seen at an angle. */
export function toTexture(canvas: HTMLCanvasElement, anisotropy: number): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
}
