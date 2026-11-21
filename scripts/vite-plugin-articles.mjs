// Exposes the articles to the app as two kinds of virtual module, so YAML, Markdown and Word documents
// are converted at build time and never shipped to the browser:
//
//   virtual:articles        metadata for every published article (newest first) + a loader per slug
//   virtual:article/<slug>  that article's rendered HTML, with its images bundled as assets
import { resolve } from "node:path";
import { ARTICLES_DIR, DOCUMENTS_DIR, DOCX_IMAGES_DIR, DOCX_IMAGE_PREFIX, loadArticles } from "./articles.mjs";

const LIST_ID = "virtual:articles";
const ITEM_PREFIX = "virtual:article/";
const IMAGES_DIR = resolve(ARTICLES_DIR, "../images");

// Editors only reach the CMS through Pages CMS, so this is defence in depth rather than sanitising
// untrusted input: drop scripts and inline event handlers.
const stripScripts = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, "");

// Turn image references into imported (hashed) asset URLs: src="/images/foo.webp" from the editor,
// matching how JSON content images work, and src="docx-image:<file>" for images from a Word document.
// Photos get the same resized WebP srcset as content photos (see photo() in src/content/index.ts);
// SVGs and GIFs are used as they are.
const IMAGE_SRC = new RegExp(`src="(?:\\/?images\\/|${DOCX_IMAGE_PREFIX})([^"]+)"`, "g");

function articleModule(html) {
  const clean = stripScripts(html);
  const imports = [];
  const pieces = [];
  let last = 0;
  for (const match of clean.matchAll(IMAGE_SRC)) {
    const [whole, file] = match;
    const dir = whole.includes(DOCX_IMAGE_PREFIX) ? DOCX_IMAGES_DIR : IMAGES_DIR;
    const path = resolve(dir, decodeURIComponent(file));
    const name = `img${imports.length}`;
    pieces.push(JSON.stringify(clean.slice(last, match.index)));
    if (/\.(svg|gif)$/i.test(path)) {
      imports.push(`import ${name} from ${JSON.stringify(path)};`);
      pieces.push(`'src="' + ${name} + '"'`);
    } else {
      imports.push(
        `import ${name} from ${JSON.stringify(`${path}?w=1200&format=webp&quality=80`)};`,
        `import ${name}set from ${JSON.stringify(`${path}?w=400;800;1200;1600&format=webp&quality=80&as=srcset`)};`,
      );
      // The article column is max-w-3xl (768px).
      pieces.push(`'src="' + ${name} + '" srcset="' + ${name}set + '" sizes="(min-width: 768px) 768px, 100vw"'`);
    }
    last = match.index + whole.length;
  }
  pieces.push(JSON.stringify(clean.slice(last)));
  return `${imports.join("\n")}\nexport const html = ${pieces.join(" + ")};\n`;
}

export default function articles() {
  // One conversion per build (Word documents are slow to convert), shared by every module that needs it.
  let cached = null;
  const load = () => (cached ??= loadArticles());

  return {
    name: "articles",
    buildStart() {
      cached = null;
    },
    resolveId(id) {
      if (id === LIST_ID || id.startsWith(ITEM_PREFIX)) return `\0${id}`;
    },
    async load(id) {
      if (id === `\0${LIST_ID}`) {
        this.addWatchFile(ARTICLES_DIR);
        const list = await load();
        const meta = list.map(({ slug, title, date, excerpt, cover, coverAlt, author, readingMinutes }) => ({
          slug,
          title,
          date,
          excerpt,
          cover,
          coverAlt,
          author,
          readingMinutes,
        }));
        const loaders = list
          .map((a) => `  ${JSON.stringify(a.slug)}: () => import(${JSON.stringify(ITEM_PREFIX + a.slug)}),`)
          .join("\n");
        return `export const articles = ${JSON.stringify(meta)};\nexport const loaders = {\n${loaders}\n};\n`;
      }
      if (id.startsWith(`\0${ITEM_PREFIX}`)) {
        const slug = id.slice(ITEM_PREFIX.length + 1);
        const article = (await load()).find((a) => a.slug === slug);
        if (!article) throw new Error(`[articles] no published article "${slug}"`);
        return articleModule(article.html);
      }
    },
    // Dev server: reload when an article or Word document is added, edited or removed.
    configureServer(server) {
      server.watcher.add([ARTICLES_DIR, DOCUMENTS_DIR]);
      const onChange = (file) => {
        if (!file.startsWith(ARTICLES_DIR) && !file.startsWith(DOCUMENTS_DIR)) return;
        cached = null;
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
