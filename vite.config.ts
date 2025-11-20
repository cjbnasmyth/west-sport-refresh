import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base public path when served from GitHub Pages repository pages
  // Replace with your repo name if different
  base: "/west-sport-refresh/",
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    // Allow the ngrok host so the Vite preview server accepts proxied requests
    allowedHosts: [
      "fermentable-juan-nondeclamatory.ngrok-free.dev",
    ],
  },

}));
