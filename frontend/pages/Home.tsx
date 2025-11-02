import { Link } from "react-router-dom";
import { Shield, FileText, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 px-4 bg-gradient-to-b from-[#00A859]/10 to-background">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00A859] to-emerald-400 bg-clip-text text-transparent">
              Health Insurance Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Affordable healthcare coverage designed exclusively for NUTM students. 
              Get protected, stay healthy, and focus on your studies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#00A859] hover:bg-[#008f4a] text-white">
                <Link to="/plans">
                  View Plans
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Nuture?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-[#00A859]/20 hover:border-[#00A859]/50 transition-all">
                <CardContent className="pt-6">
                  <Shield className="w-12 h-12 text-[#00A859] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Student-Friendly</h3>
                  <p className="text-muted-foreground">
                    Plans designed specifically for NUTM students with affordable pricing
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#00A859]/20 hover:border-[#00A859]/50 transition-all">
                <CardContent className="pt-6">
                  <FileText className="w-12 h-12 text-[#00A859] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Easy Claims</h3>
                  <p className="text-muted-foreground">
                    Submit and track claims digitally with real-time status updates
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#00A859]/20 hover:border-[#00A859]/50 transition-all">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 text-[#00A859] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Referral Rewards</h3>
                  <p className="text-muted-foreground">
                    Earn rewards when you refer fellow students to Nuture
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#00A859]/20 hover:border-[#00A859]/50 transition-all">
                <CardContent className="pt-6">
                  <TrendingUp className="w-12 h-12 text-[#00A859] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Flexible Coverage</h3>
                  <p className="text-muted-foreground">
                    Three tiers to match your needs and budget perfectly
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-[#00A859]/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of NUTM students who trust Nuture for their health insurance needs
            </p>
            <Button asChild size="lg" className="bg-[#00A859] hover:bg-[#008f4a] text-white">
              <Link to="/plans">Choose Your Plan</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
