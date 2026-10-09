import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Declarative scroll animations for everything inside `scope`. Mark elements with:
 *
 *   data-reveal="heading"  lines slide up from behind a mask
 *   data-reveal="up"       fade + rise
 *   data-reveal="left"     fade + slide in from the left (also "right")
 *   data-reveal="stagger"  each direct child fades + rises in turn
 *   data-reveal="image"    wipes open from the bottom while the image settles from a zoom
 *   data-count="15"        counts up from 0 (optional data-suffix="+")
 *   data-tilt              tilts toward the cursor and lifts on hover (fine pointers only)
 *
 * Users who prefer reduced motion get the static page.
 */
export function useScrollReveal(scope: RefObject<HTMLElement>) {
  useGSAP(
    () => {
      // Content that resizes after load (e.g. late-loading images) shifts everything below it,
      // so re-measure trigger positions whenever the page height changes.
      let refreshTimer: ReturnType<typeof setTimeout>;
      const ro = new ResizeObserver(() => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
      });
      ro.observe(document.body);

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          finePointer: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { motion, finePointer } = ctx.conditions!;
          if (!motion) return;

          const q = gsap.utils.selector(scope);
          const onEnter = (el: Element) => ({ trigger: el, start: "clamp(top 85%)", once: true });
          // Clear GSAP's inline styles afterwards so CSS hover transforms keep working.
          const settle = { clearProps: "transform,opacity,visibility" };

          q("[data-reveal=up]").forEach((el) =>
            gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease: "power3.out", ...settle, scrollTrigger: onEnter(el) }),
          );

          (["left", "right"] as const).forEach((side) =>
            q(`[data-reveal=${side}]`).forEach((el) =>
              gsap.from(el, {
                x: side === "left" ? -60 : 60,
                autoAlpha: 0,
                duration: 1.1,
                ease: "power3.out",
                ...settle,
                scrollTrigger: onEnter(el),
              }),
            ),
          );

          q("[data-reveal=stagger]").forEach((el) =>
            gsap.from(el.children, {
              y: 50,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.12,
              ...settle,
              scrollTrigger: onEnter(el),
            }),
          );

          q("[data-reveal=image]").forEach((el) => {
            gsap
              .timeline({ scrollTrigger: onEnter(el) })
              .from(el, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut", clearProps: "clipPath" })
              .from(el.querySelector("img"), { scale: 1.3, duration: 1.8, ease: "power3.out", clearProps: "transform" }, 0);
          });

          q("[data-count]").forEach((el) => {
            const target = Number((el as HTMLElement).dataset.count);
            const suffix = (el as HTMLElement).dataset.suffix ?? "";
            const counter = { value: 0 };
            el.textContent = `0${suffix}`;
            gsap.to(counter, {
              value: target,
              duration: 2,
              ease: "power2.out",
              scrollTrigger: onEnter(el),
              onUpdate: () => {
                el.textContent = `${Math.round(counter.value)}${suffix}`;
              },
            });
          });

          // Headings are split into lines, which depends on the final font metrics.
          let cancelled = false;
          document.fonts.ready.then(() => {
            if (cancelled) return;
            ctx.add(() => {
              q("[data-reveal=heading]").forEach((el) => {
                const split = SplitText.create(el, { type: "lines", mask: "lines" });
                gsap.from(split.lines, {
                  yPercent: 110,
                  duration: 1.1,
                  ease: "power4.out",
                  stagger: 0.12,
                  scrollTrigger: onEnter(el),
                  onComplete: () => split.revert(),
                });
              });
            });
          });

          if (!finePointer) return () => (cancelled = true);

          const cleanups = q("[data-tilt]").map((el) => {
            const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
            const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
            const lift = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
            // Set on enter (not up front) because the reveal's clearProps would wipe it.
            const onEnter = () => gsap.set(el, { transformPerspective: 800 });
            const onMove = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              rotY(((e.clientX - r.left) / r.width - 0.5) * 12);
              rotX(-((e.clientY - r.top) / r.height - 0.5) * 12);
              lift(-6);
            };
            const onLeave = () => {
              rotX(0);
              rotY(0);
              lift(0);
            };
            el.addEventListener("pointerenter", onEnter);
            el.addEventListener("pointermove", onMove as EventListener);
            el.addEventListener("pointerleave", onLeave);
            return () => {
              el.removeEventListener("pointerenter", onEnter);
              el.removeEventListener("pointermove", onMove as EventListener);
              el.removeEventListener("pointerleave", onLeave);
            };
          });

          return () => {
            cancelled = true;
            cleanups.forEach((fn) => fn());
          };
        },
      );

      return () => {
        ro.disconnect();
        clearTimeout(refreshTimer);
      };
    },
    { scope },
  );
}
