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
  - Route-like pages are in `src/pages/` (e.g., `Index.tsx`, `NotFound.tsx`).
- **Hooks:**
  - Custom hooks live in `src/hooks/` (e.g., `use-mobile.tsx`, `use-toast.ts`).
- **Utilities:**
  - Shared helpers in `src/lib/utils.ts`.
- **API Integration:**
  - Uses `@tanstack/react-query` for data fetching/caching (see `Blog.tsx`).
  - Environment variables (e.g., `VITE_API_URL`, `VITE_LINKEDIN_PROFILE_URL`, `VITE_LINKEDIN_POST_URNS`) are accessed via `import.meta.env`.
  - Backend API assumed to run at `http://localhost:3001` by default.

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
- **Error Handling:** User-facing errors are surfaced in the UI (see `Blog.tsx` for API error display patterns).
- **Environment Variables:** All runtime config is via `VITE_*` env vars (see `.env` and usage in components).

## Integration Points
- **LinkedIn Blog:** `Blog.tsx` fetches posts from a backend API, falls back to manual URNs if needed.
- **shadcn-ui:** Used for modern, accessible UI primitives (see `src/components/ui/`).

## Examples
- To add a new UI primitive, place it in `src/components/ui/` and follow the existing pattern (export a React component, use Tailwind for styling).
- To fetch data, use `@tanstack/react-query` and surface loading/error states in the UI.

---
For more, see `README.md` and the Lovable project dashboard.
