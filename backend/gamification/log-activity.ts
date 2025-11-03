import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";
import { randomUUID } from "crypto";

interface LogActivityRequest {
  activityType: string;
}

interface LogActivityResponse {
  pointsEarned: number;
  newTotalPoints: number;
  currentStreak: number;
  rank: string;
}

const ACTIVITY_POINTS: Record<string, number> = {
  "login": 5,
  "claim_submitted": 20,
  "policy_purchased": 50,
  "referral_completed": 30,
  "health_tip_read": 10,
};

const RANK_THRESHOLDS = [
  { rank: "Novice", minPoints: 0 },
  { rank: "Bronze", minPoints: 100 },
  { rank: "Silver", minPoints: 300 },
  { rank: "Gold", minPoints: 600 },
  { rank: "Platinum", minPoints: 1000 },
  { rank: "Diamond", minPoints: 2000 },
  { rank: "Legend", minPoints: 5000 },
];

function calculateRank(points: number): string {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= RANK_THRESHOLDS[i].minPoints) {
      return RANK_THRESHOLDS[i].rank;
    }
  }
  return "Novice";
}

export const logActivity = api<LogActivityRequest, LogActivityResponse>(
  { method: "POST", path: "/gamification/activity", expose: true, auth: true },
  async (req) => {
    const auth = getAuthData()! as AuthData;
    const userId = auth.userID;

    const pointsEarned = ACTIVITY_POINTS[req.activityType] || 5;
    const today = new Date().toISOString().split('T')[0];

    const activityId = randomUUID();
    await db.exec`
      INSERT INTO streak_activities (id, user_id, activity_type, points_earned, activity_date)
      VALUES (${activityId}, ${userId}, ${req.activityType}, ${pointsEarned}, ${today})
    `;

    let streak = await db.queryRow<{
      id: string;
      current_streak: number;
      longest_streak: number;
      total_points: number;
      last_activity_date?: Date;
    }>`
      SELECT id, current_streak, longest_streak, total_points, last_activity_date
      FROM gamification_streaks
      WHERE user_id = ${userId}
    `;

    if (!streak) {
      const streakId = randomUUID();
      await db.exec`
        INSERT INTO gamification_streaks (id, user_id, current_streak, longest_streak, total_points, rank, last_activity_date)
        VALUES (${streakId}, ${userId}, 1, 1, ${pointsEarned}, 'Novice', ${today})
      `;

      return {
        pointsEarned,
        newTotalPoints: pointsEarned,
        currentStreak: 1,
        rank: "Novice",
      };
    }

    const newTotalPoints = streak.total_points + pointsEarned;
    let currentStreak = streak.current_streak;
    let longestStreak = streak.longest_streak;

    if (streak.last_activity_date) {
      const lastDate = new Date(streak.last_activity_date);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    const newRank = calculateRank(newTotalPoints);

    await db.exec`
      UPDATE gamification_streaks
      SET current_streak = ${currentStreak},
          longest_streak = ${longestStreak},
          total_points = ${newTotalPoints},
          rank = ${newRank},
          last_activity_date = ${today},
          updated_at = NOW()
      WHERE id = ${streak.id}
    `;

    return {
      pointsEarned,
      newTotalPoints,
      currentStreak,
      rank: newRank,
    };
  }
);
