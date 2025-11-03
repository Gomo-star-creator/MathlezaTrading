import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, AlertTriangle, FileText, Wrench, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

// Import machinery images
import concreteBreakerImg from "@/assets/concrete-breaker.jpg";
import mitreSawImg from "@/assets/mitre-saw.jpg";
import angleGrinderImg from "@/assets/angle-grinder.jpg";
import plateCompactorImg from "@/assets/plate-compactor.jpg";
import concreteMixerImg from "@/assets/concrete-mixer.jpg";
import waterPumpImg from "@/assets/water-pump.jpg";

const MachineHire = () => {
  const machinery = [
    {
      name: "Concrete Breaker",
      description: "Designed to efficiently break concrete",
      rate: "R550/day",
      image: concreteBreakerImg,
      uses: "Breaking concrete slabs, demolition work, pavement removal"
    },
    {
      name: "Crosscut & Mitre Saw",
      description: "For wood cutting",
      rate: "R500/day", 
      image: mitreSawImg,
      uses: "Precision wood cutting, framing, trim work"
    },
    {
      name: "Angle Grinder",
      description: "Versatile for grinding, cutting, polishing",
      rate: "R150/day",
      image: angleGrinderImg, 
      uses: "Metal cutting, grinding, polishing surfaces"
    },
    {
      name: "Vibratory Plate Compactor",
      description: "For soil, gravel compaction",
      rate: "R600/day",
      image: plateCompactorImg,
      uses: "Soil compaction, gravel preparation, foundation work"
    },
    {
      name: "Portable Concrete Mixer",
      description: "For small to medium jobs",
      rate: "R400/day",
      image: concreteMixerImg,
      uses: "Mixing concrete, mortar, small construction projects"
    },
    {
      name: "High-Volume Water Pump",
      description: "Gasoline-powered",
      rate: "R300/day",
      image: waterPumpImg,
      uses: "Water removal, irrigation, emergency drainage"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Machinery Hire
              <span className="text-primary block">Policy & Equipment</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional machinery rental services with competitive daily rates. 
              Safe, responsible use, and protection of company assets.
            </p>
          </div>
        </section>

        {/* Purpose Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Purpose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  This policy outlines the terms and conditions for hiring machinery from Mathleza Trading & Projects 
                  (Pty) Ltd to ensure safe, responsible use, and protection of company assets.
                </p>
              </CardContent>
            </Card>

            {/* Machinery Available */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Machinery Available for Hire
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {machinery.map((machine, index) => (
                  <Link
                    key={index}
                    to={`/rental?machine=${encodeURIComponent(machine.name)}`}
                    className="block"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow hover:translate-y-[-2px]">
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img 
                          src={machine.image} 
                          alt={machine.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{machine.name}</CardTitle>
                          <Badge variant="secondary" className="text-lg font-bold">
                            {machine.rate}
                          </Badge>
                        </div>
                        <CardDescription>{machine.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          <strong>Uses:</strong> {machine.uses}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Policy Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Deposit & Payment Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Deposit & Payment Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-foreground">Refundable Deposit Required:</p>
                    <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                      <li>R2,500 deposit for small to medium machinery</li>
                      <li>R3,500 deposit for large/heavy-duty machinery</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground">
                    The deposit covers insurance for hire license compliance, and protection against 
                    loss or damage. Payment for the hire period is required in full before collection.
                  </p>
                </CardContent>
              </Card>

              {/* Fuel Policy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-6 w-6 text-primary" />
                    Fuel Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Petrol-powered machines are supplied with a full tank. Clients must return the 
                    machine with a full tank. Failure to return with a full tank will result in 
                    fuel costs deducted from the deposit.
                  </p>
                </CardContent>
              </Card>

              {/* Damage & Loss */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                    Damage, Loss, and Forfeiture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If machinery is returned broken, damaged beyond normal wear and tear, or missing parts, 
                    the deposit will be forfeited to cover repair or replacement costs. If damage exceeds 
                    the deposit amount, the client will be liable for the remaining balance. The client is 
                    responsible for the machinery from collection until return and inspection.
                  </p>
                </CardContent>
              </Card>

              {/* Hire Period */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    Hire Period & Late Returns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The hire period starts from the agreed collection date and time. Late returns will 
                    incur additional daily hire charges at the standard rate.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Requirements & Terms */}
            <div className="mt-12 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Identification & Documentation Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Before machinery is released, clients must provide: Valid South African ID or passport, 
                    proof of residence (not older than 3 months), proof of payment for deposit and hire fee, 
                    and any additional documentation required by Mathleza Trading & Projects for verification.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Liability & Insurance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Mathleza Trading & Projects provides basic insurance as part of the deposit fee; however, 
                    clients are responsible for proper and safe use of the machinery. Any injuries, accidents, 
                    or third-party damages caused during use are the sole responsibility of the client.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    By signing the hire agreement, the client acknowledges and agrees to comply with this 
                    policy and the full terms and conditions provided by Mathleza Trading & Projects (Pty) Ltd.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MachineHire;