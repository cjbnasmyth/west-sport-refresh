import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface BrandLogoCarouselProps {
  logos: string[];
  speed?: number; // px per second
}

// Every slot is the same width (w-56 = 224px), so the loop length is known without measuring.
const SLOT_WIDTH = 224;

const BrandLogoCarousel = ({ logos, speed = 50 }: BrandLogoCarouselProps) => {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        // Logos are rendered twice; sliding the track by -50% and repeating gives a seamless loop.
        const loop = gsap.to(track.current, {
          xPercent: -50,
          ease: "none",
          repeat: -1,
          duration: (logos.length * SLOT_WIDTH) / speed,
        });

        // Scrolling briefly speeds the strip up; hovering eases it to a stop.
        let boost = 0;
        let hovering = false;
        ScrollTrigger.create({
          onUpdate: (self) => {
            boost = Math.min(4, Math.abs(self.getVelocity()) / 500);
          },
        });
        const tick = () => {
          boost *= 0.94;
          const target = hovering ? 0 : 1 + boost;
          loop.timeScale(gsap.utils.interpolate(loop.timeScale(), target, 0.08));
        };
        gsap.ticker.add(tick);

        const el = root.current!;
        const onEnter = () => (hovering = true);
        const onLeave = () => (hovering = false);
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          gsap.ticker.remove(tick);
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: root, dependencies: [logos.length, speed] },
  );

  const allLogos = [...logos, ...logos];

  return (
    <div
      ref={root}
      className="relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div ref={track} className="flex w-max">
        {allLogos.map((logo, i) => (
          <div key={i} className="w-56 shrink-0 px-4" aria-hidden={i >= logos.length}>
            <div className="group flex h-24 items-center justify-center rounded-2xl border border-border/70 bg-white px-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <img
                src={logo}
                alt={i < logos.length ? "Brand logo" : ""}
                className="max-h-14 max-w-full object-contain grayscale opacity-70 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                draggable={false}
                decoding="async"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandLogoCarousel;
