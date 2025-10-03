import { useEffect, useState } from "react";
import { Leaf, TrendingUp, Sprout, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface DashboardHeaderDBProps {
  userId: string;
  onSignOut: () => void;
}

export const DashboardHeader = ({ userId, onSignOut }: DashboardHeaderDBProps) => {
  const [stats, setStats] = useState({
    ecoScore: 0,
    financeScore: 0,
    treesSaved: 0,
    co2Reduced: 0,
    moneySaved: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("co2_impact, financial_impact")
      .eq("user_id", userId);

    if (error || !data) return;

    const totalCO2 = data.reduce((sum, a) => sum + a.co2_impact, 0);
    const totalSavings = data.reduce((sum, a) => sum + a.financial_impact, 0);
    const treesSaved = Math.floor(totalCO2 / 12);
    const ecoScore = Math.min(100, data.length * 5 + treesSaved);
    const financeScore = Math.min(100, Math.floor(totalSavings / 50));

    setStats({
      ecoScore,
      financeScore,
      treesSaved,
      co2Reduced: totalCO2,
      moneySaved: totalSavings,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-eco bg-clip-text text-transparent">
            Your Impact Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your eco-friendly journey and savings
          </p>
        </div>
        <Button onClick={onSignOut} variant="outline" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 bg-gradient-eco shadow-eco border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">Eco Score</p>
              <p className="text-4xl font-bold text-primary-foreground mt-1">{stats.ecoScore}</p>
              <div className="flex items-center gap-2 mt-2">
                <Leaf className="h-4 w-4 text-primary-foreground/80" />
                <span className="text-primary-foreground/90 text-sm">
                  {stats.treesSaved} trees saved
                </span>
              </div>
            </div>
            <div className="h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Sprout className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-finance shadow-eco border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-foreground/80 text-sm font-medium">Finance Score</p>
              <p className="text-4xl font-bold text-secondary-foreground mt-1">
                {stats.financeScore}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-secondary-foreground/80" />
                <span className="text-secondary-foreground/90 text-sm">
                  ₹{stats.moneySaved.toFixed(0)} saved
                </span>
              </div>
            </div>
            <div className="h-20 w-20 rounded-full bg-secondary-foreground/20 flex items-center justify-center">
              <TrendingUp className="h-10 w-10 text-secondary-foreground" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.treesSaved}</p>
              <p className="text-sm text-muted-foreground">Trees Saved</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Sprout className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.co2Reduced.toFixed(1)}kg</p>
              <p className="text-sm text-muted-foreground">CO₂ Reduced</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">₹{stats.moneySaved.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">Money Saved</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
