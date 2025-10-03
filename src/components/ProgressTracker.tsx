import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface WeekData {
  week: string;
  ecoScore: number;
  financeSaving: number;
}

const weeklyData: WeekData[] = [
  { week: "Week 1", ecoScore: 65, financeSaving: 450 },
  { week: "Week 2", ecoScore: 72, financeSaving: 680 },
  { week: "Week 3", ecoScore: 78, financeSaving: 820 },
  { week: "Week 4", ecoScore: 85, financeSaving: 1200 },
];

export const ProgressTracker = () => {
  const currentWeek = weeklyData[weeklyData.length - 1];
  const previousWeek = weeklyData[weeklyData.length - 2];
  const ecoGrowth = currentWeek.ecoScore - previousWeek.ecoScore;
  const financeGrowth = currentWeek.financeSaving - previousWeek.financeSaving;

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
                <span className="text-sm font-bold text-primary">+{ecoGrowth} points</span>
              </div>
              <Progress value={ecoGrowth * 10} className="h-2" />
            </div>
          </Card>

          <Card className="p-4 bg-secondary/5 border-secondary/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Savings Growth</span>
                <span className="text-sm font-bold text-secondary">+₹{financeGrowth}</span>
              </div>
              <Progress value={(financeGrowth / 500) * 100} className="h-2" />
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
                    Eco: {week.ecoScore}
                  </span>
                  <span className="text-sm text-secondary font-medium">
                    ₹{week.financeSaving}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Progress value={week.ecoScore} className="h-1.5" />
                <Progress value={(week.financeSaving / 1500) * 100} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>

        <Card className="p-4 bg-gradient-eco border-0">
          <div className="text-center space-y-1">
            <p className="text-primary-foreground/90 text-sm font-medium">
              🎉 Achievement Unlocked!
            </p>
            <p className="text-primary-foreground font-bold text-lg">
              Eco Warrior - Week 4
            </p>
            <p className="text-primary-foreground/80 text-xs">
              You've consistently improved for 4 weeks!
            </p>
          </div>
        </Card>
      </div>
    </Card>
  );
};
