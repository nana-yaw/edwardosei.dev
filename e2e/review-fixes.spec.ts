import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  attackButtons,
  breakItAnchor,
  form,
  layerList,
  layers,
  nastySample,
  stage,
  tally,
  verdicts,
  type OutcomeKind,
} from "../src/data/breakIt";
import { buildPartsSection, parts } from "../src/data/buildFlow";
import { mainId, navItems, scrollButton } from "../src/data/navigation";

const DESKTOP = { width: 1440, height: 900 } as const;
const PHONE = { width: 360, height: 740 } as const;
const [SPAM, NASTY, FLOOD] = attackButtons.map((attack) => attack.label);
const WORK_LINK = navItems[0].label;

/** The one sentence the live region should say for a landed result. */
function sentence(kind: OutcomeKind, tried: number, honest: number, echo: string | null = null) {
  const { layer, line } = verdicts[kind];
  const title =
    layer === null ? stage.passedTitle : stage.caughtTitle(layer + 1, layers[layer].name);
  const said = `${title} ${line} ${tally.spoken(tried, honest)}`;
  return echo === null ? said : `${said} ${stage.echoLabel} ${echo}`;
}

/** Keeps every text the break-it live region takes, in order, on window.said. */
async function recordAnnouncements(region: Locator): Promise<void> {
  await region.evaluate((node) => {
    const said: string[] = [];
    Object.assign(window, { said });
    new MutationObserver(() => {
      const text = node.textContent ?? "";
      if (said.at(-1) !== text) said.push(text);
    }).observe(node, { childList: true, characterData: true, subtree: true });
  });
}

async function spokenSoFar(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    (window as unknown as { said: string[] }).said.filter((text) => text !== ""),
  );
}

async function openBreakIt(page: Page) {
  await page.goto(`/portfolio#${breakItAnchor}`);
  const section = page.locator(`#${breakItAnchor}`);
  const region = section.getByRole("status");
  await recordAnnouncements(region);
  return { section, region };
}

