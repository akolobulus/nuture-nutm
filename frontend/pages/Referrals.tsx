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

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.referrals.length || 0}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.referrals.filter(r => r.status === "completed").length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rewards Earned</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#00A859]">
                  {formatCurrency(data?.totalRewards || 0)}
                </div>
                <p className="text-xs text-muted-foreground">All time earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {formatCurrency(
                    data?.referrals
                      .filter(r => r.status === "pending")
                      .reduce((sum, r) => sum + r.rewardAmount, 0) || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Processing</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Share Nuture with your friends and earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00A859]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#00A859] font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Share Your Link</h3>
                      <p className="text-sm text-muted-foreground">
                        Copy your unique link and share it with fellow NUTM students.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00A859]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#00A859] font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">They Register</h3>
                      <p className="text-sm text-muted-foreground">
                        Your friend signs up for Nuture using your referral link.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00A859]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#00A859] font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">You Earn Rewards</h3>
                      <p className="text-sm text-muted-foreground">
                        You get ₦500 once they subscribe to a plan. They get a discount too!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share Your Link</CardTitle>
                <CardDescription>
                  Copy your unique referral link and share it to start earning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input value={referralLink} readOnly className="font-mono text-sm" />
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

                <Button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join Nuture for affordable student health insurance! Use my referral link: ${referralLink}`)}`, '_blank')}
                  className="w-full bg-[#25D366] hover:bg-[#20BD5C] text-white"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Share on WhatsApp
                </Button>

                <div className="border-t border-border pt-4">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Label htmlFor="email" className="text-sm">Or send email invitation</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="friend@nutm.edu.ng"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-sm"
                      />
                      <Button
                        type="submit"
                        className="bg-[#00A859] hover:bg-[#008f4a] text-white flex-shrink-0"
                        disabled={createReferral.isPending}
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
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
