import { Routes, Route } from "react-router-dom";
import { SuperProgressTracker } from "@/components/SuperProgressTracker";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, TrendingUp, Target, Award } from "lucide-react";

const ProgressOverview = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Enhanced Page Header */}
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-200">
            <Trophy className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Progress & Achievements
            </h1>
            <p className="text-muted-foreground">Track your eco-journey with detailed insights and gamified milestones</p>
          </div>
        </div>
        
        {/* Quick Stats Icons */}
        <div className="absolute right-0 top-0 flex gap-2 opacity-20">
          <TrendingUp className="h-8 w-8 text-green-500" />
          <Target className="h-8 w-8 text-blue-500" />
          <Award className="h-8 w-8 text-purple-500" />
        </div>
      </div>

      {/* Super Progress Tracker */}
      <SuperProgressTracker userId={user.id} />
    </div>
  );
};

const Progress = () => {
  return (
    <Routes>
      <Route path="/" element={<ProgressOverview />} />
      <Route path="/achievements" element={<ProgressOverview />} />
      <Route path="/levels" element={<ProgressOverview />} />
      <Route path="/streaks" element={<ProgressOverview />} />
      <Route path="/challenges" element={<ProgressOverview />} />
    </Routes>
  );
};

export default Progress;