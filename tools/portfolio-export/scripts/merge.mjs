import fs from "node:fs";
import { PDFArray, PDFDocument, PDFName, PDFNull, PDFNumber, PDFString } from "pdf-lib";

const manifest = JSON.parse(fs.readFileSync("pages/manifest.json"));
const doc = await PDFDocument.create();
doc.setTitle("Gitcoin Core Design System");
doc.setSubject("Foundations, components and product screens of the Gitcoin Core design system");
doc.setCreator("Rendered from the @gitcoin/ui Storybook");
doc.setProducer("pdf-lib");
const entries = [];
for (const m of manifest) {
  const src = await PDFDocument.load(fs.readFileSync(`pages/${m.id}.pdf`));
  const [page] = await doc.copyPages(src, [0]);
  doc.addPage(page);
  const parts = m.title.split("/").slice(1); // drop "Design System"
  entries.push({ group: parts.length > 1 ? parts[0] : null, label: parts.at(-1), page });
}
// Build a nested outline: top-level groups with their pages as children.
const ctx = doc.context;
const tree = [];
for (const e of entries) {
  if (!e.group) tree.push({ label: e.label, page: e.page, children: [] });
  else {
    let g = tree.find((t) => t.label === e.group && t.group);
    if (!g) {
      g = { label: e.group, group: true, page: e.page, children: [] };
      tree.push(g);
    }
    g.children.push({ label: e.label, page: e.page, children: [] });
  }
}
const outlineRef = ctx.nextRef();
const dest = (page) => {
  const a = PDFArray.withContext(ctx);
  a.push(page.ref);
  a.push(PDFName.of("XYZ"));
  a.push(PDFNull);
  a.push(PDFNull);
  a.push(PDFNull);
  return a;
};
const build = (items, parentRef) => {
  const refs = items.map(() => ctx.nextRef());
  items.forEach((it, i) => {
    const d = { Title: PDFString.of(it.label), Parent: parentRef, Dest: dest(it.page) };
    if (i > 0) d.Prev = refs[i - 1];
    if (i < items.length - 1) d.Next = refs[i + 1];
    if (it.children.length) {
      const kids = build(it.children, refs[i]);
      d.First = kids[0];
      d.Last = kids.at(-1);
      d.Count = PDFNumber.of(it.children.length);
    }
    ctx.assign(refs[i], ctx.obj(d));
  });
  return refs;
};
const top = build(tree, outlineRef);
ctx.assign(
  outlineRef,
  ctx.obj({ Type: "Outlines", First: top[0], Last: top.at(-1), Count: PDFNumber.of(top.length) }),
);
doc.catalog.set(PDFName.of("Outlines"), outlineRef);
doc.catalog.set(PDFName.of("PageMode"), PDFName.of("UseOutlines"));
fs.writeFileSync("Gitcoin-Design-System.pdf", await doc.save());
console.log(
  "pages",
  doc.getPageCount(),
  "outline",
  JSON.stringify(tree.map((t) => [t.label, t.children.map((c) => c.label)])),
);
