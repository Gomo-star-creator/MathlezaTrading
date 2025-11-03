import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building, Wrench, ArrowRight } from "lucide-react";
import residentialImage from "@/assets/residential-construction.jpg";
import commercialImage from "@/assets/commercial-construction.jpg";
import renovationImage from "@/assets/renovation-services.jpg";
import { getContent } from "@/lib/contentStore";

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Residential Construction",
      description: "Custom homes built to your exact specifications with attention to every detail.",
      image: residentialImage,
      features: ["Custom Home Design", "New Construction", "Home Additions", "Foundation Work"],
    },
    {
      icon: Building,
      title: "Commercial Construction",
      description: "Professional commercial buildings that meet your business requirements.",
      image: commercialImage,
      features: ["Office Buildings", "Retail Spaces", "Warehouses", "Industrial Facilities"],
    },
    {
      icon: Wrench,
      title: "Renovation & Remodeling",
      description: "Transform your existing space with our expert renovation services.",
      image: renovationImage,
      features: ["Kitchen Remodeling", "Bathroom Renovation", "Whole Home Makeovers", "Historic Restoration"],
    },
  ];

  const overrides = getContent("services");
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-construction-light/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            {overrides?.heading ?? "Comprehensive Construction"}
            <span className="text-primary block">{overrides?.subheading ?? "Solutions"}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {overrides?.intro ?? "We offer a full range of construction services to bring your vision to life, from initial planning to final completion."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="group overflow-hidden bg-gradient-card shadow-card hover:shadow-construction transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors duration-300"></div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Learn More button removed as requested */}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;