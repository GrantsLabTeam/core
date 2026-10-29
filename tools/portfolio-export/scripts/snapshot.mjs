import crypto from "node:crypto";
import fs from "node:fs";
import { chromium } from "playwright";

const base = "http://127.0.0.1:6050";
const OUT = "html";
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(`${OUT}/assets`, { recursive: true });
const idx = await (await fetch(base + "/index.json")).json();
const ids = Object.keys(idx.entries).filter((k) => k.startsWith("design-system"));
const b = await chromium.launch();
const saved = new Map(); // url -> local file
const extFor = (ct, url) =>
  ({
    "image/svg+xml": "svg",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "font/woff2": "woff2",
    "font/woff": "woff",
  })[ct?.split(";")[0]] ||
  (url.match(/\.(\w{2,5})(?:[?#]|$)/)?.[1] ?? "bin");
let css = null;
const pages = [];
for (const id of ids) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto(`${base}/iframe.html?id=${id}&viewMode=story`);
  await p.waitForFunction(
    () => document.querySelector("#storybook-root")?.children.length > 0,
    null,
    { timeout: 30000 },
  );
  await p.waitForTimeout(7000);
  // Fetch a URL from inside the page (so MSW mocks apply) and save it locally.
  const save = async (url) => {
    if (!url || url.startsWith("data:")) return url;
    const abs = new URL(url, base + "/iframe.html").href;
    if (saved.has(abs)) return saved.get(abs);
    const res = await p.evaluate(async (u) => {
      try {
        const r = await fetch(u);
        if (!r.ok) return null;
        const buf = new Uint8Array(await r.arrayBuffer());
        let s = "";
        for (const c of buf) s += String.fromCharCode(c);
        return { ct: r.headers.get("content-type"), b64: btoa(s) };
      } catch {
        return null;
      }
    }, abs);
    if (!res) {
      saved.set(abs, abs);
      return abs;
    }
    const data = Buffer.from(res.b64, "base64");
    const name = `assets/${crypto.createHash("sha1").update(abs).digest("hex").slice(0, 12)}.${extFor(res.ct, abs)}`;
    fs.writeFileSync(`${OUT}/${name}`, data);
    saved.set(abs, name);
    return name;
  };
  if (!css) {
    css = await p.evaluate(() =>
      [...document.styleSheets]
        .map((s) => {
          try {
            return [...s.cssRules].map((r) => r.cssText).join("\n");
          } catch {
            return "";
          }
        })
        .join("\n"),
    );
    for (const m of [
      ...new Set([...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1])),
    ]) {
      if (m.startsWith("data:")) continue;
      css = css.split(m).join(await save(m));
    }
  }
  // Freeze form state and canvases into attributes, then serialize.
  await p.evaluate(() => {
    document.querySelectorAll("input").forEach((i) => {
      if (i.type === "checkbox" || i.type === "radio") {
        i.checked ? i.setAttribute("checked", "") : i.removeAttribute("checked");
      } else i.setAttribute("value", i.value);
    });
    document.querySelectorAll("textarea").forEach((t) => {
      t.textContent = t.value;
    });
    document.querySelectorAll("canvas").forEach((c) => {
      try {
        const img = document.createElement("img");
        img.src = c.toDataURL();
        img.width = c.width;
        img.style.cssText = c.style.cssText;
        c.replaceWith(img);
      } catch {}
    });
    document.querySelectorAll("script, noscript").forEach((s) => s.remove());
  });
  let html = await p.evaluate(() => document.querySelector("#storybook-root").outerHTML);
  for (const m of [...new Set([...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]))].sort(
    (a, b) => b.length - a.length,
  )) {
    if (
      /^(data:|#|mailto:)/.test(m) ||
      (m.startsWith("http") && !/\.(png|jpe?g|svg|webp|gif)(\?|$)|picsum|ipfs/.test(m))
    )
      continue;
    html = html.split(`"${m}"`).join(`"${await save(m.replace(/&amp;/g, "&"))}"`);
  }
  for (const m of [
    ...new Set([...html.matchAll(/url\(&quot;([^&]+)&quot;\)/g)].map((m) => m[1])),
  ].sort((a, b) => b.length - a.length))
    html = html.split(`url(&quot;${m}&quot;)`).join(`url(&quot;${await save(m)}&quot;)`);
  const bodyStyle = await p.evaluate(() => document.body.getAttribute("class") || "");
  pages.push({ id, title: idx.entries[id].title, html, bodyStyle });
  console.log(id, Math.round(html.length / 1024) + "KB");
  await p.close();
}
fs.writeFileSync(`${OUT}/assets/styles.css`, css.split("url(assets/").join("url("));
fs.writeFileSync("pages.json", JSON.stringify(pages));
console.log("assets", saved.size, "css", Math.round(css.length / 1024) + "KB");
await b.close();
