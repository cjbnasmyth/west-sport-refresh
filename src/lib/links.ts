import { useLocation } from "react-router-dom";

// Section links in the content ("#about") only work on the homepage; elsewhere they point back to it.
export function useSectionHref() {
  const { pathname } = useLocation();
  return (href: string) => (href.startsWith("#") && pathname !== "/" ? `/${href}` : href);
}
