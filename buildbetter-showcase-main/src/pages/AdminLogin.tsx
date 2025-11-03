import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getAdmins } from "@/lib/contentStore";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Administrator Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const data = new FormData(form);
                    const username = String(data.get("username") || "");
                    const password = String(data.get("password") || "");
                    const stored = getAdmins();
                    const match = stored.find(a => a.username === username && a.password === password);
                    if (username === "MainAdmin" && password === "MainAdmin@01" || match) {
                      toast({ title: "Welcome", description: "Login successful." });
                      navigate("/admin");
                    } else {
                      toast({ title: "Invalid credentials", description: "Please try again.", variant: "destructive" });
                    }
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" placeholder="Enter username" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" placeholder="Enter password" required />
                  </div>
                  <div className="flex items-center gap-4">
                    <Button type="submit">Log In</Button>
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

export default AdminLogin;


