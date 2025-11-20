
import React, { useRef, useEffect, useState } from "react";

interface BrandLogoCarouselProps {
  logos: string[];
  speed?: number; // px per second
}

const BrandLogoCarousel: React.FC<BrandLogoCarouselProps> = ({ logos, speed = 60 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [offset, setOffset] = useState(0);
  const [rowWidth, setRowWidth] = useState(0);

  // Calculate the total width of one row of logos (including gaps)
  useEffect(() => {
    if (rowRef.current) {
      setRowWidth(rowRef.current.scrollWidth);
    }
  }, [logos]);

  // Center the first row horizontally when we know widths
  useEffect(() => {
    if (!containerRef.current || rowWidth === 0) return;
    // rowRef contains duplicated logos, so single row width is half
    const singleRowWidth = rowWidth / 2;
    const containerWidth = containerRef.current.offsetWidth;
    // initial offset so the single row is centered in container
    const initialOffset = (containerWidth - singleRowWidth) / 2;
    setOffset(initialOffset);
  }, [rowWidth]);

  // Animate the marquee
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - lastTime;
      lastTime = now;
      setOffset((prev) => {
        let next = prev - (speed * elapsed) / 1000;
        if (rowWidth > 0 && Math.abs(next) >= rowWidth) {
          next += rowWidth;
        }
        return next;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => animationRef.current && cancelAnimationFrame(animationRef.current);
  }, [rowWidth, speed]);

  // Duplicate the logos for seamless looping
  const allLogos = [...logos, ...logos];

  return (
    <div className="overflow-hidden w-full py-20" ref={containerRef} style={{ position: 'relative', height: '20rem' }}>
      <div
        ref={rowRef}
        className="flex items-center gap-[160px] absolute top-1/2 -translate-y-1/2"
        style={{
          left: 0,
          transform: `translateX(${offset}px)`,
          transition: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {allLogos.map((logo, i) => (
          <img
            key={i + logo}
            src={logo}
            alt="Brand logo"
            className="h-32 w-auto grayscale opacity-60"
            draggable={false}
            style={{ display: 'inline-block' }}
          />
        ))}
      </div>
    </div>
  );
};

export default BrandLogoCarousel;
