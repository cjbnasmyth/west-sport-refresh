import { useRef, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

// Header, footer and scroll reveals shared by every page. #main is what the mobile menu makes inert
// and what "Back to top" focuses.
const PageShell = ({ children }: { children: ReactNode }) => {
  const page = useRef<HTMLDivElement>(null);
  useScrollReveal(page);

  return (
    <div ref={page} className="min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageShell;
