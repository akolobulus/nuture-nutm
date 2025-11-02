import { api } from "encore.dev/api";
import db from "../db";

interface PlanDistribution {
  planName: string;
  count: number;
  revenue: number;
}

interface ClaimTrend {
  month: string;
  totalClaims: number;
  totalAmount: number;
}

interface AnalyticsResponse {
  planDistribution: PlanDistribution[];
  claimTrends: ClaimTrend[];
  averageClaimAmount: number;
  claimApprovalRate: number;
}

// Retrieves analytics data for admin dashboard
export const analytics = api<void, AnalyticsResponse>(
  { method: "GET", path: "/admin/analytics", expose: true },
  async () => {
    const planDist = await db.queryAll<{
      plan_name: string;
      count: number;
      revenue: number;
    }>`
      SELECT p.name as plan_name, COUNT(s.id) as count, 
             COALESCE(SUM(pay.amount), 0) as revenue
      FROM insurance_plans p
      LEFT JOIN subscriptions s ON p.id = s.plan_id AND s.status = 'active'
      LEFT JOIN payments pay ON s.id = pay.subscription_id AND pay.status = 'completed'
      GROUP BY p.name
      ORDER BY count DESC
    `;
    
    const claimTrends = await db.queryAll<{
      month: string;
      total_claims: number;
      total_amount: number;
    }>`
      SELECT TO_CHAR(submitted_at, 'YYYY-MM') as month,
             COUNT(*) as total_claims,
             SUM(amount) as total_amount
      FROM claims
      WHERE submitted_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(submitted_at, 'YYYY-MM')
      ORDER BY month DESC
    `;
    
    const avgClaim = await db.queryRow<{ avg: number }>`
      SELECT COALESCE(AVG(amount), 0) as avg FROM claims
    `;
    
    const claimStats = await db.queryRow<{
      total: number;
      approved: number;
    }>`
      SELECT COUNT(*) as total,
             COUNT(*) FILTER (WHERE status = 'approved') as approved
      FROM claims
    `;
    
    const approvalRate = claimStats && claimStats.total > 0
      ? (claimStats.approved / claimStats.total) * 100
      : 0;
    
    return {
      planDistribution: planDist.map(p => ({
        planName: p.plan_name,
        count: p.count,
        revenue: p.revenue,
      })),
      claimTrends: claimTrends.map(t => ({
        month: t.month,
        totalClaims: t.total_claims,
        totalAmount: t.total_amount,
      })),
      averageClaimAmount: avgClaim?.avg || 0,
      claimApprovalRate: approvalRate,
    };
  }
);
