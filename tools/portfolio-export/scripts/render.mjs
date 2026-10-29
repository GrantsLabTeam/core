import fs from "node:fs";
import { chromium } from "playwright";

const base = "http://127.0.0.1:6050";
const only = process.argv[2];
const idx = await (await fetch(base + "/index.json")).json();
const ids = Object.keys(idx.entries).filter(
  (k) => k.startsWith("design-system") && (!only || k.includes(only)),
);
fs.mkdirSync("pages", { recursive: true });
const b = await chromium.launch();
const out = [];
for (const id of ids) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.emulateMedia({ media: "screen" });
  await p.goto(`${base}/iframe.html?id=${id}&viewMode=story`);
  await p.waitForFunction(
    () => document.querySelector("#storybook-root")?.children.length > 0,
    null,
    { timeout: 30000 },
  );
  await p.waitForTimeout(7000);
  await p.evaluate(() => document.fonts.ready);
  const h = await p.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  await p.pdf({
    path: `pages/${id}.pdf`,
    width: "1600px",
    height: `${h}px`,
    printBackground: true,
    pageRanges: "1",
  });
  console.log(id, h);
  out.push({ id, title: idx.entries[id].title, h });
  await p.close();
}
fs.writeFileSync("pages/manifest.json", JSON.stringify(out, null, 2));
await b.close();
