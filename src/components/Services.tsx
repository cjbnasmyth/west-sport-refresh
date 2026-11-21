import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/content";

const Services = () => {
  return (
    <section id="services" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <img 
          src={services.backgroundImage.src}
          srcSet={services.backgroundImage.srcset}
          sizes="100vw"
          alt="" 
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="absolute inset-0 bg-secondary/50"></div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 data-reveal="heading" className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {services.title}
          </h2>
          <p data-reveal="up" className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {services.intro}
          </p>
        </div>

        <div data-reveal="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.items.map((service, index) => (
            <Card
              key={index}
              data-tilt
              className="group hover:shadow-lg transition-shadow duration-300 border-border/50"
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="h-7 w-7 text-accent" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
