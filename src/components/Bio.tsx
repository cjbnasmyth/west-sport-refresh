import { Linkedin } from "lucide-react";
import { bio } from "@/content";

// Square photo (with a LinkedIn button under it) on the left, text on the right, under a centred heading.
// Stacked on small screens.
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
          <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-8">
            <div data-reveal="image" className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={bio.image.src}
                srcSet={bio.image.srcset}
                sizes="320px"
                alt={bio.image.alt}
                className="w-full h-full object-cover object-[center_25%]"
                width={640}
                height={640}
                loading="lazy"
                decoding="async"
              />
            </div>

            {bio.linkedin.url && (
              <div data-reveal="up">
                {/* LinkedIn's brand blue (#0A66C2) and its hover shade */}
                <a
                  href={bio.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#0A66C2] px-7 font-semibold text-white shadow-md transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#004182] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <Linkedin aria-hidden="true" className="h-5 w-5 fill-current" strokeWidth={0} />
                  {bio.linkedin.label}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            )}
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
