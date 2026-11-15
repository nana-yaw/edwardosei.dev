import { expect, test, type Page } from "@playwright/test";
import { breakItAnchor, intro, layerList, layers } from "../src/data/breakIt";
import { buildFlow, buildPartsSection, credit, flowQuestions, parts } from "../src/data/buildFlow";
import { showAdinkra } from "../src/data/culture";
import { hero } from "../src/data/hero";
import { build } from "../src/data/heroPicture";
import { brand, homePath, printPath, scrollButton } from "../src/data/navigation";
import { profile } from "../src/data/profile";
import { meta, sections } from "../src/data/site";
import { shortenEcho } from "../src/lib/breakit/echo";
import { CASE_STUDIES, IDEA_AT_REST, PAGES, VIEWPORTS, keptStill, still } from "./support";

const PAGES_WITH_IMAGES = PAGES;
/** Pages with no hero: the header is pinned there from the start. */
const PINNED_HEADER_PAGES = ["/hiring", CASE_STUDIES[0].path] as const;

/** The home page's sections in page order, each with the heading it opens on. */
const SECTIONS = [
  { id: "project", title: sections.work.title },
  { id: buildPartsSection.id, title: buildPartsSection.title },
  { id: "approach", title: sections.approach.title },
  { id: breakItAnchor, title: intro.headline },
  { id: "story", title: sections.story.title },
  { id: "experience", title: sections.experience.title },
  { id: "skills", title: sections.skills.title },
  { id: sections.consultation.anchor, title: sections.consultation.title },
  { id: "contact", title: sections.contact.title },
] as const;

/** The words set beside the hero's picture. */
const HERO_LABELS = [
  build.plumbing.name,
  build.plumbing.explanation,
  ...build.plumbing.runs,
  build.housing.name,
  ...build.housing.parts,
  build.launch,
] as const;

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

