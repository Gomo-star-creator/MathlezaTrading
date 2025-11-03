import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { saveRentalRequest } from "@/lib/contentStore";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const RentalForm = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { toast } = useToast();
  const selectedMachine = query.get("machine") ?? "";
  const machineOptions = [
    "Concrete Breaker",
    "Crosscut & Mitre Saw",
    "Angle Grinder",
    "Vibratory Plate Compactor",
    "Portable Concrete Mixer",
    "High-Volume Water Pump",
  ];

  const [items, setItems] = useState<{ machine: string; quantity: number }[]>([
    { machine: selectedMachine, quantity: 1 },
  ]);

  const addItem = () => {
    setItems((prev) => [...prev, { machine: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<{ machine: string; quantity: number }>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...updates } : it)));
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Rent Machinery</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (items.length === 0) return;
                    const form = e.currentTarget as HTMLFormElement;
                    const data = new FormData(form);
                    const fullName = String(data.get("fullName") || "");
                    const phone = String(data.get("phone") || "");
                    const email = String(data.get("email") || "");
                    const startDate = String(data.get("startDate") || "");
                    const days = Number(data.get("days") || 1);
                    saveRentalRequest({
                      items,
                      fullName,
                      phone,
                      email,
                      startDate,
                      days,
                      createdAt: new Date().toISOString(),
                    });
                    toast({ title: "Request submitted", description: "We have received your rental request." });
                    navigate("/machine-hire");
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label>Machines</Label>
                    </div>
                    <div className="space-y-4">
                      {items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                          <div className="md:col-span-7 space-y-2">
                            <Label htmlFor={`machine-${idx}`}>Machine</Label>
                            <select
                              id={`machine-${idx}`}
                              className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm"
                              value={item.machine}
                              onChange={(e) => updateItem(idx, { machine: e.target.value })}
                              required
                            >
                              <option value="" disabled>
                                Select a machine
                              </option>
                              {machineOptions.map((name) => (
                                <option key={name} value={name}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-3 space-y-2">
                            <Label htmlFor={`qty-${idx}`}>Quantity</Label>
                            <Input
                              id={`qty-${idx}`}
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => removeItem(idx)}
                              disabled={items.length === 1}
                              className="w-full"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <Button type="button" variant="outline" onClick={addItem}>
                        Add another machine
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" placeholder="Your full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" placeholder="e.g. 071 234 5678" required />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                  </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" name="startDate" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="days">Number of Days</Label>
                      <Input id="days" type="number" min={1} name="days" required />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button type="submit">Submit Request</Button>
                    <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RentalForm;


