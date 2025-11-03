import { Link } from "react-router-dom";
import { Shield, FileText, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">What is Nuture?</AccordionTrigger>
                <AccordionContent>
                  Nuture is a web-based health insurance platform built exclusively for NUTM students. We offer simple, flexible, and affordable insurance plans designed for campus life. Students can subscribe, claim, and track their medical benefits directly online — no paperwork, no stress.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">Why do NUTM students need Nuture?</AccordionTrigger>
                <AccordionContent>
                  NUTM students currently lack affordable health insurance coverage. As a private university, NUTM is excluded from public university NHIS benefits. Additionally, parents' NHIS plans don't apply on campus because they're location-restricted. Nuture fills this gap by providing accessible, campus-focused health coverage.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">What plans are available?</AccordionTrigger>
                <AccordionContent>
                  We offer three tiers: Basic (₦2,500/year with coverage up to ₦50,000), Standard (₦4,000/year with coverage up to ₦150,000), and Premium (₦7,500/year with coverage up to ₦300,000). Each plan includes different benefits like health checkups, pharmacy bills, dental care, and emergency services.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">How do I submit a claim?</AccordionTrigger>
                <AccordionContent>
                  Simply upload your prescription or receipt through our digital claim submission system. You can track your claim status in real-time with updates like Pending, Approved, or Rejected. No physical paperwork required!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">What is the referral program?</AccordionTrigger>
                <AccordionContent>
                  Earn ₦500 when you refer a fellow NUTM student who subscribes to a plan. Your friend also gets a discount! Share your unique referral link via WhatsApp or other channels to start earning rewards.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">Can I transfer my policy?</AccordionTrigger>
                <AccordionContent>
                  Yes! Students can safely transfer unused coverage to another student. This feature promotes community support and ensures coverage doesn't go to waste.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">How do auto-renewal reminders work?</AccordionTrigger>
                <AccordionContent>
                  We send automated email notifications before your plan expires, so you never lose coverage unexpectedly. You'll receive reminders with enough time to renew your subscription.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left">Who can register for Nuture?</AccordionTrigger>
                <AccordionContent>
                  Only NUTM students can register. You'll need to verify your identity using your NUTM email address or student ID during the registration process.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
