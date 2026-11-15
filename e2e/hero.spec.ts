import { expect, test, type Locator, type Page } from "@playwright/test";
import { REST_AT } from "../src/components/hero/timeline";
import { build } from "../src/data/heroPicture";
import { CANVAS_MIN_WIDTH, IDEA_AT_REST, VIEWPORTS, keptStill, readyCanvas, still } from "./support";

/* ── The 3D hero ── */
// What the 3D checklist in CLAUDE.md asks to be measured, not assumed.

/** Hero budget from the 3D checklist in CLAUDE.md. */
const BUDGET = { drawCalls: 60, vertices: 25_000, shadowLights: 1 };

/** As much of three's scene graph as the budget test reads. */
interface SceneNode {
  isScene?: boolean;
  isLight?: boolean;
  castShadow?: boolean;
  traverse(visit: (node: SceneNode) => void): void;
}

declare global {
  interface Window {
    __THREE_DEVTOOLS__?: EventTarget;
    __scenes?: SceneNode[];
  }
}

/** The build has played out: its clock sits on the rest mark. */
async function waitForRest(page: Page): Promise<void> {
  await page.locator(readyCanvas).waitFor();
  await expect
    .poll(() => page.evaluate(() => window.__r3f?.time() ?? null), { timeout: 20_000 })
    .toBeCloseTo(REST_AT, 4);
}

/**
 * The share of an element's box that is not the page's own ground, read from
 * a screenshot. A WebGL canvas gives its pixels up once a frame is shown, so
 * they cannot be read back from the page.
 */