/** Where the top of the header's bar is on screen. At rest it is at the edge or a little over it. */
async function barTop(page: Page): Promise<number> {
  return page.locator("header").evaluate((bar) => bar.getBoundingClientRect().top);
}
/** A bar whose top is higher than this is on its way out, or gone. */
const HIDDEN_ABOVE = -16;

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const path of PAGES) {
      test(`${path} has no horizontal overflow`, async ({ page }) => {
        await page.goto(path);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      });
    }

    test.describe("with reduced motion", () => {
      test.use({ contextOptions: { reducedMotion: "reduce" } });

      test("the still picture stays and nothing animates", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("img", { name: build.diagramLabel })).toBeVisible();

        // Only after the scripts have run can "nothing mounted" mean anything.
        await page.locator(keptStill).waitFor();
        await page.evaluate(() => window.scrollTo(0, window.innerHeight));
        await page.waitForTimeout(500);
        await expect(page.locator(still)).toHaveCSS("opacity", "1");
        await expect(page.locator("[data-hero-canvas]")).toHaveCount(0);
        await expect(page.locator("canvas")).toHaveCount(0);
        await expect(page.locator("html.lenis")).toHaveCount(0);

        // The pipe and the build flow are drawn finished: nothing follows the scroll.
        await expect(page.locator("[data-pipe]")).toHaveAttribute("data-pipe", "still");
        await expect(page.locator("[data-flow]")).toHaveAttribute("data-mode", "still");

        // Entries that would rise in are simply there.
        const firstEntry = page.locator("[data-reveal]").first();
        await expect(firstEntry).toHaveCSS("opacity", "1");
        await expect(firstEntry).toHaveCSS("transform", "none");
      });
    });

    for (const path of PINNED_HEADER_PAGES) {
      test(`${path}: the header is still on screen a full screen down`, async ({ page }) => {
        await page.goto(path);
        // Scripts have run, so nothing is left that could still move the bar.
        await page.locator("[data-motion-ready]").waitFor();
        const brandLink = page.locator("header").getByRole("link", { name: brand });
        await expect(brandLink).toBeInViewport();

        await page.evaluate(() => window.scrollTo(0, window.innerHeight));
        await expect
          .poll(() => page.evaluate(() => window.scrollY))
          .toBeGreaterThanOrEqual(viewport.height - 1);
        await expect(brandLink).toBeInViewport();
        expect(await barTop(page)).toBeLessThanOrEqual(0);
        expect(await barTop(page)).toBeGreaterThan(HIDDEN_ABOVE);
      });
    }

    test("the home page's header stays clear of the hero, then slides in and stays past it", async ({
      page,
    }) => {
      await page.goto("/");
      const header = page.locator("header");
      const brandLink = header.getByRole("link", { name: brand });
      // The scroll button is only drawn once scripts run, and reads the same
      // "past the hero" answer as the header, so it says when each has happened.
      await expect(page.getByRole("button", { name: scrollButton.toWork })).toBeVisible();
      await expect(brandLink).toBeInViewport();

      // Inside the hero it scrolls away with the page: no bar over the hero.
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(400);
      await expect(header).toHaveAttribute("data-nav", "top");

      const pastHero = await page
        .locator("#hero")
        .evaluate((element) => element.getBoundingClientRect().bottom + window.scrollY + 300);
      await page.evaluate((to) => window.scrollTo(0, to), pastHero);
      await expect(page.getByRole("button", { name: scrollButton.toTop })).toBeVisible();
      // It slides in, so its resting place is waited for.
      await expect.poll(() => barTop(page)).toBeGreaterThan(HIDDEN_ABOVE);
      expect(await barTop(page)).toBeLessThanOrEqual(0);
      await expect(brandLink).toBeInViewport();

      // Further down it stays, and on the way up too.
      for (const by of [300, 900, -60]) {
        await page.evaluate((distance) => window.scrollBy(0, distance), by);
        await page.waitForTimeout(400);
        await expect(header).toHaveAttribute("data-nav", "shown");
        await expect(brandLink).toBeInViewport();
        expect(await barTop(page)).toBeGreaterThan(HIDDEN_ABOVE);
      }

      // Back at the top it is the in-flow header again.
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(header).toHaveAttribute("data-nav", "top");
      await expect(brandLink).toBeInViewport();
    });
  });
}

test.describe("the old /portfolio address", () => {
  test("sends visitors to the home page for good, keeping a section link", async ({
    page,
    request,
  }) => {
    const response = await request.get("/portfolio", { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(new URL(response.headers().location, "http://localhost").pathname).toBe(homePath);

    await page.goto("/portfolio#project");
    expect(new URL(page.url()).pathname).toBe(homePath);
    expect(new URL(page.url()).hash).toBe("#project");
    await expect(page.locator("#project").getByRole("heading", { level: 2 })).toBeInViewport();
  });

  test("the home page, now at /, keeps the brand in its title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(meta.titleTemplate.replace("%s", meta.portfolio.title));
  });

  test("leaves the print version where it was", async ({ request }) => {
    const response = await request.get(printPath, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the portfolio's content is all in the HTML", async ({ page }) => {
    await page.goto("/");

    const headline = page.getByRole("heading", { level: 1 });
    await expect(headline).toBeVisible();
    for (const line of hero.headline) {
      await expect(headline).toContainText(line);
    }
    await expect(page.getByText(hero.lede, { exact: true })).toBeVisible();

    // The finished picture, with every label beside it lit.
    await expect(page.getByRole("img", { name: build.diagramLabel })).toBeVisible();
    await expect(page.locator(still)).toHaveCSS("opacity", "1");
    const figure = page.locator("[data-hero-figure]");
    await expect(figure.locator("p[data-idea]")).toHaveText(IDEA_AT_REST);
    for (const label of HERO_LABELS) {
      await expect(figure).toContainText(label);
    }
    const labelOpacities = await figure
      .locator("[data-step]")
      .evaluateAll((labels) => labels.map((label) => getComputedStyle(label).opacity));
    expect(labelOpacities.length).toBeGreaterThan(0);
    expect(labelOpacities.filter((opacity) => opacity !== "1")).toHaveLength(0);

    for (const section of SECTIONS) {
      await expect(
        page.locator(`#${section.id}`).getByRole("heading", { name: section.title, exact: true }),
      ).toBeVisible();
    }
    const flow = page.locator(`#${buildPartsSection.id}`);
    for (const part of parts) {
      await expect(flow.getByRole("heading", { name: part.part, exact: true })).toBeVisible();
      await expect(flow.getByText(flowQuestions[part.id], { exact: true })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: sections.work.caseStudyLabel })).toHaveCount(
      CASE_STUDIES.length,
    );
    await expect(page.locator("canvas")).toHaveCount(0);
  });

  for (const study of CASE_STUDIES) {
    test(`${study.path}: the case study is all in the HTML`, async ({ page }) => {
      await page.goto(study.path);

      await expect(page.getByRole("heading", { level: 1, name: study.name })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2 })).toHaveCount(5);
      await expect(page.getByRole("link", { name: study.visit }).first()).toBeVisible();
    });
  }
});

