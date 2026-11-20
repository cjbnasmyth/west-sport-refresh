import { bio } from "@/content";

// Square photo on the left, text on the right (stacked on small screens), under a centred heading.
const Bio = () => {
  return (
    <section id="bio" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 data-reveal="heading" className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {bio.title}
          </h2>
          <p data-reveal="up" className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {bio.intro}
          </p>
        </div>

        <div className="grid lg:grid-cols-[20rem_1fr] gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Shown at up to 320px; a square upload of at least 800×800 stays sharp on high-density screens.
              Non-square photos are cropped, biased upwards to keep faces in frame. */}
          <div data-reveal="image" className="mx-auto w-full max-w-xs aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={bio.image.src}
              alt={bio.image.alt}
              className="w-full h-full object-cover object-[center_25%]"
              width={640}
              height={640}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div data-reveal="right" className="space-y-6">
            {bio.paragraphs.map((text, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bio;
