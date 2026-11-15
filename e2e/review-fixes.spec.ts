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
import { brand, mainId, navItems, scrollButton } from "../src/data/navigation";

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
  await page.goto(`/#${breakItAnchor}`);
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
      await page.goto("/");
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
      await page.goto("/");
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
    await page.goto("/");
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

/** The bar at rest, shown: its box is lifted by one trim, so its top is at -8. */
const BAR_AT_REST = -8;
/** The bar's solid backing stops one trim above the bottom of the header's box. */
const BACKING_TRIM = 8;

/** Waits until the shown bar has finished sliding in. */
async function barAtRest(page: Page): Promise<void> {
  const header = page.locator("header");
  await expect(header).toHaveAttribute("data-nav", "shown");
  await expect
    .poll(() => header.evaluate((bar) => Math.round(bar.getBoundingClientRect().top)))
    .toBe(BAR_AT_REST);
}

/** Every state the bar passes through from now on, in order. */
async function recordBarStates(page: Page): Promise<() => Promise<string[]>> {
  await page.locator("header").evaluate((bar) => {
    const log: string[] = [];
    (window as unknown as { barStates: string[] }).barStates = log;
    new MutationObserver(() => log.push(bar.dataset.nav ?? "")).observe(bar, {
      attributes: true,
      attributeFilter: ["data-nav"],
    });
  });
  return () => page.evaluate(() => (window as unknown as { barStates: string[] }).barStates);
}

/** Where the Work heading starts, and where the bar's solid backing ends. */
async function headingAndBacking(page: Page): Promise<{ heading: number; backing: number }> {
  const heading = await page
    .locator("#project")
    .getByRole("heading", { level: 2 })
    .evaluate((element) => element.getBoundingClientRect().top);
  const backing = await page
    .locator("header")
    .evaluate((bar) => bar.getBoundingClientRect().bottom);
  return { heading, backing: backing - BACKING_TRIM };
}

test.describe("jumping to the work counts as past the hero", () => {
  for (const viewport of [DESKTOP, PHONE]) {
    test(`loading /#project (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/#project");
      const header = page.locator("header");
      await expect(page.getByRole("button", { name: scrollButton.toTop })).toBeVisible();
      await barAtRest(page);
      await expect(page.locator("#project").getByRole("heading", { level: 2 })).toBeInViewport();
      const { heading, backing } = await headingAndBacking(page);
      expect(heading).toBeGreaterThanOrEqual(backing);

      // From here the bar does what it does after scrolling here: it stays.
      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(400);
      await expect(header).toHaveAttribute("data-nav", "shown");
    });

    test(`the Work link, from the top and from the bar (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const header = page.locator("header");
      const toTop = page.getByRole("button", { name: scrollButton.toTop });
      await page.getByRole("button", { name: scrollButton.toWork }).waitFor();

      await header.getByRole("link", { name: WORK_LINK }).click();
      await expect(toTop).toBeVisible();
      await barAtRest(page);
      let { heading, backing } = await headingAndBacking(page);
      expect(heading).toBeGreaterThanOrEqual(backing);

      // A hand resting on the trackpad after the jump moves the page a little
      // back up. The bar and the button stay as they are.
      const states = await recordBarStates(page);
      for (const by of [-3, 3, -12, 12, -20]) {
        await page.evaluate((distance) => window.scrollBy(0, distance), by);
        await page.waitForTimeout(150);
      }
      expect(await states()).toEqual([]);
      await expect(toTop).toBeVisible();

      // Deep in the page, use the bar's own Work link.
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
      await barAtRest(page);
      await header.getByRole("link", { name: WORK_LINK }).click();
      await expect(page.locator("#project").getByRole("heading", { level: 2 })).toBeInViewport();
      await barAtRest(page);
      await expect(toTop).toBeVisible();
      ({ heading, backing } = await headingAndBacking(page));
      expect(heading).toBeGreaterThanOrEqual(backing);
    });
  }
});