test.describe("without JavaScript, for hiring managers", () => {
  test.use({ javaScriptEnabled: false });

  test("the hiring page's content is all in the HTML", async ({ page }) => {
    await page.goto("/hiring");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Read the resume" })).toBeVisible();
    // Working together, How I work, the test-suite story, experience, tools.
    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(5);
  });
});

test.describe("two doors", () => {
  test("the second hero button opens the hiring page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: hero.secondary.label }).click();
    await expect(page).toHaveURL(/\/hiring$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("remote role");
  });
});

test.describe("the Adinkra and kente switch", () => {
  test.use({ javaScriptEnabled: false });

  // The server and these tests read one variable, NEXT_PUBLIC_SHOW_ADINKRA.
  // Start both with it set the same way, and the matching half below runs.
  test("switched off, nothing of the symbols or the strips reaches the HTML", async ({
    page,
    request,
  }) => {
    test.skip(showAdinkra, "this run has the switch on");

    const html = await (await request.get("/")).text();
    expect(html).not.toContain('lang="tw"');
    expect(html).not.toMatch(/adinkra|kente/i);
    expect(html).not.toContain("<pattern");
    expect(html).not.toContain(credit);
    for (const part of parts) {
      expect(html).not.toContain(part.name);
      expect(html).not.toContain(part.meaning);
    }

    await page.goto("/");
    const flow = page.locator(`#${buildPartsSection.id}`);
    await expect(flow.locator("[data-flow-box]")).toHaveText(
      parts.map((_, index) => String(index + 1)),
    );
    await expect(flow.locator("svg")).toHaveCount(0);
    await expect(flow.getByText(buildFlow.labels.meaning, { exact: true })).toHaveCount(0);
    await expect(flow.getByText(buildFlow.lede, { exact: true })).toBeVisible();

    // Each seam is one hairline and nothing else.
    const seams = page.locator("[data-seam]");
    await expect(seams).toHaveCount(3);
    await expect(seams.locator("*")).toHaveCount(0);
    for (const seam of await seams.all()) {
      await expect(seam).toHaveCSS("border-top-width", "1px");
      await expect(seam).toHaveAttribute("aria-hidden", "true");
    }
  });

  test("switched on, every symbol, name and strip is on the page", async ({ page }) => {
    test.skip(!showAdinkra, "this run has the switch off");

    await page.goto("/");
    const flow = page.locator(`#${buildPartsSection.id}`);
    await expect(flow.getByText(buildFlow.ledeWithSymbols, { exact: true })).toBeVisible();
    await expect(flow.getByText(credit, { exact: true })).toBeVisible();
    await expect(flow.locator('[lang="tw"]')).toHaveText(parts.map((part) => part.name));
    await expect(flow.getByText(buildFlow.labels.meaning, { exact: true })).toHaveCount(
      parts.length,
    );
    for (const part of parts) {
      await expect(flow.locator(`[data-flow-box] svg[aria-label="${part.name}"]`)).toHaveCount(1);
      await expect(flow.getByText(part.meaning, { exact: true })).toBeVisible();
    }

    // Three bands are defined once, the page opens on a strip, and the three
    // seams carry four more between them.
    await expect(page.locator("pattern")).toHaveCount(3);
    await expect(page.locator("[data-seam]")).toHaveCount(3);
    await expect(page.locator("[data-seam] svg")).toHaveCount(4);
    await expect(page.locator('svg rect[fill^="url(#"]')).toHaveCount(5);
  });
});

