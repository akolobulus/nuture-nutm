import { useQuery } from "@tanstack/react-query";
import { CreditCard, FileText, Gift, Calendar, AlertCircle } from "lucide-react";
import { useBackend } from "../lib/useBackend";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { formatCurrency, formatDate, getDaysUntil, getStatusColor } from "../lib/format";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const backend = useBackend();

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => await backend.subscriptions.getByUser(),
  });

  const { data: claims } = useQuery({
    queryKey: ["claims"],
    queryFn: async () => await backend.claims.listByUser({}),
  });

  const { data: referrals } = useQuery({
    queryKey: ["referrals"],
    queryFn: async () => await backend.referrals.listByUser(),
  });

  const activeSub = subscription?.subscription;
  const daysUntilRenewal = activeSub ? getDaysUntil(activeSub.endDate) : 0;
  const needsRenewal = daysUntilRenewal <= 7 && daysUntilRenewal > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your insurance and claims</p>
          </div>

          {needsRenewal && (
            <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-500">
                Your subscription renews in {daysUntilRenewal} day(s). 
                {activeSub?.autoRenew ? " Auto-renewal is enabled." : " Please renew to avoid interruption."}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plan</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeSub ? activeSub.planName : "None"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {activeSub ? `Renews ${formatDate(activeSub.endDate)}` : "No active subscription"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{claims?.claims.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {claims?.claims.filter(c => c.status === "pending").length || 0} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Referral Rewards</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(referrals?.totalRewards || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {referrals?.referrals.length || 0} total referrals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Renewal</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeSub ? `${daysUntilRenewal} days` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {activeSub?.autoRenew ? "Auto-renew ON" : "Auto-renew OFF"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Claims</CardTitle>
                <CardDescription>Your latest claim submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {claims && claims.claims.length > 0 ? (
                  <div className="space-y-4">
                    {claims.claims.slice(0, 5).map((claim) => (
                      <div key={claim.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{claim.description}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(claim.submittedAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(claim.amount)}</p>
                          <Badge variant="outline" className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No claims submitted yet</p>
                  </div>
                )}
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/claims">View All Claims</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-[#00A859] hover:bg-[#008f4a] text-white justify-start">
                  <Link to="/submit-claim">
                    <FileText className="mr-2 w-4 h-4" />
                    Submit New Claim
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/claims">
                    <FileText className="mr-2 w-4 h-4" />
                    Track Claims
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/referrals">
                    <Gift className="mr-2 w-4 h-4" />
                    Refer Friends
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/health-tips">
                    <Calendar className="mr-2 w-4 h-4" />
                    Health Tips
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
