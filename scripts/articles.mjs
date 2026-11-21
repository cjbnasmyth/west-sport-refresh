// Reads the Markdown articles in src/content/articles (written by Pages CMS, see .pages.yml).
// Shared by the Vite plugin that turns each file into a module and by the post-build step that
// writes the sitemap and RSS feed, so both agree on slugs and on what counts as published.
//
// An article's text comes from its attached Word document (frontmatter `document`) when there is one,
// otherwise from the Markdown body below the frontmatter.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { marked } from "marked";
import mammoth from "mammoth";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const ARTICLES_DIR = resolve(ROOT, "src/content/articles");
export const DOCUMENTS_DIR = resolve(ROOT, "src/content/documents");
// Images pulled out of Word documents; the Vite plugin imports them from here so they're bundled.
export const DOCX_IMAGES_DIR = resolve(ROOT, "node_modules/.cache/article-docx-images");
export const DOCX_IMAGE_PREFIX = "docx-image:";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

// "2026-11-20-why-data-matters.md" -> "why-data-matters"
export const slugFromFile = (file) =>
  basename(file, ".md")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// YAML turns an unquoted 2026-11-20 into a Date; the CMS may also write a quoted string or a datetime.
const toIsoDate = (value, file) => {
  const date = value instanceof Date ? value : new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) throw new Error(`[articles] ${file}: missing or invalid "date"`);
  return date.toISOString();
};

const isTrue = (value) => value === true || String(value).toLowerCase() === "true";

// "/documents/my-article.docx" (as Pages CMS writes it) -> absolute path in src/content/documents
const documentPath = (value) => resolve(DOCUMENTS_DIR, String(value).replace(/^\/?(documents\/)?/, ""));

export function parseArticle(file, source) {
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error(`[articles] ${file}: expected YAML frontmatter between --- lines`);
  const data = yaml.load(match[1]) ?? {};
  if (!data.title) throw new Error(`[articles] ${file}: missing "title"`);

  const date = toIsoDate(data.date, file);

  return {
    file,
    slug: slugFromFile(file),
    title: String(data.title),
    date,
    excerpt: data.excerpt ? String(data.excerpt).trim() : "",
    cover: data.cover ? String(data.cover) : null,
    coverAlt: data.coverAlt ? String(data.coverAlt) : "",
    author: data.author ? String(data.author) : null,
    // Drafts never ship; future-dated articles appear on the first build on or after their date.
    published: !isTrue(data.draft) && new Date(date).getTime() <= Date.now(),
    document: data.document ? documentPath(data.document) : null,
    body: match[2].trim(),
  };
}

// Word headings sit under the article's own <h1>, so shift them down a level. The document's Title
// paragraph is dropped because the article title comes from the CMS field.
const STYLE_MAP = [
  "p[style-name='Title'] => !",
  "p[style-name='Heading 1'] => h2:fresh",
  "p[style-name='Heading 2'] => h3:fresh",
  "p[style-name='Heading 3'] => h4:fresh",
  "p[style-name='Quote'] => blockquote > p:fresh",
  "p[style-name='Intense Quote'] => blockquote > p:fresh",
];

async function renderDocument(article) {
  let buffer;
  try {
    buffer = readFileSync(article.document);
  } catch {
    throw new Error(`[articles] ${article.file}: Word document not found at ${article.document}`);
  }
  mkdirSync(DOCX_IMAGES_DIR, { recursive: true });
  const { value, messages } = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: STYLE_MAP,
      // Save embedded images as files (named by content) instead of inlining them as base64.
      convertImage: mammoth.images.imgElement(async (image) => {
        const data = await image.readAsBuffer();
        const ext = (image.contentType.split("/")[1] || "png").replace("jpeg", "jpg").replace(/\+.*$/, "");
        const name = `${createHash("sha1").update(data).digest("hex").slice(0, 16)}.${ext}`;
        writeFileSync(resolve(DOCX_IMAGES_DIR, name), data);
        return { src: DOCX_IMAGE_PREFIX + name };
      }),
    },
  );
  for (const m of messages.filter((m) => m.type === "error")) {
    console.warn(`[articles] ${basename(article.document)}: ${m.message}`);
  }
  return value;
}

const renderMarkdown = (body) => marked.parse(body, { async: false, gfm: true });

const wordCount = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

// Published articles, newest first, each with its rendered `html` and reading time.
export async function loadArticles() {
  let files = [];
  try {
    files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    // no articles folder yet
  }
  const all = files.map((f) => parseArticle(f, readFileSync(resolve(ARTICLES_DIR, f), "utf8")));
  const seen = new Map();
  for (const a of all) {
    if (seen.has(a.slug)) throw new Error(`[articles] "${a.slug}" is used by two files; rename one of them`);
    seen.set(a.slug, a);
  }

  const published = all.filter((a) => a.published).sort((a, b) => b.date.localeCompare(a.date));
  return Promise.all(
    published.map(async (a) => {
      const html = a.document ? await renderDocument(a) : renderMarkdown(a.body);
      return { ...a, html, readingMinutes: Math.max(1, Math.round(wordCount(html) / 220)) };
    }),
  );
}
