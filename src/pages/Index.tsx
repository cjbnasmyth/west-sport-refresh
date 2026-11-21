import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Articles from "@/components/Articles";
import Bio from "@/components/Bio";
import Contact from "@/components/Contact";
import PageHead from "@/components/PageHead";
import PageShell from "@/components/PageShell";

const Index = () => (
  <PageShell>
    <PageHead path="/" />
    <Hero />
    <About />
    <Services />
    <Bio />
    <Articles />
    <Contact />
  </PageShell>
);

export default Index;
