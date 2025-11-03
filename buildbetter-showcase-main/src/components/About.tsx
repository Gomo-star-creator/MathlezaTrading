import { Button } from "@/components/ui/button";
import { Check, Shield, Clock, Trophy } from "lucide-react";
import { getContent } from "@/lib/contentStore";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Ubuntu Excellence",
      description: "Built on African values of community and togetherness, we deliver projects that uplift and strengthen local communities."
    },
    {
      icon: Clock,
      title: "Local Expertise",
      description: "Deep understanding of African construction challenges, climate, and regulations ensures successful project delivery."
    },
    {
      icon: Trophy,
      title: "Community Focus",
      description: "Committed to empowering local communities through skills development, job creation, and sustainable development practices."
    }
  ];

  const achievements = [
    "CIDB Registered Contractors",
    "BEE Level 2 Contributor",
    "SACPCMP Certified",
    "Green Building Council Member",
    "NHBRC Registered",
    "Skills Development Partner"
  ];

  const overrides = getContent("about");
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-4">
              {overrides?.badge ?? "About Mathleza Trading"}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              {overrides?.heading ?? "Ubuntu Excellence"}
              <span className="text-primary block">{overrides?.subheading ?? "Since 2011"}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {overrides?.description ?? "Founded in 2011, Mathleza Trading & Projects is a dynamic and 100% black-owned South African enterprise committed to Ubuntu excellence. We offer integrated services to government, corporate, educational, healthcare, and community institutions. Our services include construction, branding, cleaning, and general trading - all delivered with the spirit of Ubuntu: 'I am because we are.'"}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">{achievement}</span>
                </div>
              ))}
            </div>

            <Button variant="cta" size="lg">
              {overrides?.ctaLabel ?? "Get Started Today"}
            </Button>
          </div>

          {/* Values Cards */}
          <div className="space-y-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={index} 
                  className="bg-gradient-card p-6 rounded-lg shadow-card hover:shadow-construction transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;