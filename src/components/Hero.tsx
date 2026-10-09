import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import footballImage from "@/assets/football.webp";
import BrandLogoCarousel from "./BrandLogoCarousel";

const BRAND_LOGOS = [1, 2, 3, 4, 5].map((n) => `${import.meta.env.BASE_URL}brand${n}.png`);

const Hero = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          finePointer: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { motion, finePointer } = ctx.conditions!;
          if (!motion) return;

          const section = root.current!;
          const q = gsap.utils.selector(section);
          const headline = q("[data-anim=headline]")[0];
          const stage = q("[data-anim=stage]")[0];
          const tilt = q("[data-anim=tilt]")[0];
          const blocks = q("[data-anim=block]");

          // --- Intro: hide before first paint, play once the headline font is ready ---
          gsap.set(headline, { visibility: "hidden" });
          gsap.set(q("[data-anim=laptop]"), { autoAlpha: 0, y: 120 });
          gsap.set(q("[data-anim=screen]"), { clipPath: "inset(50% 0% 50% 0%)" });
          gsap.set(blocks, { scale: 0, rotation: -30 });
          gsap.set(q("[data-anim=trusted]"), { autoAlpha: 0, y: 30 });

          let cancelled = false;
          document.fonts.ready.then(() => {
            if (cancelled) return;
            ctx.add(() => {
              const split = SplitText.create(headline, { type: "chars,words" });
              gsap
                .timeline({ defaults: { ease: "power4.out" } })
                .set(headline, { visibility: "visible" })
                .from(split.chars, {
                  yPercent: 90,
                  rotationX: -90,
                  opacity: 0,
                  transformOrigin: "50% 100%",
                  duration: 1,
                  stagger: 0.035,
                })
                .to(q("[data-anim=laptop]"), { autoAlpha: 1, y: 0, duration: 1.4 }, "-=0.7")
                .to(q("[data-anim=screen]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" }, "-=0.9")
                .to(blocks, { scale: 1, rotation: 0, duration: 1, stagger: 0.12, ease: "back.out(1.6)" }, "-=0.9")
                .to(q("[data-anim=trusted]"), { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.6")
                .add(() => split.revert());
            });
          });

          // --- Scroll: laptop straightens while pinned, image drifts, headline and accent blocks parallax ---
          // The laptop pins in the middle of the viewport until it has rotated fully upright.
          gsap.fromTo(
            q("[data-anim=scroll-tilt]"),
            { rotationX: 24, scale: 0.9 },
            {
              rotationX: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: stage,
                start: "clamp(center center)",
                end: "+=700",
                pin: true,
                scrub: 0.6,
                anticipatePin: 1,
              },
            },
          );
          gsap.to(headline, {
            y: -60,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "+=400", scrub: 0.6 },
          });
          gsap.fromTo(
            q("[data-anim=screen-img]"),
            { scale: 1.15, yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
            },
          );
          q("[data-anim=block-wrap]").forEach((el) => {
            const depth = Number((el as HTMLElement).dataset.depth);
            gsap.to(el, {
              y: depth * 160,
              rotation: depth * 12,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
            });
          });

          // --- Pointer: laptop tilts toward the cursor, blocks drift the other way, screen glare follows ---
          if (!finePointer) return () => (cancelled = true);

          const tiltY = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3" });
          const tiltX = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3" });
          const blockMovers = blocks.map((el) => ({
            depth: Number((el.parentElement as HTMLElement).dataset.depth),
            x: gsap.quickTo(el, "x", { duration: 1, ease: "power3" }),
            y: gsap.quickTo(el, "y", { duration: 1, ease: "power3" }),
          }));

          const onMove = (e: PointerEvent) => {
            const r = stage.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            tiltY(gsap.utils.clamp(-8, 8, nx * 12));
            tiltX(gsap.utils.clamp(-6, 6, -ny * 10));
            blockMovers.forEach((b) => {
              b.x(nx * -60 * Math.abs(b.depth));
              b.y(ny * -60 * Math.abs(b.depth));
            });
            stage.style.setProperty("--glare-x", `${(nx + 0.5) * 100}%`);
            stage.style.setProperty("--glare-y", `${(ny + 0.5) * 100}%`);
          };
          const onLeave = () => {
            tiltY(0);
            tiltX(0);
            blockMovers.forEach((b) => {
              b.x(0);
              b.y(0);
            });
          };

          section.addEventListener("pointermove", onMove);
          section.addEventListener("pointerleave", onLeave);
          return () => {
            cancelled = true;
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerleave", onLeave);
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="home" className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Heading */}
          <h1
            data-anim="headline"
            className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-16 text-center leading-tight [perspective:600px]"
          >
            Unparalleled Advice.
          </h1>

          {/* Laptop Mockup Section */}
          <div data-anim="stage" className="group relative mx-auto max-w-5xl [perspective:1600px]">
            {/* Coral accent blocks (outer wrapper: scroll parallax, inner block: intro + pointer drift) */}
            <div
              data-anim="block-wrap"
              data-depth="-1"
              className="absolute -left-32 top-1/2 -mt-32 w-64 h-64 -z-10 hidden lg:block"
            >
              <div data-anim="block" className="w-full h-full bg-coral rounded-3xl" />
            </div>
            <div
              data-anim="block-wrap"
              data-depth="0.7"
              className="absolute -right-32 top-1/2 -mt-40 w-80 h-80 -z-10 hidden lg:block"
            >
              <div data-anim="block" className="w-full h-full bg-coral rounded-3xl" />
            </div>

            <div data-anim="scroll-tilt" className="[transform-style:preserve-3d]">
              <div data-anim="tilt" className="[transform-style:preserve-3d]">
                {/* Laptop Frame */}
                <div data-anim="laptop" className="relative bg-gray-900 rounded-2xl p-3 shadow-2xl">
                  {/* Screen */}
                  <div data-anim="screen" className="relative bg-black rounded-lg overflow-hidden aspect-[16/10]">
                    <img
                      data-anim="screen-img"
                      src={footballImage}
                      alt="Sports action in stadium"
                      className="w-full h-full object-cover"
                      width={1440}
                      height={960}
                      fetchPriority="high"
                    />
                    {/* Glare that follows the cursor */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay"
                      style={{
                        background:
                          "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.45), transparent 45%)",
                      }}
                    />
                  </div>
                  {/* Laptop bottom */}
                  <div className="h-4 bg-gray-800 rounded-b-xl mt-1"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted by section */}
          <div data-anim="trusted" className="mt-20 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-6">Trusted by</p>
            <BrandLogoCarousel logos={BRAND_LOGOS} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
