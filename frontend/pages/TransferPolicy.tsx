import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backend from "~backend/client";

export default function TransferPolicy() {
  const [subscriptionId, setSubscriptionId] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscriptionId || !newUserEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await backend.subscriptions.transfer({
        subscriptionId,
        currentUserId: "current-user-id",
        newUserId: newUserEmail,
      });

      toast({
        title: "Transfer Successful",
        description: "Your policy has been transferred successfully",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Transfer error:", error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00A859] to-emerald-400 bg-clip-text text-transparent">
              Transfer Your Policy
            </h1>
            <p className="text-muted-foreground">
              Safely transfer your unused coverage to another NUTM student
            </p>
          </div>

          <Card className="border-[#00A859]/20">
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>
                Transfer your active subscription to a fellow student. The new recipient must be a verified NUTM student.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransfer} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subscriptionId">Your Subscription ID</Label>
                  <Input
                    id="subscriptionId"
                    placeholder="Enter your subscription ID"
                    value={subscriptionId}
                    onChange={(e) => setSubscriptionId(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    You can find this in your dashboard
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newUserEmail">Recipient's NUTM Email</Label>
                  <Input
                    id="newUserEmail"
                    type="email"
                    placeholder="recipient@nutm.edu.ng"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Must be a verified NUTM student email
                  </p>
                </div>

                <div className="bg-[#00A859]/5 border border-[#00A859]/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-[#00A859]">Important Notes:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>The transfer is permanent and cannot be reversed</li>
                    <li>The recipient cannot have an existing active subscription</li>
                    <li>All remaining coverage will be transferred</li>
                    <li>You will lose access to this policy immediately</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#00A859] hover:bg-[#008f4a]"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Transfer Policy"}
                  {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Need help with the transfer process?
            </p>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
