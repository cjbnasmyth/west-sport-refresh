# Copilot Instructions for AI Agents

## Project Overview
- **Stack:** Vite + React + TypeScript + Tailwind CSS + shadcn-ui
- **Purpose:** Modern web app for West Sport, with a focus on dynamic content (e.g., LinkedIn blog posts) and a clean, component-driven UI.

## Key Architecture & Patterns
- **Entry Point:** `src/main.tsx` bootstraps the React app.
- **App Shell:** `src/App.tsx` is the root component.
- **UI Components:**
  - All major UI is in `src/components/` (e.g., `Navbar.tsx`, `Footer.tsx`, `Blog.tsx`).
  - Reusable primitives and UI patterns are in `src/components/ui/` (e.g., `button.tsx`, `card.tsx`).
- **Pages:**
  - The single page is `src/pages/Index.tsx`.
- **Utilities:**
  - Shared helpers in `src/lib/utils.ts`.
- **Config:**
  - Build-time env vars `VITE_LINKEDIN_PROFILE_URL` and `VITE_LINKEDIN_POST_URNS` are read via `import.meta.env` (see `Blog.tsx`). There is no backend; the site is fully static.

## Developer Workflows
- **Install:** `npm i`
- **Dev Server:** `npm run dev` (hot reloads, Vite-powered)
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Lint:** `npm run lint`
- **Config:**
  - Tailwind: `tailwind.config.ts`
  - Vite: `vite.config.ts`
  - TypeScript: `tsconfig*.json`

## Project Conventions
- **Component Naming:** PascalCase for React components, camelCase for hooks/utilities.
- **Styling:** Tailwind utility classes, with custom classes in `App.css`/`index.css`.
- **UI Patterns:** Favor composition via `src/components/ui/` primitives.
- **Environment Variables:** All runtime config is via `VITE_*` env vars (see `.env` and usage in components).

## Integration Points
- **LinkedIn Insights:** `scripts/fetch-linkedin-posts.mjs` (runs as `prebuild`, or `npm run posts`) snapshots the latest posts from the public profile at `VITE_LINKEDIN_PROFILE_URL` (or the pinned `VITE_LINKEDIN_POST_URNS`) into `src/data/linkedin-posts.json`; `Blog.tsx` renders them as cards linking to LinkedIn.
- **shadcn-ui:** Only the primitives in use are kept in `src/components/ui/`; add more with `npx shadcn@latest add <component>`.

## Examples
- To add a new UI primitive, place it in `src/components/ui/` and follow the existing pattern (export a React component, use Tailwind for styling).

---
For more, see `README.md`.
