import { about } from "@/content";

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 data-reveal="heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {about.title}
              <span className="block text-accent">{about.titleAccent}</span>
            </h2>
            {about.paragraphs.map((text, index) => (
              <p
                key={index}
                data-reveal="up"
                className={`text-lg text-muted-foreground leading-relaxed ${index === about.paragraphs.length - 1 ? "mb-8" : "mb-6"}`}
              >
                {text}
              </p>
            ))}
            
            <div data-reveal="stagger" className="grid grid-cols-3 gap-6">
              {about.stats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-secondary/50">
                  <stat.icon className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div
                    data-count={stat.value}
                    data-suffix={stat.suffix}
                    className="text-3xl font-bold text-foreground mb-1 tabular-nums"
                  >
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div data-reveal="image" className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={about.image.src}
                srcSet={about.image.srcset}
                sizes="(min-width: 1024px) 640px, 100vw"
                alt={about.image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
