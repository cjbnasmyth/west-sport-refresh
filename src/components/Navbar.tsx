import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRight, Linkedin, Mail } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL;
const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_PROFILE_URL || "https://www.linkedin.com/";
const EMAIL = "info@26westsport.com";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Insights", href: "#blog" },
];
const menuLinks = [...navLinks, { name: "Contact", href: "#contact" }];
const TRACKED_SECTIONS = ["about", "services", "blog", "contact"];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollToHash = (hash: string) =>
  document.querySelector(hash)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-deep focus-visible:ring-offset-2";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const isOpenRef = useRef(false);
  const pendingHash = useRef<string | null>(null);
  const lastNavClick = useRef(0);

  // --- Intro, scrolled surface, hide-on-scroll and magnetic CTA ---
  useGSAP(
    () => {
      const header = headerRef.current!;

      // The capsule's glass surface appears once the page has scrolled a little (styled via data-scrolled).
      ScrollTrigger.create({
        start: 24,
        end: "max",
        onToggle: (self) => {
          header.dataset.scrolled = String(self.isActive);
        },
      });

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          finePointer: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { motion, finePointer } = ctx.conditions!;
          if (!motion) return;

          // Quiet intro so it doesn't compete with the hero headline.
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from("[data-anim=nav-logo]", { y: -8, autoAlpha: 0, duration: 0.6 }, 0.15)
            .from("[data-anim=nav-item]", { y: -8, autoAlpha: 0, duration: 0.5, stagger: 0.06 }, 0.35);

          // Hide while scrolling down past the hero, reveal on any scroll up.
          let hidden = false;
          const setHidden = (value: boolean) => {
            if (value === hidden) return;
            hidden = value;
            gsap.to(header, { yPercent: value ? -140 : 0, duration: value ? 0.45 : 0.5, ease: "power3.out" });
          };
          ScrollTrigger.create({
            onUpdate: (self) => {
              if (self.direction === -1 || window.scrollY < window.innerHeight) return setHidden(false);
              const guarded =
                isOpenRef.current ||
                header.matches(":focus-within") ||
                performance.now() - lastNavClick.current < 900;
              if (!guarded && Math.abs(self.getVelocity()) > 300) setHidden(true);
            },
          });

          if (!finePointer) return;

          // CTA leans a few pixels toward the cursor.
          const cta = ctaRef.current!;
          const xTo = gsap.quickTo(cta, "x", { duration: 0.5, ease: "power3" });
          const yTo = gsap.quickTo(cta, "y", { duration: 0.5, ease: "power3" });
          const onMove = (e: PointerEvent) => {
            const r = cta.getBoundingClientRect();
            xTo(gsap.utils.clamp(-6, 6, (e.clientX - (r.left + r.width / 2)) * 0.2));
            yTo(gsap.utils.clamp(-6, 6, (e.clientY - (r.top + r.height / 2)) * 0.3));
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };
          cta.addEventListener("pointermove", onMove);
          cta.addEventListener("pointerleave", onLeave);
          return () => {
            cta.removeEventListener("pointermove", onMove);
            cta.removeEventListener("pointerleave", onLeave);
          };
        },
      );
    },
    { scope: headerRef },
  );

  // --- Active section: whichever section crosses the middle of the viewport ---
  // IntersectionObserver rather than ScrollTrigger: this component mounts before the hero's pin
  // exists, so element-based ScrollTrigger positions created here would be wrong.
  useEffect(() => {
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        setActive(TRACKED_SECTIONS.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    TRACKED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // --- Sliding highlight behind the active link ---
  useEffect(() => {
    const indicator = indicatorRef.current!;
    const place = (animate: boolean) => {
      const link = active ? linksRef.current?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
      if (!link) {
        gsap.to(indicator, { autoAlpha: 0, duration: animate ? 0.3 : 0 });
        return;
      }
      // Measure against the container (offsetLeft breaks once the intro leaves transforms on the <li>s).
      const box = link.getBoundingClientRect();
      const target = { x: box.left - linksRef.current!.getBoundingClientRect().left, width: box.width };
      const wasHidden = Number(gsap.getProperty(indicator, "opacity")) === 0;
      if (!animate || wasHidden) gsap.set(indicator, target);
      gsap.to(indicator, {
        ...(animate && !wasHidden ? target : {}),
        autoAlpha: 1,
        duration: animate ? 0.5 : 0,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    };
    place(!prefersReducedMotion());
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    document.fonts.ready.then(onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  // --- Mobile menu ---
  const openMenu = () => {
    const overlay = overlayRef.current!;
    menuTl.current?.kill();
    const t = toggleRef.current!.getBoundingClientRect();
    const cx = t.left + t.width / 2;
    const cy = t.top + t.height / 2;
    const radius = Math.hypot(window.innerWidth, window.innerHeight);
    const focusFirst = () => overlay.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });

    const tl = gsap.timeline({ onReverseComplete: afterClose }).set(overlay, { autoAlpha: 1 });
    if (prefersReducedMotion()) {
      tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 }).call(focusFirst);
    } else {
      tl.fromTo(
        overlay,
        { clipPath: `circle(0px at ${cx}px ${cy}px)` },
        { clipPath: `circle(${radius}px at ${cx}px ${cy}px)`, duration: 0.7, ease: "power3.inOut" },
      )
        .call(focusFirst, [], 0.1)
        .from(overlay.querySelectorAll("[data-menu-line]"), { yPercent: 110, duration: 0.8, ease: "power4.out", stagger: 0.07 }, 0.35)
        .from(overlay.querySelectorAll("[data-menu-extra]"), { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.05 }, 0.6);
    }
    menuTl.current = tl;
  };

  const closeMenu = () => {
    if (!menuTl.current) return afterClose();
    menuTl.current.timeScale(1.6).reverse();
  };

  function afterClose() {
    gsap.set(overlayRef.current, { clearProps: "clipPath" });
    const hash = pendingHash.current;
    pendingHash.current = null;
    if (hash) scrollToHash(hash);
    else toggleRef.current?.focus();
  }

  useEffect(() => {
    isOpenRef.current = isOpen;
    const page = [document.getElementById("main"), document.querySelector("footer")];

    if (!isOpen) {
      if (menuTl.current) closeMenu();
      return;
    }

    // Everything behind the dialog becomes inert (native focus trap + hidden from screen readers).
    page.forEach((el) => el?.setAttribute("inert", ""));
    document.documentElement.style.overflow = "hidden";
    openMenu();

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (e: MediaQueryListEvent) => e.matches && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      page.forEach((el) => el?.removeAttribute("inert"));
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
    // openMenu/closeMenu only touch refs, so they don't need to be dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onNavClick = () => {
    lastNavClick.current = performance.now();
  };

  const onMenuLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavClick();
    pendingHash.current = href; // scroll once the overlay has closed
    setIsOpen(false);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        data-scrolled="false"
        data-menu={isOpen ? "open" : "closed"}
        className="group/header pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "pointer-events-auto mx-auto flex h-14 max-w-[1080px] items-center justify-between gap-4 rounded-full border border-transparent pl-1.5 pr-1.5 md:h-[60px] md:pl-3",
            "transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]",
            "group-data-[scrolled=true]/header:border-navy/10 group-data-[scrolled=true]/header:bg-white/70 group-data-[scrolled=true]/header:shadow-[0_8px_30px_hsl(var(--navy)/0.08)] group-data-[scrolled=true]/header:backdrop-blur-lg group-data-[scrolled=true]/header:backdrop-saturate-150",
            "group-data-[menu=open]/header:!border-transparent group-data-[menu=open]/header:!bg-transparent group-data-[menu=open]/header:!shadow-none group-data-[menu=open]/header:!backdrop-blur-none",
          )}
        >
          {/* Logo: full lockup at the top of the page, compact mark once scrolled (or over the menu) */}
          <a
            data-anim="nav-logo"
            href="#home"
            onClick={onNavClick}
            aria-label="26 West Sport, back to top"
            className={cn("relative flex h-11 items-center rounded-full", focusRing)}
          >
            <span className="flex items-center gap-2.5 pl-1 transition duration-300 motion-reduce:transition-none group-data-[menu=open]/header:-translate-x-1.5 group-data-[scrolled=true]/header:-translate-x-1.5 group-data-[menu=open]/header:opacity-0 group-data-[scrolled=true]/header:opacity-0">
              <img src={`${BASE}logo/mark.png`} alt="" className="h-7 w-auto md:h-8" />
              <img src={`${BASE}logo/wordmark-navy.png`} alt="" className="h-7 w-auto md:h-8" />
            </span>
            <span className="absolute inset-y-0 left-0 flex scale-90 items-center gap-2.5 opacity-0 transition duration-300 motion-reduce:transition-none group-data-[menu=open]/header:scale-100 group-data-[scrolled=true]/header:scale-100 group-data-[menu=open]/header:opacity-100 group-data-[scrolled=true]/header:opacity-100">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy">
                <img src={`${BASE}logo/mark.png`} alt="" className="w-7" />
              </span>
              <img src={`${BASE}logo/word-navy.png`} alt="" className="hidden h-4 w-auto sm:block group-data-[menu=open]/header:!hidden" />
              <img src={`${BASE}logo/word-white.png`} alt="" className="hidden h-4 w-auto group-data-[menu=open]/header:block" />
            </span>
          </a>

          {/* Desktop links + sliding active highlight */}
          <div ref={linksRef} className="relative hidden items-center md:flex">
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute left-0 top-1/2 -mt-[18px] h-9 rounded-full bg-navy/[0.07] opacity-0"
            />
            <ul className="flex items-center">
              {navLinks.map((link) => (
                <li key={link.href} data-anim="nav-item">
                  <a
                    href={link.href}
                    onClick={onNavClick}
                    aria-current={active === link.href.slice(1) ? "location" : undefined}
                    className={cn(
                      "relative z-10 block rounded-full px-4 py-2 text-sm font-semibold tracking-[0.02em] text-navy transition-colors duration-200 hover:bg-navy/[0.04]",
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
          </div>

          <div className="flex items-center gap-1.5">
            {/* Desktop CTA */}
            <div data-anim="nav-item" className="hidden md:block">
              <a
                ref={ctaRef}
                href="#contact"
                onClick={onNavClick}
                aria-current={active === "contact" ? "location" : undefined}
                className={cn(
                  "group/cta flex h-11 items-center gap-3 rounded-full bg-coral-deep pl-5 pr-1.5 text-sm font-semibold text-white transition-[background-color,box-shadow] duration-300 hover:bg-[hsl(12_85%_41%)]",
                  active === "contact" && "ring-2 ring-coral-deep/30 ring-offset-2",
                  focusRing,
                )}
              >
                Let's talk
                <span className="cta-arrow grid h-8 w-8 place-items-center rounded-full bg-white text-navy transition-transform duration-300 group-hover/cta:scale-[1.08] motion-reduce:transition-none">
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </a>
            </div>

            {/* Mobile: compact CTA + menu toggle. The intro animates the wrapper because GSAP would read the
                CTA's own CSS opacity transition mid-flight and settle at 0. */}
            <div data-anim="nav-item" className="md:hidden">
              <a
                href="#contact"
                onClick={onNavClick}
                aria-label="Contact us"
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full bg-coral-deep text-white transition-opacity group-data-[menu=open]/header:pointer-events-none group-data-[menu=open]/header:opacity-0",
                  focusRing,
                )}
              >
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
            <button
              data-anim="nav-item"
              ref={toggleRef}
              type="button"
              aria-controls="site-menu"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen((open) => !open)}
              className={cn(
                "group/toggle grid h-11 w-11 place-items-center rounded-full text-navy transition-colors md:hidden group-data-[menu=open]/header:text-white",
                focusRing,
              )}
            >
              <span className="relative block h-3.5 w-[18px]">
                <span className="absolute left-0 top-[3px] h-0.5 w-full rounded-full bg-current transition-transform duration-300 group-aria-expanded/toggle:translate-y-[3px] group-aria-expanded/toggle:rotate-45 motion-reduce:transition-none" />
                <span className="absolute bottom-[3px] left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-300 group-aria-expanded/toggle:-translate-y-[3px] group-aria-expanded/toggle:-rotate-45 motion-reduce:transition-none" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu (always mounted so it can animate out) */}
      <div
        ref={overlayRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="invisible fixed inset-0 z-40 flex flex-col overflow-y-auto bg-navy px-6 pb-10 pt-28 text-white opacity-0 md:hidden"
      >
        <ol className="space-y-1">
          {menuLinks.map((link, i) => (
            <li key={link.href} className="overflow-hidden">
              <a
                href={link.href}
                onClick={(e) => onMenuLinkClick(e, link.href)}
                aria-current={active === link.href.slice(1) ? "location" : undefined}
                className="block rounded-lg py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              >
                <span data-menu-line className="flex items-baseline gap-4 font-serif text-4xl tracking-tight">
                  <span className="font-sans text-sm font-semibold tabular-nums text-coral">{String(i + 1).padStart(2, "0")}</span>
                  {link.name}
                </span>
              </a>
            </li>
          ))}
        </ol>

        <div className="mt-auto space-y-8 pt-12">
          <a
            data-menu-extra
            href="#contact"
            onClick={(e) => onMenuLinkClick(e, "#contact")}
            className="inline-flex h-12 items-center gap-3 rounded-full bg-coral-deep pl-6 pr-2 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Let's talk
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-navy">
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </a>
          <div data-menu-extra className="flex items-center justify-between border-t border-white/15 pt-6 text-sm text-white/70">
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 hover:text-white">
              <Mail aria-hidden="true" className="h-4 w-4" />
              {EMAIL}
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="26 West Sport on LinkedIn"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 hover:text-white"
            >
              <Linkedin aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
