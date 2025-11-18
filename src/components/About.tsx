import { Award, Users, Zap } from "lucide-react";
import surferImage from "@/assets/surfer.jpeg";

const stats = [
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Users, value: "100+", label: "Successful Partnerships" },
  { icon: Zap, value: "500M+", label: "In Revenue Generated" },
];

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Your Partner in
              <span className="block text-accent">Sports Success</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              With over a decade of experience in sports marketing and sponsorship activation, 
              26 West Sport specializes in creating strategic partnerships that deliver results.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We understand the unique challenges of the sports industry and provide tailored 
              solutions that maximize your brand's potential, whether you're an athlete, team, 
              or corporate partner looking to make an impact.
            </p>
            
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-secondary/50">
                  <stat.icon className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={surferImage} 
                alt="Sports excellence in action" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-end p-8">
                <div className="text-center w-full">
                  <div className="text-5xl font-bold text-white mb-2">
                    26W
                  </div>
                  <p className="text-lg text-white/90 font-medium">
                    Your Success is Our Mission
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
