// Renders scripts/resume.md to public/Edward_Osei-Nyarko_Resume.pdf.
// Run with `npm run resume`. Uses the installed Chrome through Playwright,
// so there is nothing extra to install.
// Pass --out to write a copy somewhere else, such as ~/Documents/resumes.
import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const { values: options } = parseArgs({
  options: { out: { type: "string" } },
});

const source = fileURLToPath(new URL("./resume.md", import.meta.url));
const output =
  options.out ?? fileURLToPath(new URL("../public/Edward_Osei-Nyarko_Resume.pdf", import.meta.url));


function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Bold, links and bare email addresses: the only inline marks the resume uses. */
function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/(^|\s)([\w.+-]+@[\w-]+\.[\w.-]+)/g, '$1<a href="mailto:$2">$2</a>');
}

/**
 * The resume uses a small subset of Markdown: headings, rules, bullet lists
 * and paragraphs whose line breaks are kept (as Obsidian shows them).
 */
function toHtml(markdown) {
  const html = [];
  let paragraph = [];
  let list = [];
  const flush = () => {
    if (paragraph.length) html.push(`<p>${paragraph.map(inline).join("<br>")}</p>`);
    if (list.length) html.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
    paragraph = [];
    list = [];
  };

  for (const line of markdown.split("\n")) {
    const heading = /^(#{1,3}) (.+)$/.exec(line);
    if (heading) {
      flush();
      html.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
    } else if (line.trim() === "---") {
      flush();
      html.push("<hr>");
    } else if (line.startsWith("- ")) {
      if (paragraph.length) flush();
      list.push(line.slice(2));
    } else if (line.trim() === "") {
      flush();
    } else {
      if (list.length) flush();
      paragraph.push(line);
    }
  }
  flush();
  return html.join("\n");
}

// One column, one standard font, real text and no tables, columns or icons,
// so applicant tracking systems read it in order. Sized to fit one page.
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Edward_Osei-Nyarko_Resume</title>
<style>
  @page { size: letter; margin: 0.5in 0.6in; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.3; color: #000; margin: 0; }
  h1 { font-size: 18pt; margin: 0 0 2pt; }
  h2 { font-size: 10.5pt; text-transform: uppercase; margin: 10pt 0 4pt; padding-bottom: 2pt; border-bottom: 1px solid #000; break-after: avoid; }
  h3 { font-size: 10pt; margin: 6pt 0 2pt; break-after: avoid; }
  p { margin: 0 0 4pt; }
  ul { margin: 0 0 4pt; padding-left: 14pt; }
  li { margin-bottom: 1.5pt; break-inside: avoid; }
  a { color: #000; text-decoration: none; }
  hr { border: 0; border-top: 1px solid #ccc; margin: 8pt 0; }
</style>
</head>
<body>
${toHtml(await readFile(source, "utf8"))}
</body>
</html>`;

const browser = await chromium.launch({ channel: "chrome" });
try {
  const tab = await browser.newPage();
  await tab.setContent(page, { waitUntil: "load" });
  await tab.pdf({ path: output, preferCSSPageSize: true });
} finally {
  await browser.close();
}
console.log(`Wrote ${output}`);