test.describe("the bar past the hero", () => {
  test.use({ viewport: DESKTOP });

  test("slides in from above the screen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: scrollButton.toWork }).waitFor();
    const states = await recordBarStates(page);
    await page.evaluate(() => window.scrollTo(0, 3000));
    await barAtRest(page);
    expect(await states()).toEqual(["away", "shown"]);
  });

  test("turns round mid-slide instead of vanishing", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: scrollButton.toWork }).waitFor();
    await page.evaluate(() => window.scrollTo(0, 3000));
    await barAtRest(page);
    const heroFoot = await page
      .locator("#hero")
      .evaluate((hero) => hero.getBoundingClientRect().bottom + window.scrollY);
    const states = await recordBarStates(page);
    // Up into the hero, then back past it the frame the slide starts. Done in
    // the page, so no round trip to the test can outlast the slide.
    await page.evaluate(
      async ({ up, down }) => {
        const bar = document.querySelector("header") as HTMLElement;
        window.scrollTo(0, up);
        while (bar.dataset.nav !== "leaving") {
          await new Promise((next) => requestAnimationFrame(next));
        }
        window.scrollTo(0, down);
      },
      { up: heroFoot - 200, down: heroFoot + 300 },
    );
    await barAtRest(page);
    expect(await states()).toEqual(["leaving", "shown"]);
  });

  for (const motion of ["no-preference", "reduce"] as const) {
    test(`a jump to the top leaves no gap (motion ${motion})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto("/");
      await page.getByRole("button", { name: scrollButton.toWork }).waitFor();
      await page.evaluate(() => window.scrollTo(0, 5000));
      await barAtRest(page);
      const states = await recordBarStates(page);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await expect(page.locator("header")).toHaveAttribute("data-nav", "top");
      await expect(page.locator("header").getByRole("link", { name: brand })).toBeInViewport();
      expect(await states()).toEqual(["top"]);
    });
  }

  test("a fast trip to the top never leaves the header's place empty", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: scrollButton.toWork }).waitFor();
    await page.evaluate(() => window.scrollTo(0, 5000));
    await barAtRest(page);
    // Every painted frame where the header's own place is on screen but the
    // header is not in it.
    await page.locator("header").evaluate((bar) => {
      const place = bar.parentElement as HTMLElement;
      const empty: number[] = [];
      (window as unknown as { emptyFrames: number[] }).emptyFrames = empty;
      const check = () => {
        if (place.getBoundingClientRect().bottom > 0 && bar.dataset.nav !== "top") {
          empty.push(Math.round(window.scrollY));
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    });
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.keyboard.press("Home");
    // A smooth scroll can come to rest a pixel short of the very top.
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
    await expect(page.locator("header")).toHaveAttribute("data-nav", "top");
    await page.waitForTimeout(400);
    const emptyFrames = await page.evaluate(
      () => (window as unknown as { emptyFrames: number[] }).emptyFrames,
    );
    // The observer that puts the header back reports one painted frame late,
    // which nobody can see. Before it there were 11 to 16 empty frames.
    expect(emptyFrames.length).toBeLessThanOrEqual(1);
  });

  test("with reduced motion it never slides out, even on a slow way back", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: scrollButton.toWork }).waitFor();
    const heroFoot = await page
      .locator("#hero")
      .evaluate((hero) => hero.getBoundingClientRect().bottom + window.scrollY);
    await page.evaluate((to) => window.scrollTo(0, to), heroFoot + 300);
    await barAtRest(page);
    const states = await recordBarStates(page);
    // Up through the hero's foot a few pixels a frame.
    await page.evaluate(async (to) => {
      while (window.scrollY > to) {
        window.scrollBy(0, -8);
        await new Promise((next) => requestAnimationFrame(next));
      }
    }, heroFoot - 200);
    await expect(page.locator("header")).toHaveAttribute("data-nav", "top");
    expect(await states()).toEqual(["top"]);
  });

  for (const path of ["/", "/hiring"]) {
    test(`the strip just under the bar lets clicks through (${path})`, async ({ page }) => {
      await page.goto(path);
      // The home page's bar needs its script; the hiring page's is pinned by CSS.
      if (path === "/") await page.getByRole("button", { name: scrollButton.toWork }).waitFor();
      await page.evaluate(() => window.scrollTo(0, 3000));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      if (path === "/") await barAtRest(page);
      // The middle of the solid backing still belongs to the bar; the strip
      // under it, which only looks like page, belongs to the page.
      const insideHeader = await page.locator("header").evaluate((bar) => {
        const bottom = bar.getBoundingClientRect().bottom;
        const points = [bottom - 36, bottom - 6, bottom - 2];
        return points.map((y) => bar.contains(document.elementFromPoint(window.innerWidth / 2, y)));
      });
      expect(insideHeader).toEqual([true, false, false]);
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
    await page.goto("/");
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
    await page.goto(`/#${breakItAnchor}`);
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
    await page.goto(`/#${breakItAnchor}`);
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
    await page.goto("/");
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
    await page.goto(`/#${buildPartsSection.id}`, { waitUntil: "domcontentloaded" });
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
    await page.goto("/");
    await page.getByRole("button", { name: scrollButton.toWork }).waitFor();
    await page.evaluate(() => window.scrollTo(0, 3000));
    await expect(page.getByRole("button", { name: scrollButton.toTop })).toBeVisible();
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("header")).toHaveCSS("position", "static");
    await expect(page.locator("[data-pipe]")).toHaveCSS("display", "none");
    await expect(page.getByRole("button", { name: scrollButton.toTop })).toBeHidden();
  });
});
