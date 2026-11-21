# 26 West Sport

Marketing site and articles for 26 West Sport, at https://26westsport.com. Built with Vite, React 18, React Router, TypeScript and Tailwind CSS (with a few shadcn/ui primitives in `src/components/ui/`). Every page is pre-rendered to static HTML at build time with [vite-react-ssg](https://github.com/Daydreamer-riri/vite-react-ssg), then hydrated in the browser.

## Development

```sh
npm ci
npm run dev       # dev server with server rendering, like production (prints its URL)
npm run build     # pre-renders every page to dist/, plus 404.html, sitemap.xml and rss.xml
npm run preview   # serve dist/ locally
npm run lint
```

## Editing content

All site copy and imagery lives in `src/content/`:

| File | Contents |
|---|---|
| `site.json` | Company name, site URL, homepage title and description, email, social links, logos, navigation, header/footer labels |
| `hero.json` | Headline and hero image |
| `about.json` | About heading, paragraphs, stats and image |
| `services.json` | Services heading, intro, background image and service cards |
| `bio.json` | Bio heading, subtitle, paragraphs, square photo and the LinkedIn button under it (the section after Services) |
| `contact.json` | Contact heading, form labels/placeholders and contact details text |
| `articles.json` | Text around the articles: homepage section, all-articles page, article page and 404 page |
| `articles/` | One Markdown file per article (see below) |
| `images/` | Every image the site uses. Reference them from the JSON as `/images/<path>`, e.g. `"/images/football.webp"` or `"/images/logo/mark.png"` |

Icons are referenced by name (e.g. `"target"`); the available names are listed in `src/content/index.ts`, where new [lucide](https://lucide.dev/icons) icons can be registered (also add them to the icon lists in `.pages.yml`). A missing image or unknown icon name fails loudly with an error naming the file.

The content can also be edited in the browser with [Pages CMS](https://app.pagescms.org), configured by `.pages.yml`. Uploaded images go to `src/content/images`, and every save commits to `main`, which redeploys the site.

## Articles

Articles are written and published in Pages CMS (**Articles** in the sidebar). Only people with access to the GitHub repo, or who are invited in Pages CMS, can publish; the website itself has no accounts and nothing for visitors to upload to.

Each article is a Markdown file in `src/content/articles/` named `YYYY-MM-DD-title.md`, with YAML frontmatter:

```md
---
title: Why Rights Holders Need Better Data
date: 2026-11-20
excerpt: Shown on cards, under the headline and in link previews.
cover: /images/articles/cover.webp
coverAlt: Describe the cover image
author: Murray Barnett
draft: false
---
The article body in Markdown.
```

- The address comes from the filename without the date: `/articles/why-rights-holders-need-better-data/`. Renaming the file changes the URL.
- Instead of writing in the editor, editors can upload a Word document (`document: /documents/<file>.docx`, stored in `src/content/documents/`). If one is attached it replaces the editor text: [mammoth](https://github.com/mwilliamson/mammoth.js) converts it at build time, with Word's Heading 1–3 styles becoming the article's section headings, Quote styles becoming pull quotes, and embedded images bundled like any other image. The document's Title paragraph is dropped (the CMS title is used), as are fonts, colours, text boxes and comments. The .docx itself is never published.
- `draft: true` keeps an article off the site entirely. A future `date` holds it back until the first build on or after that date (any later save in the CMS triggers one).
- The homepage shows the three newest articles; `/articles/` lists them all. Until the first article is published, both show the "no articles yet" message from `articles.json`.
- `scripts/vite-plugin-articles.mjs` parses and renders the Markdown at build time, so it never reaches the browser, and bundles any `/images/...` it references. `scripts/articles.mjs` holds the rules shared with the sitemap and RSS feed.

## Deployment

The site is hosted on Cloudflare (Workers Builds), which builds (`npm run build`) and publishes `dist/` on every push to `main`, including every Pages CMS save. There are no build-time environment variables.