test.describe("try to break it", () => {
  test.use({ javaScriptEnabled: false });

  test("is a section of the home page under the one h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    const section = page.locator(`section#${breakItAnchor}`);
    const title = section.getByRole("heading", { level: 2 });
    await expect(title).toHaveCount(1);
    await expect(title).toHaveAccessibleName(intro.headline);
    // Its own headings step down from there.
    await expect(section.getByRole("heading", { level: 3, name: layerList.title })).toBeVisible();
    await expect(section.getByRole("heading", { level: 4 })).toHaveText(
      layers.map((layer) => layer.name),
    );
  });

  test("says it is a simulation right under the dare, and links to no live product", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.locator(`section#${breakItAnchor}`);
    await expect(section.locator("h2 + p")).toHaveText(intro.notice);
    await expect(section.locator("h2 + p")).toBeVisible();

    const links = await section
      .locator("a")
      .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href") ?? ""));
    expect(links.length).toBeGreaterThan(0);
    expect(links.filter((href) => !href.startsWith(`${homePath}#`))).toHaveLength(0);
  });
});

test.describe("what the browser is sent", () => {
  // Strings from profile.ts that no page shows. The profile is read on the
  // server only, so no script any page loads may carry them.
  const unshown = [profile.taglines.cinematic, profile.experience[0].achievements.at(-1) ?? ""];

  test("no script on any page carries the profile", async ({ page }) => {
    let checked = 0;
    for (const path of PAGES) {
      const bodies: Promise<string>[] = [];
      page.on("response", (response) => {
        // A redirect has no body of its own; the script it points at is counted.
        if (response.request().resourceType() === "script" && response.ok()) {
          bodies.push(response.text());
        }
      });
      await page.goto(path, { waitUntil: "networkidle" });
      for (const body of await Promise.all(bodies)) {
        checked += 1;
        for (const text of unshown) expect(body.includes(text), `${path} sends "${text}"`).toBe(false);
      }
      page.removeAllListeners("response");
    }
    expect(checked).toBeGreaterThan(0);
  });

  test("the echo of typed text never ends on half an emoji", () => {
    // The 72-unit cut falls between the two halves of the emoji.
    expect(shortenEcho(`${"a".repeat(71)}\u{1F600} and more`)).toBe(`${"a".repeat(71)}...`);
    expect(shortenEcho(`${"a".repeat(70)}\u{1F600} and more`)).toBe(`${"a".repeat(70)}\u{1F600}...`);
    expect(shortenEcho("  short  ")).toBe("short");
  });
});

test.describe("keyboard", () => {
  for (const path of PAGES) {
    test(`${path}: the skip link is the first stop and lands on the content`, async ({ page }) => {
      await page.goto(path);
      await page.keyboard.press("Tab");

      const skip = page.getByRole("link", { name: "Skip to content" });
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();

      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#main-content$/);
    });
  }
});

test.describe("images", () => {
  test("every image on every page that has them loads", async ({ page }) => {
    for (const path of PAGES_WITH_IMAGES) {
      await page.goto(path);
      const images = page.locator("img");
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
      for (let index = 0; index < count; index += 1) {
        const image = images.nth(index);
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
          .toBeGreaterThan(0);
      }
    }
  });
});
