import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import residentialImage from "@/assets/residential-construction.jpg";
import commercialImage from "@/assets/commercial-construction.jpg";
import renovationImage from "@/assets/renovation-services.jpg";

const Projects = () => {
  const projects = [
    {
      title: "Modern Family Home",
      category: "Residential",
      description: "A beautiful 3,500 sq ft custom home featuring open-concept living and energy-efficient design.",
      image: residentialImage,
      completed: "2023",
      location: "Downtown District"
    },
    {
      title: "Corporate Office Building",
      category: "Commercial",
      description: "State-of-the-art 50,000 sq ft office complex with modern amenities and sustainable features.",
      image: commercialImage,
      completed: "2023",
      location: "Business Park"
    },
    {
      title: "Historic Home Restoration",
      category: "Renovation",
      description: "Complete restoration of a 1920s Victorian home preserving original character while adding modern conveniences.",
      image: renovationImage,
      completed: "2023",
      location: "Historic District"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-construction-light/30 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-4">
            Our Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Featured
            <span className="text-primary block">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our recent construction projects that showcase our commitment to 
            quality, innovation, and client satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <Card key={index} className="group overflow-hidden bg-gradient-card shadow-card hover:shadow-construction transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {project.category}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">{project.completed}</span>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">📍 {project.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;