async function paintedShare(page: Page, element: Locator): Promise<number> {
  const shot = await element.screenshot();
  return page.evaluate(async (png) => {
    const picture = await createImageBitmap(await (await fetch(`data:image/png;base64,${png}`)).blob());
    const context = new OffscreenCanvas(picture.width, picture.height).getContext("2d");
    if (!context) return 0;
    context.drawImage(picture, 0, 0);
    const { data } = context.getImageData(0, 0, picture.width, picture.height);
    // The box's corner lies in the overscan, where only the page shows.
    const ground = [data[0], data[1], data[2]];
    let painted = 0;
    for (let offset = 0; offset < data.length; offset += 4) {
      const distance =
        Math.abs(data[offset] - ground[0]) +
        Math.abs(data[offset + 1] - ground[1]) +
        Math.abs(data[offset + 2] - ground[2]);
      if (distance > 24) painted += 1;
    }
    return painted / (data.length / 4);
  }, shot.toString("base64"));
}

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    if (viewport.width >= CANVAS_MIN_WIDTH) {
      test("the hero paints and stays inside the WebGL budget", async ({ page }) => {
        // three tells its devtools hook about every scene it builds. Listening
        // there lets the test count lights without the page publishing its scene.
        await page.addInitScript(() => {
          const hook = new EventTarget();
          const scenes: SceneNode[] = [];
          hook.addEventListener("observe", (event) => {
            const seen = (event as CustomEvent<SceneNode>).detail;
            if (seen?.isScene) scenes.push(seen);
          });
          window.__THREE_DEVTOOLS__ = hook;
          window.__scenes = scenes;
        });
        await page.goto("/portfolio");
        await page.locator(readyCanvas).waitFor();

        // Parts are added as the build goes and the notifications pass
        // through, so the busiest frame is not the last one: follow the
        // counter the whole way to rest and keep its highest reading.
        let peakDrawCalls = 0;
        await expect
          .poll(
            async () => {
              const reading = await page.evaluate(() => {
                const dev = window.__r3f;
                return dev ? { drawCalls: dev.info.render.calls, time: dev.time() } : null;
              });
              if (!reading) return null;
              peakDrawCalls = Math.max(peakDrawCalls, reading.drawCalls);
              return reading.time;
            },
            { intervals: [50], timeout: 20_000 },
          )
          .toBeCloseTo(REST_AT, 4);

        const probe = await page.evaluate(() => {
          const dev = window.__r3f;
          if (!dev) return null;
          let shadowLights = 0;
          (window.__scenes ?? []).forEach((scene) =>
            scene.traverse((node) => {
              if (node.isLight && node.castShadow) shadowLights += 1;
            }),
          );
          return {
            vertices: dev.vertices.perInstance,
            shadowLights,
            scenes: window.__scenes?.length ?? 0,
          };
        });

        expect(probe, "window.__r3f is only published by dev builds").not.toBeNull();
        expect(peakDrawCalls).toBeGreaterThan(0);
        expect(peakDrawCalls).toBeLessThan(BUDGET.drawCalls);
        expect(probe?.vertices).toBeGreaterThan(0);
        expect(probe?.vertices).toBeLessThan(BUDGET.vertices);
        expect(probe?.scenes, "three's devtools hook saw the hero's scene").toBeGreaterThan(0);
        expect(probe?.shadowLights).toBe(BUDGET.shadowLights);

        // With the still hidden behind it, what shows in the box is the
        // canvas. A blank one paints nothing; the model and its floor cover
        // well over a quarter.
        await expect(page.locator(still)).toHaveCSS("opacity", "0");
        const share = await paintedShare(page, page.locator("[data-hero-canvas] canvas"));
        expect(share).toBeGreaterThan(0.25);
      });

      test("the build plays out and leaves the idea live and taking payments", async ({ page }) => {
        await page.goto("/portfolio");
        await waitForRest(page);

        // Every label the build lights is lit, the idea's two endings included.
        const figure = page.locator("[data-hero-figure]");
        await expect(figure.locator("[data-step]").first()).toBeVisible();
        await expect(figure.locator("[data-step]:not([data-lit])")).toHaveCount(0);

        const idea = figure.locator("p[data-idea]");
        await expect(idea).toHaveText(IDEA_AT_REST);
        await expect(idea).toHaveCSS("opacity", "1");
        const endings = idea.locator("[data-step]");
        await expect(endings).toHaveCount(2);
        for (const ending of await endings.all()) {
          await expect(ending).toHaveCSS("opacity", "1");
        }
      });
    } else {
      test("a phone keeps the still picture and loads no 3D code", async ({ page }) => {
        const requests: string[] = [];
        page.on("request", (request) => requests.push(request.url()));

        await page.goto("/portfolio");
        await page.locator(keptStill).waitFor();
        await page.evaluate(() => window.scrollTo(0, window.innerHeight));
        await page.waitForTimeout(800);

        await expect(page.getByRole("img", { name: build.diagramLabel })).toBeVisible();
        await expect(page.locator(still)).toHaveCSS("opacity", "1");
        await expect(page.locator("[data-hero-canvas]")).toHaveCount(0);
        await expect(page.locator("canvas")).toHaveCount(0);
        expect(requests.filter((url) => /three/i.test(url))).toHaveLength(0);
      });
    }
  });
}

test.describe("on-demand rendering", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("no frames are drawn while nothing moves", async ({ page }) => {
    await page.goto("/portfolio");
    await waitForRest(page);
    await page.waitForTimeout(800);

    const before = await page.evaluate(() => window.__r3f?.frames() ?? null);
    await page.waitForTimeout(1000);
    const after = await page.evaluate(() => window.__r3f?.frames() ?? null);

    expect(before).not.toBeNull();
    expect(after).toBe(before);
  });
});

test.describe("device pixel ratio", () => {
  test.use({ viewport: { width: 820, height: 1180 }, deviceScaleFactor: 3 });

  test("is capped at 2 on a 3x screen", async ({ page }) => {
    await page.goto("/portfolio");
    await page.locator(readyCanvas).waitFor();
    const ratio = await page.evaluate(() => window.__r3f?.pixelRatio ?? null);
    expect(ratio).toBe(2);
  });
});
