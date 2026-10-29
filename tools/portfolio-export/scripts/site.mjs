import fs from "node:fs";

const OUT = "html";
const pages = JSON.parse(fs.readFileSync("pages.json"));
const slug = (t) =>
  t
    .split("/")
    .slice(1)
    .join("-")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
pages.forEach((p, i) => {
  p.file = i === 0 ? "index.html" : `${slug(p.title)}.html`;
  p.parts = p.title.split("/").slice(1);
  p.label = p.parts.at(-1);
});
const groups = [];
for (const p of pages) {
  const g = p.parts.length > 1 ? p.parts[0] : null;
  let e = groups.find((x) => x.name === g);
  if (!e) groups.push((e = { name: g, pages: [] }));
  e.pages.push(p);
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const navCss = `
.ds-nav{position:sticky;top:0;z-index:1000;display:flex;align-items:center;gap:10px 28px;flex-wrap:wrap;padding:12px 64px;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid #ECEDED;font:500 13px/1.4 "DM Sans",sans-serif;white-space:nowrap}
.ds-nav *{font-family:"DM Sans",sans-serif}
.ds-nav .ds-brand{font-weight:600;font-size:14px;color:#000;text-decoration:none;margin-right:8px}
.ds-nav .ds-group{display:flex;align-items:center;gap:12px}
.ds-nav .ds-group-name{color:#959C9C;font:400 11px/1 "DM Mono",monospace;text-transform:uppercase;letter-spacing:.08em}
.ds-nav .ds-group-name *{font-family:"DM Mono",monospace}
.ds-nav a{color:#4B5050;text-decoration:none;padding:4px 8px;border-radius:6px}
.ds-nav a:hover{background:#F7F7F7;color:#000}
.ds-nav a.ds-active{background:#1E443F;color:#fff}
.ds-pager{display:flex;justify-content:space-between;padding:40px 64px 64px;background:#E9E9E9;font:500 15px/1.4 "DM Sans",sans-serif}
.ds-pager *{font-family:"DM Sans",sans-serif}
.ds-pager a{color:#1E443F;text-decoration:none;padding:14px 20px;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.ds-pager a:hover{background:#F2FBF8}
.ds-pager span.ds-hint{display:block;color:#959C9C;font:400 11px/1.6 "DM Mono",monospace;text-transform:uppercase;letter-spacing:.08em}
html,body{margin:0;background:#E9E9E9}
`;
fs.writeFileSync(`${OUT}/assets/site.css`, navCss);
pages.forEach((p, i) => {
  const nav =
    `<nav class="ds-nav"><a class="ds-brand" href="index.html">Gitcoin Core Design System</a>` +
    groups
      .map(
        (g) =>
          `<div class="ds-group">${g.name ? `<span class="ds-group-name">${esc(g.name)}</span>` : ""}${g.pages.map((q) => `<a href="${q.file}"${q === p ? ' class="ds-active"' : ""}>${esc(q.label)}</a>`).join("")}</div>`,
      )
      .join("") +
    `</nav>`;
  const prev = pages[i - 1],
    next = pages[i + 1];
  const pager = `<div class="ds-pager">${prev ? `<a href="${prev.file}"><span class="ds-hint">← Previous</span>${esc(prev.label)}</a>` : "<span></span>"}${next ? `<a href="${next.file}" style="text-align:right"><span class="ds-hint">Next →</span>${esc(next.label)}</a>` : "<span></span>"}</div>`;
  const html = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1600">
<title>${esc(p.label)} · Gitcoin Core Design System</title>
<link rel="stylesheet" href="assets/styles.css">
<link rel="stylesheet" href="assets/site.css">
</head>
<body class="${p.bodyStyle}">
${nav}
${p.html}
${pager}
</body>
</html>
`;
  fs.writeFileSync(`${OUT}/${p.file}`, html);
});
console.log(pages.map((p) => p.file).join("\n"));
