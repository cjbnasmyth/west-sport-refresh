import { ArrowUp, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/content";
import { useSectionHref } from "@/lib/links";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-deep focus-visible:ring-offset-2";

// lucide only ships the old Twitter bird, so draw the current X mark.
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { name: "LinkedIn", href: site.social.linkedin, Icon: Linkedin },
  { name: "X", href: site.social.x, Icon: XLogo },
];

const backToTop = () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  // Move keyboard focus back to the start of the content too.
  document.getElementById("main")?.focus({ preventScroll: true });
};

const Footer = () => {
  const sectionHref = useSectionHref();

  return (
    <footer className="border-t border-navy/10 bg-background">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div data-reveal="stagger" className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <a
            href={sectionHref("#home")}
            aria-label={`${site.name}, back to top`}
            className={cn("flex items-center gap-2.5 self-start rounded-full lg:self-auto", focusRing)}
          >
            <img src={site.logos.mark} alt="" className="h-7 w-auto" />
            <img src={site.logos.wordNavy} alt="" className="h-4 w-auto" />
          </a>

          <nav aria-label="Footer">
            <ul className="-mx-3 flex flex-wrap items-center gap-x-1">
              {[...site.nav, site.contactLink].map((link) => (
                <li key={link.href}>
                  <a
                    href={sectionHref(link.href)}
                    className={cn(
                      "block rounded-full px-3 py-2.5 text-sm font-semibold tracking-[0.02em] text-navy transition-colors duration-200 hover:bg-navy/[0.04]",
                      focusRing,
                    )}
                  >
                    <span className="nav-roll">
                      <span>{link.name}</span>
                      <span aria-hidden="true">{link.name}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className={cn(
                "rounded-sm text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-navy hover:underline",
                focusRing,
              )}
            >
              {site.email}
            </a>
            <ul className="flex items-center gap-2">
              {socialLinks.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} (opens in a new tab)`}
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-full border border-navy/15 text-navy transition-colors duration-200 hover:border-navy hover:bg-navy hover:text-white",
                      focusRing,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          data-reveal="up"
          className="mt-10 flex items-center justify-between gap-4 border-t border-navy/10 pt-6 text-sm text-muted-foreground"
        >
          <p>&copy; {new Date().getFullYear()} {site.name}</p>
          <button
            type="button"
            onClick={backToTop}
            className={cn("group inline-flex items-center gap-2 rounded-full py-2 font-medium transition-colors hover:text-navy", focusRing)}
          >
            {site.footer.backToTop}
            <ArrowUp
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
