import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { getContent, setContent, getRentalRequests, updateRentalRequestById, updateRentalRequestAt, getAdmins, addAdmin, removeAdmin, updateAdmin, deleteRentalRequestById, deleteRentalRequestAt } from "@/lib/contentStore";
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

  const [rentalRequests, setRentalRequests] = useState(getRentalRequests());

  const updateRequest = (idx: number, updates: any) => {
    const req = rentalRequests[idx];
    if (!req) return;
    if (req.id) updateRentalRequestById(req.id, updates);
    else updateRentalRequestAt(idx, updates);
    setRentalRequests(getRentalRequests());
  };

  const sendEmail = (idx: number) => {
    const r = rentalRequests[idx];
    if (!r) return;
    const statusLabel = r.status === "approved" ? "Approved" : r.status === "denied" ? "Denied" : "Pending";
    const subject = encodeURIComponent(`Rental Request ${statusLabel} - ${r.fullName}`);
    const itemsText = r.items.map(it => `- ${it.machine} x ${it.quantity}`).join("%0D%0A");
    const body = encodeURIComponent(
      `Hello ${r.fullName},\n\n` +
      `Your rental request has been ${statusLabel.toLowerCase()}.\n\n` +
      `Details:\n` +
      `Start Date: ${r.startDate}\n` +
      `Days: ${r.days}\n` +
      `Items:\n${r.items.map(it => `- ${it.machine} x ${it.quantity}`).join("\n")}\n\n` +
      (r.adminNote ? `Notes from admin:\n${r.adminNote}\n\n` : "") +
      `Regards,\nMathleza Trading`
    );
    // Remove from storage immediately
    if (r.id) deleteRentalRequestById(r.id); else deleteRentalRequestAt(idx);
    setRentalRequests(getRentalRequests());
    // Open email client
    window.location.href = `mailto:${encodeURIComponent(r.email)}?subject=${subject}&body=${body}`;
  };

  const [adminsVersion, setAdminsVersion] = useState(0);
  const admins = getAdmins();

  const [editingUsername, setEditingUsername] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ firstName: string; lastName: string; email: string; phone: string; password?: string }>({ firstName: "", lastName: "", email: "", phone: "" });

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
                    <TabsTrigger value="admins">Admins</TabsTrigger>
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
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">Admin Description</th>
                                <th className="py-2 pr-4">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rentalRequests.slice().map((r, i) => (
                                <tr key={r.id || i} className="border-b align-top">
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
                                  <td className="py-2 pr-4">
                                    <select
                                      className="border border-input bg-background rounded-md px-2 py-1"
                                      value={r.status ?? "pending"}
                                      onChange={(e) => updateRequest(i, { status: e.target.value })}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="approved">Approved</option>
                                      <option value="denied">Denied</option>
                                    </select>
                                  </td>
                                  <td className="py-2 pr-4 min-w-[240px]">
                                    <textarea
                                      className="w-full border border-input bg-background rounded-md px-2 py-1 text-sm"
                                      rows={3}
                                      placeholder="Add details or instructions..."
                                      value={r.adminNote ?? ""}
                                      onChange={(e) => updateRequest(i, { adminNote: e.target.value })}
                                    />
                                  </td>
                                  <td className="py-2 pr-4">
                                    <Button size="sm" onClick={() => sendEmail(i)}>Send Email</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="admins" className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader><CardTitle>Register New Admin</CardTitle></CardHeader>
                        <CardContent>
                          <form
                            className="space-y-4"
                            onSubmit={(e) => {
                              e.preventDefault();
                              const form = e.currentTarget as HTMLFormElement;
                              const data = new FormData(form);
                              const username = String(data.get("username") || "").trim();
                              const password = String(data.get("password") || "").trim();
                              const firstName = String(data.get("firstName") || "").trim();
                              const lastName = String(data.get("lastName") || "").trim();
                              const email = String(data.get("email") || "").trim();
                              const phone = String(data.get("phone") || "").trim();
                              if (!username || !password) return;
                              addAdmin({ username, password, firstName, lastName, email, phone });
                              form.reset();
                              toast({ title: "Admin saved", description: `${username} can now log in.` });
                              setAdminsVersion(v => v + 1);
                            }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="admin-firstName">Name</Label>
                                <Input id="admin-firstName" name="firstName" placeholder="Name" required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="admin-lastName">Surname</Label>
                                <Input id="admin-lastName" name="lastName" placeholder="Surname" required />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="admin-email">Email</Label>
                                <Input id="admin-email" name="email" type="email" placeholder="name@example.com" required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="admin-phone">Phone</Label>
                                <Input id="admin-phone" name="phone" placeholder="Phone number" required />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="admin-username">Username</Label>
                              <Input id="admin-username" name="username" placeholder="e.g. SiteAdmin" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="admin-password">Password</Label>
                              <Input id="admin-password" name="password" type="password" placeholder="Strong password" required />
                            </div>
                            <Button type="submit">Register</Button>
                          </form>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader><CardTitle>Existing Admins</CardTitle></CardHeader>
                        <CardContent>
                          {admins.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No additional admins added.</p>
                          ) : (
                            <ul className="divide-y">
                              {admins.map((a) => (
                                <li key={a.username} className="py-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium">{a.username}</div>
                                      <div className="text-sm text-muted-foreground">{a.firstName} {a.lastName}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm" onClick={() => { setEditingUsername(a.username); setEditValues({ firstName: a.firstName, lastName: a.lastName, email: a.email, phone: a.phone }); }}>Edit</Button>
                                      <Button variant="secondary" size="sm" onClick={() => { removeAdmin(a.username); toast({ title: "Removed", description: `${a.username} removed.` }); setAdminsVersion(v => v + 1); }}>
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                  {editingUsername === a.username && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input value={editValues.firstName} onChange={e => setEditValues({ ...editValues, firstName: e.target.value })} />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Surname</Label>
                                        <Input value={editValues.lastName} onChange={e => setEditValues({ ...editValues, lastName: e.target.value })} />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input type="email" value={editValues.email} onChange={e => setEditValues({ ...editValues, email: e.target.value })} />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input value={editValues.phone} onChange={e => setEditValues({ ...editValues, phone: e.target.value })} />
                                      </div>
                                      <div className="md:col-span-2 flex items-center gap-2">
                                        <Button size="sm" onClick={() => { updateAdmin(a.username, { firstName: editValues.firstName, lastName: editValues.lastName, email: editValues.email, phone: editValues.phone }); setEditingUsername(null); toast({ title: "Updated", description: `${a.username} details saved.` }); setAdminsVersion(v => v + 1); }}>Save</Button>
                                        <Button size="sm" variant="secondary" onClick={() => setEditingUsername(null)}>Cancel</Button>
                                      </div>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
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


