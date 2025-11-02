import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import backend from "~backend/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { formatCurrency } from "../lib/format";

export default function Plans() {
  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => await backend.plans.list(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading plans...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      basic: "bg-blue-500/20 text-blue-500",
      standard: "bg-purple-500/20 text-purple-500",
      premium: "bg-[#00A859]/20 text-[#00A859]",
    };
    return colors[tier] || "bg-gray-500/20 text-gray-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Select the coverage that fits your needs and budget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data?.plans.map((plan) => (
              <Card 
                key={plan.id}
                className="border-2 hover:border-[#00A859]/50 transition-all relative"
              >
                {plan.tier === "premium" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#00A859] text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <Badge className={getTierBadge(plan.tier)}>
                      {plan.tier.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-y border-border">
                    <div className="text-3xl font-bold text-[#00A859]">
                      {formatCurrency(plan.monthlyPrice)}
                    </div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Coverage Limit</div>
                    <div className="text-2xl font-bold">{formatCurrency(plan.coverageLimit)}</div>
                  </div>

                  <div>
                    <div className="font-semibold mb-3">Features</div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-[#00A859] mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button asChild className="w-full bg-[#00A859] hover:bg-[#008f4a] text-white">
                    <Link to={`/checkout/${plan.id}`}>Select Plan</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
