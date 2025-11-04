import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PAYMENT_METHODS } from "../config";
import { formatCurrency } from "../lib/format";
import { useToast } from "@/components/ui/use-toast";
import { mockPlans, mockStorage } from "../lib/mockData";

export default function Checkout() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = mockPlans.find(p => p.id === planId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || !paymentMethod) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Create subscription
      const newSubscription = {
        id: `sub-${Date.now()}`,
        userId: 'current-user',
        planId: plan.id,
        status: 'active' as const,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
      };

      mockStorage.saveSubscription(newSubscription);
      
      toast({
        title: "Subscription Created!",
        description: `You're now enrolled in the ${plan.name}`,
      });
      
      setIsProcessing(false);
      navigate("/dashboard");
    }, 1500);
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Plan not found</p>
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
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Complete Your Purchase</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Plan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  <Badge className={getTierBadge(plan.tier)}>
                    {plan.tier.toUpperCase()}
                  </Badge>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold mb-2">Coverage Limit</h4>
                  <p className="text-2xl font-bold">{formatCurrency(plan.coverageLimit)}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold mb-3">Features</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-[#00A859] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Monthly Total</span>
                    <span className="text-[#00A859]">{formatCurrency(plan.monthlyPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Complete your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === "Credit Card" || paymentMethod === "Debit Card" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>
                    </>
                  ) : paymentMethod === "Bank Transfer" ? (
                    <div className="bg-muted/50 p-4 rounded-lg text-sm">
                      <p className="font-semibold mb-2">Bank Details:</p>
                      <p>Account Name: Nuture Health Insurance</p>
                      <p>Account Number: 0123456789</p>
                      <p>Bank: First Bank of Nigeria</p>
                    </div>
                  ) : paymentMethod === "USSD" ? (
                    <div className="bg-muted/50 p-4 rounded-lg text-sm">
                      <p className="font-semibold mb-2">USSD Code:</p>
                      <p className="text-xl font-bold">*737*1*{formatCurrency(plan.monthlyPrice)}#</p>
                      <p className="text-xs text-muted-foreground mt-2">Dial the code above to complete payment</p>
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    className="w-full bg-[#00A859] hover:bg-[#008f4a] text-white"
                    disabled={!paymentMethod || isProcessing}
                  >
                    <CreditCard className="mr-2 w-4 h-4" />
                    {isProcessing ? "Processing..." : `Pay ${formatCurrency(plan.monthlyPrice)}`}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By proceeding, you agree to our terms and conditions
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
