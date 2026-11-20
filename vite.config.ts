import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import articles from "./scripts/vite-plugin-articles.mjs";
// Adds the `ssgOptions` key to Vite's config type.
import type {} from "vite-react-ssg";

// https://vitejs.dev/config/
export default defineConfig({
  // Served from the root of 26westsport.com (Cloudflare Pages); article pages live at /articles/<slug>/.
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), articles()],
  // Pre-bundle the router up front: if the dev server discovers it late and re-optimises, the page can
  // end up with two copies of react-router and lose its router context.
  optimizeDeps: {
    include: ["react-router-dom", "react-helmet-async"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // `vite-react-ssg build` pre-renders every route to its own index.html (see src/routes.tsx).
  ssgOptions: {
    entry: "src/main.tsx",
    dirStyle: "nested",
  },
});
