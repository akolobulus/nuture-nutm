import { api } from "encore.dev/api";
import db from "../db";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  pendingClaims: number;
  totalClaimsAmount: number;
  totalRevenue: number;
}

// Retrieves dashboard statistics for admin
export const dashboardStats = api<void, DashboardStats>(
  { method: "GET", path: "/admin/dashboard-stats", expose: true },
  async () => {
    const userCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM users
    `;
    
    const activeSubCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'
    `;
    
    const pendingClaimsCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM claims WHERE status = 'pending'
    `;
    
    const claimsAmount = await db.queryRow<{ total: number }>`
      SELECT COALESCE(SUM(amount), 0) as total FROM claims WHERE status = 'approved'
    `;
    
    const revenue = await db.queryRow<{ total: number }>`
      SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'
    `;
    
    return {
      totalUsers: userCount?.count || 0,
      activeSubscriptions: activeSubCount?.count || 0,
      pendingClaims: pendingClaimsCount?.count || 0,
      totalClaimsAmount: claimsAmount?.total || 0,
      totalRevenue: revenue?.total || 0,
    };
  }
);
