import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { getContent, setContent, getRentalRequests } from "@/lib/contentStore";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const { toast } = useToast();

  const homeInitial = getContent("home") ?? {};
  const aboutInitial = getContent("about") ?? {};
  const servicesInitial = getContent("services") ?? {};
  const projectsInitial = getContent("projects") ?? {};

  const [home, setHome] = useState({
    badge: homeInitial.badge ?? "🌍 Ubuntu Building Excellence",
    titleLine1: homeInitial.titleLine1 ?? "Ubuntu Building,",
    titleLine2: homeInitial.titleLine2 ?? "African Excellence",
    subtitle: homeInitial.subtitle ?? "Leading African construction and trading company, proudly serving communities across South Africa with integrity, quality, and traditional Ubuntu values.",
    ctaPrimaryLabel: homeInitial.ctaPrimaryLabel ?? "Get a Quote",
    ctaSecondaryLabel: homeInitial.ctaSecondaryLabel ?? "View Services",
  });

  const [about, setAbout] = useState({
    badge: aboutInitial.badge ?? "About Mathleza Trading",
    heading: aboutInitial.heading ?? "Ubuntu Excellence",
    subheading: aboutInitial.subheading ?? "Since 2011",
    description: aboutInitial.description ?? "Founded in 2011, Mathleza Trading & Projects is a dynamic and 100% black-owned South African enterprise committed to Ubuntu excellence...",
    ctaLabel: aboutInitial.ctaLabel ?? "Get Started Today",
  });

  const [services, setServices] = useState({
    heading: servicesInitial.heading ?? "Comprehensive Construction",
    subheading: servicesInitial.subheading ?? "Solutions",
    intro: servicesInitial.intro ?? "We offer a full range of construction services to bring your vision to life, from initial planning to final completion.",
  });

  const [projects, setProjects] = useState({
    heading: projectsInitial.heading ?? "Featured",
    subheading: projectsInitial.subheading ?? "Projects",
    intro: projectsInitial.intro ?? "A selection of our recent work across residential, commercial and renovation.",
  });

  const save = (section: "home" | "about" | "services" | "projects", value: any) => {
    setContent(section, value);
    toast({ title: "Saved", description: `${section} content updated.` });
  };

  const rentalRequests = getRentalRequests();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="max-w-5xl mx-auto">
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="rentals">Rental Requests</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-8 pt-6">
                    <Card>
                      <CardHeader><CardTitle>Home</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Badge</Label>
                          <Input value={home.badge} onChange={e => setHome({ ...home, badge: e.target.value })} />
                        </div>
                        <div>
                          <Label>Title Line 1</Label>
                          <Input value={home.titleLine1} onChange={e => setHome({ ...home, titleLine1: e.target.value })} />
                        </div>
                        <div>
                          <Label>Title Line 2</Label>
                          <Input value={home.titleLine2} onChange={e => setHome({ ...home, titleLine2: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Subtitle</Label>
                          <Textarea value={home.subtitle} onChange={e => setHome({ ...home, subtitle: e.target.value })} />
                        </div>
                        <div>
                          <Label>Primary CTA Label</Label>
                          <Input value={home.ctaPrimaryLabel} onChange={e => setHome({ ...home, ctaPrimaryLabel: e.target.value })} />
                        </div>
                        <div>
                          <Label>Secondary CTA Label</Label>
                          <Input value={home.ctaSecondaryLabel} onChange={e => setHome({ ...home, ctaSecondaryLabel: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          <Button onClick={() => save("home", home)}>Save Home</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle>About</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Badge</Label>
                          <Input value={about.badge} onChange={e => setAbout({ ...about, badge: e.target.value })} />
                        </div>
                        <div>
                          <Label>Heading</Label>
                          <Input value={about.heading} onChange={e => setAbout({ ...about, heading: e.target.value })} />
                        </div>
                        <div>
                          <Label>Subheading</Label>
                          <Input value={about.subheading} onChange={e => setAbout({ ...about, subheading: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Description</Label>
                          <Textarea value={about.description} onChange={e => setAbout({ ...about, description: e.target.value })} />
                        </div>
                        <div>
                          <Label>CTA Label</Label>
                          <Input value={about.ctaLabel} onChange={e => setAbout({ ...about, ctaLabel: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          <Button onClick={() => save("about", about)}>Save About</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle>Services</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Heading</Label>
                          <Input value={services.heading} onChange={e => setServices({ ...services, heading: e.target.value })} />
                        </div>
                        <div>
                          <Label>Subheading</Label>
                          <Input value={services.subheading} onChange={e => setServices({ ...services, subheading: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Intro</Label>
                          <Textarea value={services.intro} onChange={e => setServices({ ...services, intro: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          <Button onClick={() => save("services", services)}>Save Services</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Heading</Label>
                          <Input value={projects.heading} onChange={e => setProjects({ ...projects, heading: e.target.value })} />
                        </div>
                        <div>
                          <Label>Subheading</Label>
                          <Input value={projects.subheading} onChange={e => setProjects({ ...projects, subheading: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Intro</Label>
                          <Textarea value={projects.intro} onChange={e => setProjects({ ...projects, intro: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          <Button onClick={() => save("projects", projects)}>Save Projects</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="rentals" className="pt-6">
                    <div className="space-y-4">
                      {rentalRequests.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No rental requests yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left border-b">
                                <th className="py-2 pr-4">Date</th>
                                <th className="py-2 pr-4">Name</th>
                                <th className="py-2 pr-4">Email</th>
                                <th className="py-2 pr-4">Phone</th>
                                <th className="py-2 pr-4">Start</th>
                                <th className="py-2 pr-4">Days</th>
                                <th className="py-2 pr-4">Items</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rentalRequests.slice().reverse().map((r, i) => (
                                <tr key={i} className="border-b align-top">
                                  <td className="py-2 pr-4">{new Date(r.createdAt).toLocaleString()}</td>
                                  <td className="py-2 pr-4">{r.fullName}</td>
                                  <td className="py-2 pr-4">{r.email}</td>
                                  <td className="py-2 pr-4">{r.phone}</td>
                                  <td className="py-2 pr-4">{r.startDate}</td>
                                  <td className="py-2 pr-4">{r.days}</td>
                                  <td className="py-2 pr-4">
                                    <ul className="list-disc pl-4">
                                      {r.items.map((it, idx) => (
                                        <li key={idx}>{it.machine} × {it.quantity}</li>
                                      ))}
                                    </ul>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;


