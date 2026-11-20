import { useLocation } from "react-router-dom";

// Section links in the content ("#about") only work on the homepage; elsewhere they point back to it.
export function useSectionHref() {
  const { pathname } = useLocation();
  return (href: string) => (href.startsWith("#") && pathname !== "/" ? `/${href}` : href);
}

// In-app link to an article. No trailing slash: when navigating client-side, vite-react-ssg looks up the
// page's pre-rendered data by exact pathname, and its manifest keys have none ("/articles/<slug>").
// Full page loads still work either way, and canonical URLs keep the slash (see PageHead).
export const articlePath = (slug: string) => `/articles/${slug}`;
