// Reads the Markdown articles in src/content/articles (written by Pages CMS, see .pages.yml).
// Shared by the Vite plugin that turns each file into a module and by the post-build step that
// writes the sitemap and RSS feed, so both agree on slugs and on what counts as published.
import { readFileSync, readdirSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { marked } from "marked";

export const ARTICLES_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../src/content/articles");

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

export function parseArticle(file, source) {
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error(`[articles] ${file}: expected YAML frontmatter between --- lines`);
  const data = yaml.load(match[1]) ?? {};
  const body = match[2].trim();
  if (!data.title) throw new Error(`[articles] ${file}: missing "title"`);

  const date = toIsoDate(data.date, file);
  const words = body.split(/\s+/).filter(Boolean).length;

  return {
    slug: slugFromFile(file),
    title: String(data.title),
    date,
    excerpt: data.excerpt ? String(data.excerpt).trim() : "",
    cover: data.cover ? String(data.cover) : null,
    coverAlt: data.coverAlt ? String(data.coverAlt) : "",
    author: data.author ? String(data.author) : null,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    // Drafts never ship; future-dated articles appear on the first build on or after their date.
    published: !isTrue(data.draft) && new Date(date).getTime() <= Date.now(),
    body,
  };
}

export const renderMarkdown = (body) => marked.parse(body, { async: false, gfm: true });

export function loadArticles() {
  let files = [];
  try {
    files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    // no articles folder yet
  }
  const articles = files.map((f) => parseArticle(f, readFileSync(resolve(ARTICLES_DIR, f), "utf8")));
  const seen = new Map();
  for (const a of articles) {
    if (seen.has(a.slug)) throw new Error(`[articles] "${a.slug}" is used by two files; rename one of them`);
    seen.set(a.slug, a);
  }
  return articles.filter((a) => a.published).sort((a, b) => b.date.localeCompare(a.date));
}
