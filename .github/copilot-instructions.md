# Copilot Instructions for AI Agents

## Project Overview
- **Stack:** Vite + React 18 + React Router 6 + TypeScript + Tailwind CSS + a few shadcn/ui primitives, pre-rendered to static HTML with vite-react-ssg.
- **Purpose:** Marketing site and articles for 26 West Sport (https://26westsport.com), edited through Pages CMS.

## Key Architecture & Patterns
- **Entry point:** `src/main.tsx` creates the app with `ViteReactSSG`; routes live in `src/routes.tsx` (homepage, `/articles/`, `/articles/:slug/`, 404). Every route is written out as its own `index.html` at build time.
- **Pages:** `src/pages/` (`Index.tsx` is the homepage). Each page uses `PageShell` (header, footer, scroll reveals) and `PageHead` (per-page title and meta tags).
- **Components:** `src/components/` (sections such as `Hero`, `About`, `Services`, `Bio`, `Articles`, `Contact`); primitives in `src/components/ui/`.
- **Content:** all copy and images live in `src/content/` (JSON per section, `images/`, Markdown articles in `articles/`, optional Word documents in `documents/`). Components import from `@/content`, which resolves image paths and icon names. `.pages.yml` defines the Pages CMS forms for the same files.
- **Articles:** `scripts/vite-plugin-articles.mjs` + `scripts/articles.mjs` parse the Markdown (or convert an attached .docx with mammoth) at build time. `scripts/postbuild.mjs` writes `404.html`, `sitemap.xml` and `rss.xml`.

## Developer Workflows
- **Install:** `npm ci`
- **Dev server:** `npm run dev` (vite-react-ssg dev, server-rendered like production)
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Lint:** `npm run lint`

## Project Conventions
- **Component naming:** PascalCase for React components, camelCase for hooks/utilities.
- **Styling:** Tailwind utility classes, with design tokens and a few custom classes in `src/index.css`.
- **Content first:** visible text and images belong in `src/content/*.json` (and `.pages.yml`), not hard-coded in components.
- **Links:** in-app links to articles use `articlePath()` from `src/lib/links.ts` (no trailing slash; see the comment there).

---
For more, see `README.md`.
