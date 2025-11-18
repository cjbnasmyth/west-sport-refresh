import { Target, TrendingUp, Handshake, Megaphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import footballImage from "@/assets/football.webp";

const services = [
  {
    icon: Target,
    title: "Strategic Marketing",
    description: "Data-driven marketing strategies that position your sports brand for maximum impact and reach.",
  },
  {
    icon: Handshake,
    title: "Sponsorship Activation",
    description: "Turn sponsorship deals into powerful brand experiences that deliver measurable ROI.",
  },
  {
    icon: TrendingUp,
    title: "Sales Consulting",
    description: "Proven sales methodologies that close deals and build lasting partnerships in the sports industry.",
  },
  {
    icon: Megaphone,
    title: "Brand Development",
    description: "Create compelling brand narratives that resonate with fans and stakeholders alike.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <img 
          src={footballImage} 
          alt="Sports background" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-secondary/50"></div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What We Offer
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive sports marketing solutions tailored to your unique goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
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
