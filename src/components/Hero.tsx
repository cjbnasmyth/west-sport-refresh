
import footballImage from "@/assets/football.webp";
import BrandLogoCarousel from "./BrandLogoCarousel";

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-background relative overflow-visible">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-16 text-center leading-tight">
            Unparalleled Advice.
          </h1>
          
          {/* Laptop Mockup Section */}
          <div className="relative mx-auto max-w-5xl">
            {/* Coral accent blocks */}
            <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-64 bg-coral rounded-3xl -z-10 hidden lg:block"></div>
            <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-coral rounded-3xl -z-10 hidden lg:block"></div>
            
            {/* Laptop Frame */}
            <div className="relative bg-gray-900 rounded-2xl p-3 shadow-2xl">
              {/* Screen */}
              <div className="bg-black rounded-lg overflow-hidden aspect-[16/10]">
                <img 
                  src={footballImage} 
                  alt="Sports action in stadium" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Laptop bottom */}
              <div className="h-4 bg-gray-800 rounded-b-xl mt-1"></div>
            </div>
          </div>
          
          {/* Trusted by section */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground font-medium mb-0">Trusted by:</p>
            <div className="-mt-12">
              <BrandLogoCarousel
                logos={Array.from({ length: 5 })
                  .map((_, i) => `/brand${i + 1}.png`)}
                speed={60}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
