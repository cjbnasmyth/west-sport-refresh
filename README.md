# 26 West Sport

Single-page marketing site for 26 West Sport. Built with Vite, React 18, TypeScript and Tailwind CSS (with a few shadcn/ui primitives in `src/components/ui/`).

## Development

```sh
npm ci
npm run dev       # http://localhost:8080
npm run build     # outputs static site to dist/
npm run preview   # serve dist/ locally
npm run lint
```

## Configuration

Build-time variables (read via `import.meta.env`):

| Variable | Purpose |
|---|---|
| `VITE_LINKEDIN_PROFILE_URL` | Target of the "View on LinkedIn" button |
| `VITE_LINKEDIN_POST_URNS` | Comma-separated LinkedIn post URNs embedded in the Insights section |

Locally, put them in `.env.local`. For deploys, set them as GitHub Actions repository **variables** (Settings → Secrets and variables → Actions → Variables).

## Deployment

Every push to `main` builds the site and publishes `dist/` to the `gh-pages` branch via `.github/workflows/gh-pages.yml`.
