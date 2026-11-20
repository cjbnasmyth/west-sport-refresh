// Exposes the Markdown articles to the app as two kinds of virtual module, so YAML and Markdown are
// parsed at build time and never shipped to the browser:
//
//   virtual:articles        metadata for every published article (newest first) + a loader per slug
//   virtual:article/<slug>  that article's rendered HTML, with /images/... references bundled as assets
import { resolve } from "node:path";
import { ARTICLES_DIR, loadArticles, renderMarkdown } from "./articles.mjs";

const LIST_ID = "virtual:articles";
const ITEM_PREFIX = "virtual:article/";
const IMAGES_DIR = resolve(ARTICLES_DIR, "../images");

// Editors only reach the CMS through Pages CMS, so this is defence in depth rather than sanitising
// untrusted input: drop scripts and inline event handlers.
const stripScripts = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, "");

// Turn src="/images/foo.webp" into an imported (hashed) asset URL, matching how JSON content images work.
function articleModule(html) {
  const imports = [];
  const parts = stripScripts(html).split(/src="\/?images\/([^"]+)"/g);
  const pieces = parts.map((part, i) => {
    if (i % 2 === 0) return JSON.stringify(part);
    const name = `img${imports.length}`;
    imports.push(`import ${name} from ${JSON.stringify(resolve(IMAGES_DIR, decodeURIComponent(part)))};`);
    return `'src="' + ${name} + '"'`;
  });
  return `${imports.join("\n")}\nexport const html = ${pieces.join(" + ")};\n`;
}

export default function articles() {
  return {
    name: "articles",
    resolveId(id) {
      if (id === LIST_ID || id.startsWith(ITEM_PREFIX)) return `\0${id}`;
    },
    load(id) {
      if (id === `\0${LIST_ID}`) {
        this.addWatchFile(ARTICLES_DIR);
        const list = loadArticles();
        const meta = list.map(({ body, published, ...rest }) => rest);
        const loaders = list
          .map((a) => `  ${JSON.stringify(a.slug)}: () => import(${JSON.stringify(ITEM_PREFIX + a.slug)}),`)
          .join("\n");
        return `export const articles = ${JSON.stringify(meta)};\nexport const loaders = {\n${loaders}\n};\n`;
      }
      if (id.startsWith(`\0${ITEM_PREFIX}`)) {
        const slug = id.slice(ITEM_PREFIX.length + 1);
        const article = loadArticles().find((a) => a.slug === slug);
        if (!article) throw new Error(`[articles] no published article "${slug}"`);
        return articleModule(renderMarkdown(article.body));
      }
    },
    // Dev server: reload when an article is added, edited or removed.
    configureServer(server) {
      server.watcher.add(ARTICLES_DIR);
      const onChange = (file) => {
        if (!file.startsWith(ARTICLES_DIR)) return;
        for (const mod of server.moduleGraph.idToModuleMap.values()) {
          if (mod.id?.startsWith(`\0${LIST_ID}`) || mod.id?.startsWith(`\0${ITEM_PREFIX}`)) {
            server.moduleGraph.invalidateModule(mod);
          }
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", onChange).on("change", onChange).on("unlink", onChange);
    },
  };
}

