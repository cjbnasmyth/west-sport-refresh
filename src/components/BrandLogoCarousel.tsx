import { useEffect, useRef, useState, type CSSProperties } from "react";

interface BrandLogoCarouselProps {
  logos: string[];
  speed?: number; // px per second
}

const BrandLogoCarousel = ({ logos, speed = 60 }: BrandLogoCarouselProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(30);

  // Derive the animation duration from the rendered width so the speed stays constant
  // regardless of logo sizes. Re-measures as images load or the viewport changes.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const ro = new ResizeObserver(() => {
      const singleRowWidth = row.scrollWidth / 2;
      if (singleRowWidth > 0) setDuration(singleRowWidth / speed);
    });
    ro.observe(row);
    return () => ro.disconnect();
  }, [speed]);

  // Logos are rendered twice and the row translates by -50%, so the loop is seamless.
  // Spacing uses padding (not flex gap) so both halves are exactly the same width.
  const allLogos = [...logos, ...logos];

  return (
    <div className="relative h-80 w-full overflow-hidden py-20">
      <div
        ref={rowRef}
        className="absolute left-0 top-1/2 -translate-y-1/2"
      >
        <div
          className="flex w-max items-center animate-marquee motion-reduce:animate-none"
          style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
        >
          {allLogos.map((logo, i) => (
            <div key={i} className="shrink-0 pr-40" aria-hidden={i >= logos.length}>
              <img
                src={logo}
                alt={i < logos.length ? "Brand logo" : ""}
                className="h-32 w-auto max-w-none grayscale opacity-60"
                draggable={false}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandLogoCarousel;
