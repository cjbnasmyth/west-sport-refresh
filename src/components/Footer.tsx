import { Linkedin, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/40 text-foreground py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8 items-start">
          <div className="flex flex-col items-start">
            <a href="#home" className="inline-flex items-center mb-4">
              <img src="/logo.jpg" alt="26 West Sport" className="h-10 md:h-12 object-contain" />
            </a>
            <p className="text-muted-foreground">
              Strategic sports marketing and sponsorship solutions that drive results.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted/10 hover:bg-muted/20 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted/10 hover:bg-muted/20 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted/10 hover:bg-muted/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-foreground" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-3">
            <img src="/logo.jpg" alt="26 West Sport" className="h-6 w-auto opacity-80" />
            <p>&copy; {new Date().getFullYear()} 26 West Sport. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
