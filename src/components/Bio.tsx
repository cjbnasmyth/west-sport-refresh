import { bio } from "@/content";

// Photo on the left, text on the right (stacked on small screens), under a centred heading.
const Bio = () => {
  return (
    <section id="bio" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 data-reveal="heading" className="text-4xl md:text-5xl font-bold text-foreground text-center mb-16">
          {bio.title}
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div data-reveal="image" className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={bio.image.src}
              alt={bio.image.alt}
              className="w-full h-full object-cover"
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