test.describe("break-it speaks only settled results", () => {
  test.use({ viewport: DESKTOP });

  test("one sentence per landed attack, in order, and silence while one falls", async ({ page }) => {
    const { section, region } = await openBreakIt(page);
    await section.getByRole("button", { name: SPAM }).click();
    await expect(region).toHaveText(sentence("spam", 1, 0));

    await section.getByRole("button", { name: FLOOD }).click();
    await expect(region).toHaveText("");
    await expect(region).toHaveText(sentence("flood", 2, 0));
    await page.waitForTimeout(1000);
    expect(await spokenSoFar(page)).toEqual([sentence("spam", 1, 0), sentence("flood", 2, 0)]);
  });

  test("a repeated honest message is announced again, with what was sent", async ({ page }) => {
    const { section, region } = await openBreakIt(page);
    await section.getByLabel(form.label).fill("hello there");
    await section.getByRole("button", { name: form.submit }).click();
    await expect(region).toHaveText(sentence("honest", 0, 1, "hello there"));
    await section.getByRole("button", { name: form.submit }).click();
    await expect(region).toHaveText(sentence("honest", 0, 2, "hello there"));
    expect(await spokenSoFar(page)).toEqual([
      sentence("honest", 0, 1, "hello there"),
      sentence("honest", 0, 2, "hello there"),
    ]);
  });

  test("what the nasty attack sent reaches assistive tech as plain text", async ({ page }) => {
    const { section, region } = await openBreakIt(page);
    await section.getByRole("button", { name: NASTY }).click();
    await expect(region).toHaveText(sentence("nasty", 1, 0, nastySample));
    // The snapshot is YAML, which escapes the sample's quotes.
    expect(await section.ariaSnapshot()).toContain(`${stage.echoLabel} <script>alert(`);
    await expect(section.locator("script")).toHaveCount(0);
  });

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`hammering the buttons gives one sentence (motion: ${reducedMotion})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      const { section, region } = await openBreakIt(page);
      await expect(section.getByRole("button", { name: SPAM })).toBeEnabled();
      // 150 ms apart, timed in the page so the runner's load cannot stretch
      // the gaps: each press comes while the attack before it is still falling.
      await section.evaluate(async (root, names) => {
        const buttons = [...root.querySelectorAll("button")];
        for (const name of names) {
          buttons.find((button) => button.textContent?.startsWith(name))?.click();
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      }, [SPAM, NASTY, FLOOD]);
      await expect(region).toHaveText(sentence("flood", 3, 0));
      await page.waitForTimeout(1000);
      expect(await spokenSoFar(page)).toEqual([sentence("flood", 3, 0)]);
    });
  }
});

test.describe("the scroll button takes keyboard focus with it", () => {
  for (const viewport of [DESKTOP, PHONE]) {
    test(`to the work and back to the top (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/portfolio");
      const workHeading = page.locator("#project").getByRole("heading", { level: 2 });

      await page.getByRole("button", { name: scrollButton.toWork }).focus();
      await page.keyboard.press("Enter");
      await expect(workHeading).toBeFocused();
      await expect(workHeading).toBeInViewport();
      await page.keyboard.press("Tab");
      await expect(page.locator("#project :focus")).toHaveCount(1);

      await page.getByRole("button", { name: scrollButton.toTop }).focus();
      await page.keyboard.press("Enter");
      const topHeading = page.locator(`#${mainId}`).getByRole("heading", { level: 1 });
      await expect(topHeading).toBeFocused();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.keyboard.press("Tab");
      await expect(page.locator("#hero :focus")).toHaveCount(1);
      // Focusable only while they held focus, so they never catch a click.
      await expect(workHeading).not.toHaveAttribute("tabindex");
      await expect(topHeading).not.toHaveAttribute("tabindex");
    });

    test(`mouse presses draw no ring, and a click in the text sets the next Tab (${viewport.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/portfolio");
      const workHeading = page.locator("#project").getByRole("heading", { level: 2 });
      await page.getByRole("button", { name: scrollButton.toWork }).click();
      await expect(workHeading).toBeFocused();
      expect(await workHeading.evaluate((heading) => heading.matches(":focus-visible"))).toBe(false);
      await page.getByRole("button", { name: scrollButton.toTop }).click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

      // Plain text deep in the page, clicked after both presses: the next Tab
      // must carry on from it, not jump back to the top of the content.
      const text = page.locator(`#${breakItAnchor} ol`).last().locator("li p").nth(2);
      await text.click({ position: { x: 5, y: 5 } });
      await page.keyboard.press("Tab");
      const tabbedOnFromText = await text.evaluate((clicked) => {
        const active = document.activeElement;
        if (!active || active === document.body) return false;
        return (clicked.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      });
      expect(tabbedOnFromText).toBe(true);
    });
  }

  test("on a phone it is not taken away while it has focus", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/portfolio");
    await page.evaluate(() => window.scrollTo(0, 3000));
    const button = page.getByRole("button", { name: scrollButton.toTop });
    await button.focus();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    await expect(button).toBeFocused();
    await expect(button).toBeVisible();
    // Once focus leaves, it gets out of the way of the contact links again.
    await page.keyboard.press("Shift+Tab");
    await expect(button).toBeHidden();
  });
});

