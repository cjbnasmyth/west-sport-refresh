import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useRef } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const Index = () => {
  const page = useRef<HTMLDivElement>(null);
  useScrollReveal(page);

  return (
    <div ref={page} className="min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Services />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
