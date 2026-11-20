import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import "./index.css";

// Pre-rendered to static HTML at build time (`vite-react-ssg build`), then hydrated in the browser.
export const createRoot = ViteReactSSG({ routes, basename: import.meta.env.BASE_URL });
