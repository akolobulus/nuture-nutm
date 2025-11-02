import { useQuery } from "@tanstack/react-query";
import { Users, FileText, DollarSign, TrendingUp, Activity } from "lucide-react";
import backend from "~backend/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { formatCurrency, formatDate, getStatusColor } from "../lib/format";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => await backend.admin.dashboardStats(),
  });

  const { data: policies } = useQuery({
    queryKey: ["admin-policies"],
    queryFn: async () => await backend.admin.listPolicies({ limit: 10 }),
  });

  const { data: claims } = useQuery({
    queryKey: ["admin-claims"],
    queryFn: async () => await backend.admin.listAllClaims({ status: "pending", limit: 10 }),
  });

  const { data: analytics } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => await backend.admin.analytics(),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage the platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Registered students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeSubscriptions || 0}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingClaims || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>Active subscriptions by plan tier</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics && analytics.planDistribution.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.planDistribution.map((plan) => (
                      <div key={plan.planName} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{plan.planName}</p>
                          <p className="text-sm text-muted-foreground">
                            {plan.count} subscribers
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#00A859]">
                            {formatCurrency(plan.revenue)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claim Analytics</CardTitle>
                <CardDescription>Key metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="text-muted-foreground">Average Claim</span>
                    <span className="font-bold text-[#00A859]">
                      {formatCurrency(analytics?.averageClaimAmount || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="text-muted-foreground">Approval Rate</span>
                    <span className="font-bold text-[#00A859]">
                      {analytics?.claimApprovalRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-bold text-[#00A859]">
                      {formatCurrency(stats?.totalClaimsAmount || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Policies</CardTitle>
                <CardDescription>Latest insurance subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                {policies && policies.policies.length > 0 ? (
                  <div className="space-y-3">
                    {policies.policies.map((policy) => (
                      <div
                        key={policy.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{policy.userName}</p>
                          <p className="text-sm text-muted-foreground">{policy.planName}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No policies yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Claims</CardTitle>
                <CardDescription>Claims awaiting review</CardDescription>
              </CardHeader>
              <CardContent>
                {claims && claims.claims.length > 0 ? (
                  <div className="space-y-3">
                    {claims.claims.map((claim) => (
                      <div
                        key={claim.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{claim.userName}</p>
                          <p className="text-sm text-muted-foreground">{claim.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#00A859]">
                            {formatCurrency(claim.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(claim.submittedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No pending claims</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
