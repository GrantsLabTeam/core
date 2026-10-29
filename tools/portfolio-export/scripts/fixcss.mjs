import crypto from "node:crypto";
import fs from "node:fs";

const f = "html/assets/styles.css";
let css = fs.readFileSync(f, "utf8");
css = css.split('url("assets/').join('url("');
for (const url of [
  ...new Set(
    [...css.matchAll(/url\("?(http:\/\/127\.0\.0\.1:6050\/[^")]+)"?\)/g)].map((m) => m[1]),
  ),
]) {
  const name = url.split("/").pop();
  let res = await fetch(url);
  if (!res.ok) res = await fetch("http://127.0.0.1:6050/assets/" + name);
  if (!res.ok) {
    console.log("MISSING", url);
    continue;
  }
  const local =
    crypto.createHash("sha1").update(url).digest("hex").slice(0, 12) + "." + name.split(".").pop();
  fs.writeFileSync("html/assets/" + local, Buffer.from(await res.arrayBuffer()));
  css = css.split(url).join(local);
  console.log("saved", name);
}
fs.writeFileSync(f, css);
console.log("remaining localhost refs:", (css.match(/127\.0\.0\.1/g) || []).length);
