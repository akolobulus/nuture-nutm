import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import backend from "~backend/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Leaderboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => await backend.gamification.leaderboard(),
  });

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      "Novice": "bg-gray-500/20 text-gray-500",
      "Bronze": "bg-amber-700/20 text-amber-700",
      "Silver": "bg-gray-400/20 text-gray-400",
      "Gold": "bg-yellow-500/20 text-yellow-500",
      "Platinum": "bg-cyan-500/20 text-cyan-500",
      "Diamond": "bg-blue-500/20 text-blue-500",
      "Legend": "bg-purple-500/20 text-purple-500",
    };
    return colors[rank] || colors["Novice"];
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />;
      default:
        return <span className="w-5 text-center font-semibold text-muted-foreground">{position}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-10 h-10 text-[#00A859]" />
              <h1 className="text-4xl font-bold">Leaderboard</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Top students ranked by engagement and activity
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top 100 Users
              </CardTitle>
              <CardDescription>
                Earn points by staying active, submitting claims, and referring friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data?.leaderboard.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8">
                      {getPositionIcon(index + 1)}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">{entry.fullName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge className={getRankColor(entry.rank)} variant="outline">
                          {entry.rank}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {entry.currentStreak} day streak 🔥
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#00A859]">
                        {entry.totalPoints.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}

                {data?.leaderboard.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No users on the leaderboard yet.</p>
                    <p className="text-sm mt-2">Be the first to start earning points!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
