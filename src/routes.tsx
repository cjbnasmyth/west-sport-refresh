import { Outlet, ScrollRestoration } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import Index from "./pages/Index";
import ArticlesIndex from "./pages/ArticlesIndex";
import ArticlePage, { loader as articleLoader } from "./pages/ArticlePage";
import NotFound from "./pages/NotFound";
import { articles } from "./content";

// New pages open at the top; Back returns to where you were.
const Layout = () => (
  <>
    <ScrollRestoration />
    <Outlet />
  </>
);

// Every route here is written out as its own index.html at build time. Trailing slashes match the
// folder-per-page output, which is how Cloudflare Pages serves them.
export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Index /> },
      { path: "articles", element: <ArticlesIndex /> },
      {
        path: "articles/:slug",
        element: <ArticlePage />,
        loader: articleLoader,
        errorElement: <NotFound />,
        getStaticPaths: () => articles.map((a) => `articles/${a.slug}`),
      },
      // Rendered as dist/404/index.html and moved to dist/404.html after the build (scripts/postbuild.mjs).
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
