import { ArrowUp, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/content";
import { useSectionHref } from "@/lib/links";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-deep focus-visible:ring-offset-2";

// lucide has no Threads icon, so draw it (path from Simple Icons, CC0).
const ThreadsLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
  </svg>
);

// A link with no URL set in site.json is left out.
const socialLinks = [
  { name: "LinkedIn", href: site.social.linkedin, Icon: Linkedin },
  { name: "Threads", href: site.social.threads, Icon: ThreadsLogo },
].filter((link) => link.href);

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
