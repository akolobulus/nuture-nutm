import { api } from "encore.dev/api";
import db from "../db";

interface LeaderboardEntry {
  userId: string;
  fullName: string;
  totalPoints: number;
  rank: string;
  currentStreak: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

export const leaderboard = api<void, LeaderboardResponse>(
  { method: "GET", path: "/gamification/leaderboard", expose: true },
  async () => {
    const rows = await db.queryAll<{
      user_id: string;
      full_name: string;
      total_points: number;
      rank: string;
      current_streak: number;
    }>`
      SELECT g.user_id, u.full_name, g.total_points, g.rank, g.current_streak
      FROM gamification_streaks g
      JOIN users u ON g.user_id = u.id
      ORDER BY g.total_points DESC
      LIMIT 100
    `;

    return {
      leaderboard: rows.map(row => ({
        userId: row.user_id,
        fullName: row.full_name,
        totalPoints: row.total_points,
        rank: row.rank,
        currentStreak: row.current_streak,
      })),
    };
  }
);
