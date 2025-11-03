import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";
import { randomUUID } from "crypto";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  rank: string;
  lastActivityDate?: string;
}

export const getStreak = api<void, StreakData>(
  { method: "GET", path: "/gamification/streak", expose: true, auth: true },
  async () => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;

    let streak = await db.queryRow<{
      current_streak: number;
      longest_streak: number;
      total_points: number;
      rank: string;
      last_activity_date?: Date;
    }>`
      SELECT current_streak, longest_streak, total_points, rank, last_activity_date
      FROM gamification_streaks
      WHERE user_id = ${userId}
    `;

    if (!streak) {
      const id = randomUUID();
      await db.exec`
        INSERT INTO gamification_streaks (id, user_id, current_streak, longest_streak, total_points, rank)
        VALUES (${id}, ${userId}, 0, 0, 0, 'Novice')
      `;

      streak = {
        current_streak: 0,
        longest_streak: 0,
        total_points: 0,
        rank: 'Novice',
      };
    }

    return {
      currentStreak: streak.current_streak,
      longestStreak: streak.longest_streak,
      totalPoints: streak.total_points,
      rank: streak.rank,
      lastActivityDate: streak.last_activity_date?.toISOString().split('T')[0],
    };
  }
);
