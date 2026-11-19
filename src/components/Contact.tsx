import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { contact, site } from "@/content";

const Contact = () => {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 data-reveal="heading" className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {contact.title}
            </h2>
            <p data-reveal="up" className="text-xl text-muted-foreground">
              {contact.intro}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div data-reveal="left" className="bg-card p-8 rounded-2xl shadow-md">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                    {contact.form.name.label}
                  </label>
                  <Input 
                    id="name" 
                    placeholder={contact.form.name.placeholder}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                    {contact.form.email.label}
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={contact.form.email.placeholder}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                    {contact.form.message.label}
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder={contact.form.message.placeholder}
                    rows={5}
                    className="w-full"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                >
                  {contact.form.submit}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div data-reveal="right" className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  {contact.details.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {contact.details.body}
                </p>
              </div>

              <div data-reveal="stagger" className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{contact.details.emailLabel}</h4>
                    <a href={`mailto:${site.email}`} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                      {site.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
