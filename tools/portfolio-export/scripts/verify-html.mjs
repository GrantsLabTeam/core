import fs from "node:fs";
import { chromium } from "playwright";

const manifest = JSON.parse(fs.readFileSync("pages/manifest.json"));
const files = fs.readdirSync("html").filter((f) => f.endsWith(".html"));
const pages = JSON.parse(fs.readFileSync("pages.json"));
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 } });
const blocked = [];
await ctx.route(/^https?:/, (r) => {
  blocked.push(r.request().url());
  r.abort();
});
fs.mkdirSync("htmlshots", { recursive: true });
const order = ["index.html", ...files.filter((f) => f !== "index.html")];
for (const [i, pg] of pages.entries()) {
  const file =
    i === 0
      ? "index.html"
      : order.find(
          (f) =>
            f !== "index.html" &&
            pg.title
              .split("/")
              .slice(1)
              .join("-")
              .toLowerCase()
              .replace(/&/g, "and")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") +
              ".html" ===
              f,
        );
  const p = await ctx.newPage();
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 100)));
  await p.goto("file://" + process.cwd() + "/html/" + file);
  await p.waitForTimeout(800);
  const fontsOk = await p.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts]
      .filter((f) => f.status === "loaded")
      .map((f) => f.family + " " + f.weight)
      .join(", ");
  });
  const broken = await p.evaluate(
    () => [...document.images].filter((im) => !im.complete || im.naturalWidth === 0).length,
  );
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  const orig = manifest.find((m) => m.id === pg.id).h;
  await p.screenshot({ path: `htmlshots/${file}.png`, fullPage: true });
  console.log(
    file.padEnd(52),
    "h",
    h,
    "storybook",
    orig,
    "(+nav/pager)",
    "brokenImgs",
    broken,
    errs.length ? errs[0] : "",
  );
  if (i === 0) console.log("   fonts loaded:", fontsOk);
  await p.close();
}
console.log("network requests attempted (blocked):", blocked.length, blocked.slice(0, 5));
await b.close();
