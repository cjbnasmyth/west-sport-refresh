import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Articles from "@/components/Articles";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import PageHead from "@/components/PageHead";
import PageShell from "@/components/PageShell";

const Index = () => (
  <PageShell>
    <PageHead path="/" />
    <Hero />
    <About />
    <Services />
    <Articles />
    <Blog />
    <Contact />
  </PageShell>
);

export default Index;
