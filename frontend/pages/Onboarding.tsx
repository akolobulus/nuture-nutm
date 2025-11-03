import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useBackend } from "../lib/useBackend";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Onboarding() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();

  const [nutmId, setNutmId] = useState("");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState("");

  const createUser = useMutation({
    mutationFn: async () => {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) throw new Error("Email not found");
      
      await backend.users.create({
        email,
        nutmId,
        fullName,
        phoneNumber: phoneNumber || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Account Created!",
        description: "Welcome to Nuture. Let's get you insured!",
      });
      navigate("/plans");
    },
    onError: (error: Error) => {
      console.error("Onboarding error:", error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>
              We need a few more details to set up your insurance account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.primaryEmailAddress?.emailAddress || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Must be a valid NUTM email (@nutm.edu.ng)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nutmId">NUTM Student ID *</Label>
                <Input
                  id="nutmId"
                  placeholder="e.g., NUTM/2024/12345"
                  value={nutmId}
                  onChange={(e) => setNutmId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#00A859] hover:bg-[#008f4a] text-white"
                disabled={createUser.isPending}
              >
                {createUser.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
