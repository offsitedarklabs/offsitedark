import https from "https";
import fs from "fs";

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

const html = await fetch("https://www.kali.org/tools/all-tools/");
fs.writeFileSync("scripts/kali-all-tools.html", html);
const links = [...html.matchAll(/href="\/tools\/([^"#?]+)"/g)].map((m) => m[1]);
const unique = [...new Set(links)].filter((s) => s !== "all-tools" && !s.includes("/"));
console.log("html length", html.length);
console.log("unique tools", unique.length);
console.log("sample h3", html.match(/<h3[^>]*>[^<]+<\/h3>/gi)?.slice(0, 5));
console.log("first tools", unique.slice(0, 10));