test.describe("jumping to the work counts as past the hero", () => {
  /** The bar's solid backing stops this far above the bottom of the header's box. */
  const BACKING_TRIM = 8;

  /** The Work heading is below the bar's solid backing, not under it. */
  async function headingClearOfBar(page: Page): Promise<boolean> {
    const heading = await page
      .locator("#project")
      .getByRole("heading", { level: 2 })
      .evaluate((element) => element.getBoundingClientRect().top);
    const backingBottom = await page
      .locator("header")
      .evaluate((bar) => bar.getBoundingClientRect().bottom);
    return heading >= backingBottom - BACKING_TRIM;
  }

  for (const viewport of [DESKTOP, PHONE]) {
    test(`loading /portfolio#project (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/portfolio#project");
      const header = page.locator("header");
      await expect(page.getByRole("button", { name: scrollButton.toTop })).toBeVisible();
      await expect(header).toHaveAttribute("data-nav", "shown");
      await expect(page.locator("#project").getByRole("heading", { level: 2 })).toBeInViewport();
      await page.waitForTimeout(400);
      expect(await headingClearOfBar(page)).toBe(true);

      // From here the bar does what it does after scrolling here: it stays.
      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(400);
      await expect(header).toHaveAttribute("data-nav", "shown");
    });

    test(`the Work link, from the top and from the bar (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/portfolio");
      const header = page.locator("header");
      const toTop = page.getByRole("button", { name: scrollButton.toTop });
      await page.getByRole("button", { name: scrollButton.toWork }).waitFor();

      await header.getByRole("link", { name: WORK_LINK }).click();
      await expect(toTop).toBeVisible();
      await expect(header).toHaveAttribute("data-nav", "shown");
      await page.waitForTimeout(400);
      expect(await headingClearOfBar(page)).toBe(true);

      // Deep in the page, use the bar's own Work link.
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
      await page.waitForTimeout(400);
      await expect(header).toHaveAttribute("data-nav", "shown");
      await header.getByRole("link", { name: WORK_LINK }).click();
      await expect(page.locator("#project").getByRole("heading", { level: 2 })).toBeInViewport();
      await page.waitForTimeout(500);
      await expect(header).toHaveAttribute("data-nav", "shown");
      await expect(toTop).toBeVisible();
      expect(await headingClearOfBar(page)).toBe(true);
    });
  }
});

test("the build flow keeps its six part headings in live, phone and no-JS modes", async ({
  browser,
  baseURL,
}) => {
  const modes = [
    { viewport: DESKTOP, javaScriptEnabled: true, mode: "live" },
    { viewport: PHONE, javaScriptEnabled: true, mode: "reveal" },
    { viewport: DESKTOP, javaScriptEnabled: false, mode: null },
  ] as const;
  for (const { viewport, javaScriptEnabled, mode } of modes) {
    const context = await browser.newContext({ viewport, javaScriptEnabled, baseURL });
    const page = await context.newPage();
    await page.goto("/portfolio");
    const section = page.locator(`#${buildPartsSection.id}`);
    if (mode) await expect(section.locator("[data-flow]")).toHaveAttribute("data-mode", mode);
    const headings = section.getByRole("heading", { level: 3 });
    await expect(headings, `${mode ?? "no-JS"}`).toHaveCount(parts.length);
    for (const part of parts) {
      await expect(section.getByRole("heading", { level: 3, name: part.part })).toHaveCount(1);
    }
    // Live, each heading holds the button that picks its part.
    if (mode === "live") await expect(headings.getByRole("button")).toHaveCount(parts.length);
    await context.close();
  }
});

/** Text and controls in break-it that sit outside the page's gutters, or labels that overlap. */
function findBreakItProblems(section: HTMLElement): string[] {
  const frame = section.firstElementChild as HTMLElement;
  const box = frame.getBoundingClientRect();
  const style = getComputedStyle(frame);
  const left = box.left + parseFloat(style.paddingLeft) - 0.5;
  const right = box.right - parseFloat(style.paddingRight) + 0.5;
  const problems: string[] = [];
  const outside = (rect: DOMRect) => rect.width > 0 && (rect.left < left || rect.right > right);

  const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.trim() ?? "";
    if (!text || node.parentElement?.closest(".sr-only")) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      if (outside(rect)) problems.push(`"${text}" spans ${rect.left}..${rect.right}`);
    }
  }
  section.querySelectorAll("button, input, svg[role=img]").forEach((element) => {
    if (outside(element.getBoundingClientRect())) problems.push(`${element.tagName} is outside`);
  });

  const boxes = [...section.querySelectorAll("[data-layer-label], [data-zero]")]
    .map((element) => (element.hasAttribute("data-zero") ? element.parentElement! : element))
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.width > 0);
  boxes.forEach((one, index) =>
    boxes.slice(index + 1).forEach((other) => {
      const overlaps =
        one.left < other.right && other.left < one.right &&
        one.top < other.bottom && other.top < one.bottom;
      if (overlaps) problems.push(`boxes at ${one.top} and ${other.top} overlap`);
    }),
  );
  return problems;
}

