import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Gift, Copy, Check, UserPlus } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useBackend } from "../lib/useBackend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { formatCurrency, formatDate } from "../lib/format";

export default function Referrals() {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const { userId } = useAuth();
  const referralLink = `https://nuture.app/signup?ref=${userId}`;
  const backend = useBackend();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["referrals"],
    queryFn: async () => await backend.referrals.listByUser(),
  });

  const createReferral = useMutation({
    mutationFn: async (referredEmail: string) => {
      return await backend.referrals.create({
        referredEmail,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      toast({
        title: "Referral Created",
        description: "Your referral invitation has been sent!",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      console.error("Create referral error:", error);
      toast({
        title: "Failed to Create Referral",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "Referral link copied to clipboard!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReferral.mutate(email);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Referral Program</h1>
            <p className="text-muted-foreground">Earn rewards by referring fellow students</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Invite Your Friends</CardTitle>
                <CardDescription>
                  Share your referral link or send an email invitation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Your Referral Link</Label>
                  <div className="flex gap-2">
                    <Input value={referralLink} readOnly />
                    <Button
                      onClick={copyLink}
                      variant="outline"
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Send Email Invitation</Label>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          type="email"
                          placeholder="friend@nutm.edu.ng"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <Button
                          type="submit"
                          className="bg-[#00A859] hover:bg-[#008f4a] text-white flex-shrink-0"
                          disabled={createReferral.isPending}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Invite
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#00A859]" />
                  Your Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-[#00A859] mb-2">
                    {formatCurrency(data?.totalRewards || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Total Referrals</span>
                    <span className="font-semibold">{data?.referrals.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-semibold">
                      {data?.referrals.filter(r => r.status === "completed").length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>Track your referral invitations</CardDescription>
            </CardHeader>
            <CardContent>
              {data && data.referrals.length > 0 ? (
                <div className="space-y-4">
                  {data.referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {referral.referredName || referral.referredEmail}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Invited {formatDate(referral.createdAt)}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-bold text-[#00A859]">
                            {formatCurrency(referral.rewardAmount)}
                          </p>
                          {referral.completedAt && (
                            <p className="text-xs text-muted-foreground">
                              {formatDate(referral.completedAt)}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            referral.status === "completed"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }
                        >
                          {referral.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No referrals yet. Start inviting friends to earn rewards!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
