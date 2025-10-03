import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface ProgressTrackerDBProps {
  userId: string;
}

interface WeekData {
  week: string;
  ecoScore: number;
  financeSaving: number;
}

export const ProgressTracker = ({ userId }: ProgressTrackerDBProps) => {
  const [weeklyData, setWeeklyData] = useState<WeekData[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    fetchProgress();
    fetchAchievements();
  }, [userId]);

  const fetchProgress = async () => {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", fourWeeksAgo.toISOString())
      .order("created_at", { ascending: true });

    if (error || !data) return;

    // Group by week
    const weeks: Record<string, { co2: number; cost: number; count: number }> = {};
    data.forEach((activity) => {
      const date = new Date(activity.created_at);
      const weekNum = Math.floor((Date.now() - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const weekKey = `Week ${4 - weekNum}`;
      if (!weeks[weekKey]) weeks[weekKey] = { co2: 0, cost: 0, count: 0 };
      weeks[weekKey].co2 += activity.co2_impact;
      weeks[weekKey].cost += activity.financial_impact;
      weeks[weekKey].count++;
    });

    const weeklyArr = Object.entries(weeks).map(([week, data]) => ({
      week,
      ecoScore: Math.min(100, data.count * 10 + data.co2),
      financeSaving: data.cost,
    }));

    setWeeklyData(weeklyArr);
  };

  const fetchAchievements = async () => {
    const { data } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false })
      .limit(1);

    setAchievements(data || []);
  };

  if (weeklyData.length === 0) {
    return (
      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Weekly Progress</h2>
        </div>
        <p className="text-center text-muted-foreground py-8">
          Start logging activities to track your progress!
        </p>
      </Card>
    );
  }

  const currentWeek = weeklyData[weeklyData.length - 1];
  const previousWeek = weeklyData[weeklyData.length - 2];
  const ecoGrowth = previousWeek
    ? currentWeek.ecoScore - previousWeek.ecoScore
    : currentWeek.ecoScore;
  const financeGrowth = previousWeek
    ? currentWeek.financeSaving - previousWeek.financeSaving
    : currentWeek.financeSaving;

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Weekly Progress</h2>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Eco Score Growth</span>
                <span className="text-sm font-bold text-primary">+{ecoGrowth.toFixed(0)} points</span>
              </div>
              <Progress value={Math.min(100, ecoGrowth * 10)} className="h-2" />
            </div>
          </Card>

          <Card className="p-4 bg-secondary/5 border-secondary/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Savings Growth</span>
                <span className="text-sm font-bold text-secondary">+₹{financeGrowth.toFixed(0)}</span>
              </div>
              <Progress value={Math.min(100, (financeGrowth / 500) * 100)} className="h-2" />
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          {weeklyData.map((week, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{week.week}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-primary font-medium">
                    Eco: {week.ecoScore.toFixed(0)}
                  </span>
                  <span className="text-sm text-secondary font-medium">
                    ₹{week.financeSaving.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Progress value={week.ecoScore} className="h-1.5" />
                <Progress value={Math.min(100, (week.financeSaving / 1500) * 100)} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>

        {achievements.length > 0 && (
          <Card className="p-4 bg-gradient-eco border-0">
            <div className="text-center space-y-1">
              <p className="text-primary-foreground/90 text-sm font-medium">
                🎉 Latest Achievement!
              </p>
              <p className="text-primary-foreground font-bold text-lg">
                {achievements[0].title}
              </p>
              <p className="text-primary-foreground/80 text-xs">
                {achievements[0].description}
              </p>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};