test("nothing in break-it is clipped at 320, 1024, 1100 and 1150 px", async ({
  browser,
  baseURL,
}) => {
  for (const width of [320, 1024, 1100, 1150]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
      baseURL,
    });
    const page = await context.newPage();
    await page.goto(`/portfolio#${breakItAnchor}`);
    const section = page.locator(`#${breakItAnchor}`);
    // The widest picture: a long echo, the honest line in the tally, and the
    // longest layer name set in bold as the one that caught it.
    await section.getByLabel(form.label).fill("hello there, this is a message of a fair length");
    await section.getByRole("button", { name: form.submit }).click();
    await section.getByRole("button", { name: NASTY }).click();
    await expect(section.getByRole("status")).not.toHaveText("");
    expect(await section.evaluate(findBreakItProblems), `at ${width}px`).toEqual([]);
    await context.close();
  }
});

test.describe("which layers are set off shows by more than colour", () => {
  test.use({ viewport: DESKTOP, contextOptions: { reducedMotion: "reduce" } });

  test("a mark and words for each set-off layer, and none for the rest", async ({ page }) => {
    await page.goto(`/portfolio#${breakItAnchor}`);
    const section = page.locator(`#${breakItAnchor}`);
    await section.getByRole("button", { name: SPAM }).click();
    await section.getByRole("button", { name: NASTY }).click();
    const setOff = [verdicts.spam.layer, verdicts.nasty.layer];

    const lists = [section.locator("[data-layer-label]"), section.locator("ol").last().locator("> li")];
    for (const items of lists) {
      await expect(items).toHaveCount(layers.length);
      for (let index = 0; index < layers.length; index += 1) {
        const item = items.nth(index);
        const isSetOff = setOff.includes(index);
        await expect(item.locator("[data-set-off]")).toHaveCount(isSetOff ? 1 : 0);
        if (isSetOff) await expect(item.locator("[data-set-off]")).toBeVisible();
        const said = await item.evaluate((element) => element.textContent ?? "");
        expect(said.includes(layerList.setOff), `layer ${index + 1}`).toBe(isSetOff);
      }
    }
  });
});

test.describe("the pipe", () => {
  test.use({ viewport: DESKTOP });

  test("the page stays up when its scroll code cannot be fetched", async ({ page }) => {
    let blocked = 0;
    await page.route(/PipeScrub/, (route) => {
      blocked += 1;
      return route.abort();
    });
    await page.goto("/portfolio");
    await expect(page.locator("[data-pipe]")).toHaveAttribute("data-pipe", "live");
    await expect.poll(() => blocked).toBeGreaterThan(0);
    await page.waitForTimeout(1500);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(page.locator("#contact").getByRole("heading", { level: 2 })).toBeVisible();
  });

  test("the build flow still lights when the fonts arrive late", async ({ page }) => {
    // The fonts are held until the flow has switched to live, so they land
    // after both the first ("still") and the live measuring have started.
    let releaseFonts = () => {};
    const fontsHeld = new Promise<void>((resolve) => {
      releaseFonts = resolve;
    });
    await page.route(/\.woff2$/, async (route) => {
      await fontsHeld;
      await route.continue();
    });
    // The load event waits for the held fonts, so only the HTML is waited for.
    await page.goto(`/portfolio#${buildPartsSection.id}`, { waitUntil: "domcontentloaded" });
    const flow = page.locator("[data-flow]");
    await expect(flow).toHaveAttribute("data-mode", "live");
    await page.waitForTimeout(300);
    releaseFonts();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const end = await flow.evaluate((list) => list.getBoundingClientRect().bottom + window.scrollY);
    while ((await page.evaluate(() => window.scrollY)) < end) {
      await page.mouse.wheel(0, 240);
      await page.waitForTimeout(60);
    }
    await expect(flow.locator(":scope > li[data-lit]")).toHaveCount(parts.length);
  });

  test("printing draws no pipe, no scroll button and one header", async ({ page }) => {
    await page.goto("/portfolio");
    await page.getByRole("button", { name: scrollButton.toWork }).waitFor();
    await page.evaluate(() => window.scrollTo(0, 3000));
    await expect(page.getByRole("button", { name: scrollButton.toTop })).toBeVisible();
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("header")).toHaveCSS("position", "static");
    await expect(page.locator("[data-pipe]")).toHaveCSS("display", "none");
    await expect(page.getByRole("button", { name: scrollButton.toTop })).toBeHidden();
  });
});
