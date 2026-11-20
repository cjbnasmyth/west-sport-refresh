// Runs after `vite-react-ssg build`:
//   - moves the pre-rendered 404 page to dist/404.html, which Cloudflare Pages serves for unknown URLs
//   - puts <meta charset> back at the top of every page (the per-page head tags are injected above it,
//     and browsers only look for it in the first 1024 bytes)
//   - writes dist/sitemap.xml and dist/rss.xml from the published articles
import { readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadArticles } from "./articles.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const site = JSON.parse(readFileSync(resolve(root, "src/content/site.json"), "utf8"));
const articlesCopy = JSON.parse(readFileSync(resolve(root, "src/content/articles.json"), "utf8"));
const articles = loadArticles();
const abs = (path) => new URL(path, site.url).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

renameSync(resolve(dist, "404/index.html"), resolve(dist, "404.html"));
rmSync(resolve(dist, "404"), { recursive: true, force: true });

const CHARSET = /\s*<meta charset="UTF-8">/i;
for (const file of readdirSync(dist, { recursive: true }).filter((f) => f.endsWith(".html"))) {
  const path = resolve(dist, file);
  const html = readFileSync(path, "utf8");
  if (CHARSET.test(html)) writeFileSync(path, html.replace(CHARSET, "").replace("<head>", '<head><meta charset="UTF-8">'));
}

const pages = [
  { path: "/", lastmod: articles[0]?.date },
  ...(articles.length ? [{ path: "/articles/", lastmod: articles[0].date }] : []),
  ...articles.map((a) => ({ path: `/articles/${a.slug}/`, lastmod: a.date })),
];
writeFileSync(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((p) => `  <url><loc>${abs(p.path)}</loc>${p.lastmod ? `<lastmod>${p.lastmod.slice(0, 10)}</lastmod>` : ""}</url>`)
  .join("\n")}
</urlset>
`,
);

writeFileSync(
  resolve(dist, "rss.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${site.name} ${articlesCopy.index.title}`)}</title>
    <link>${abs("/articles/")}</link>
    <description>${esc(articlesCopy.index.intro)}</description>
    <language>en-gb</language>
    <atom:link href="${abs("/rss.xml")}" rel="self" type="application/rss+xml" />
${articles
  .map(
    (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${abs(`/articles/${a.slug}/`)}</link>
      <guid>${abs(`/articles/${a.slug}/`)}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      ${a.excerpt ? `<description>${esc(a.excerpt)}</description>` : ""}
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`,
);

console.log(`[postbuild] 404.html, sitemap.xml (${pages.length} URLs) and rss.xml (${articles.length} articles) written`);
