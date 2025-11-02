import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Loader2, CheckCircle } from "lucide-react";
import { useBackend } from "../lib/useBackend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PAYMENT_METHODS } from "../config";
import { formatCurrency } from "../lib/format";

export default function Checkout() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const backend = useBackend();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const { data: plan, isLoading } = useQuery({
    queryKey: ["plan", planId],
    queryFn: async () => await backend.plans.get({ id: planId! }),
    enabled: !!planId,
  });

  const processPayment = useMutation({
    mutationFn: async () => {
      const subscription = await backend.subscriptions.create({
        planId: planId!,
        autoRenew: true,
      });

      await backend.payments.create({
        subscriptionId: subscription.id,
        amount: plan!.monthlyPrice,
        paymentMethod,
      });

      return subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast({
        title: "Payment Successful!",
        description: "Your insurance plan is now active.",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processPayment.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>
                    Complete your payment to activate your insurance plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="method">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                        <SelectTrigger id="method">
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

                    <div className="space-y-2">
                      <Label htmlFor="card">Card Number</Label>
                      <Input
                        id="card"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          required
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#00A859] hover:bg-[#008f4a] text-white"
                      disabled={processPayment.isPending}
                    >
                      {processPayment.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Complete Payment
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Selected Plan</p>
                    <p className="text-lg font-semibold">{plan.name}</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Monthly Price</span>
                      <span className="font-medium">{formatCurrency(plan.monthlyPrice)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Coverage Limit</span>
                      <span className="font-medium">{formatCurrency(plan.coverageLimit)}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Due Today</span>
                      <span className="text-2xl font-bold text-[#00A859]">
                        {formatCurrency(plan.monthlyPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#00A859]/10 border border-[#00A859]/20 rounded-lg p-3">
                    <p className="text-sm">
                      Your plan will auto-renew monthly. Cancel anytime from your dashboard.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
