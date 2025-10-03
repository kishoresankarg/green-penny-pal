import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Calendar, 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Zap, 
  BarChart3, 
  Award,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  PartyPopper,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { useEnhancedProgressData } from "@/hooks/useEnhancedProgressData";

interface SuperProgressTrackerProps {
  userId: string;
}

export const SuperProgressTracker = ({ userId }: SuperProgressTrackerProps) => {
  const {
    loading,
    error,
    progress_data,
    weekly_trends,
    goals,
    insights,
    category_performance,
    personal_records,
    total_stats,
    refetch
  } = useEnhancedProgressData();

  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d'>('7d');

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-4"></div>
            <p className="text-muted-foreground">Loading your enhanced progress...</p>
          </div>
        </Card>
      </div>
    );
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-3 w-3 text-green-500" />;
    if (value < 0) return <ArrowDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'celebration': return <PartyPopper className="h-5 w-5 text-yellow-500" />;
      case 'trend': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5 text-purple-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <Star className="h-5 w-5 text-gray-500" />;
    }
  };

  const displayData = selectedTimeRange === '7d' 
    ? progress_data.slice(-7) 
    : progress_data;

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total CO₂ Saved</p>
              <p className="text-2xl font-bold text-green-900">{total_stats.total_co2_saved.toFixed(1)} kg</p>
            </div>
            <Zap className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Money Saved</p>
              <p className="text-2xl font-bold text-blue-900">₹{total_stats.total_money_saved.toLocaleString()}</p>
            </div>
            <Star className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Current Streak</p>
              <p className="text-2xl font-bold text-orange-900">{total_stats.current_streak} days</p>
              <p className="text-xs text-orange-600">Active: {total_stats.days_active} days</p>
            </div>
            <Flame className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Eco Level</p>
              <p className="text-2xl font-bold text-purple-900">{Math.floor(total_stats.average_eco_score / 10)}</p>
              <p className="text-xs text-purple-600">{total_stats.average_eco_score.toFixed(0)} XP</p>
            </div>
            <Trophy className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Weekly Trends
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refetch}
          >
            Refresh
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Activities</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(weekly_trends.trends.activities_change)}
                <span className={`text-xs ${getTrendColor(weekly_trends.trends.activities_change)}`}>
                  {Math.abs(weekly_trends.trends.activities_change).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xl font-bold">{weekly_trends.current_week.activities}</p>
            <p className="text-xs text-muted-foreground">vs {weekly_trends.previous_week.activities} last week</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">CO₂ Saved</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(weekly_trends.trends.co2_change)}
                <span className={`text-xs ${getTrendColor(weekly_trends.trends.co2_change)}`}>
                  {Math.abs(weekly_trends.trends.co2_change).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xl font-bold">{weekly_trends.current_week.co2_saved.toFixed(1)} kg</p>
            <p className="text-xs text-muted-foreground">vs {weekly_trends.previous_week.co2_saved.toFixed(1)} kg</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Money Saved</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(weekly_trends.trends.money_change)}
                <span className={`text-xs ${getTrendColor(weekly_trends.trends.money_change)}`}>
                  {Math.abs(weekly_trends.trends.money_change).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xl font-bold">₹{weekly_trends.current_week.money_saved.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">vs ₹{weekly_trends.previous_week.money_saved.toFixed(0)}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Eco Score</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(weekly_trends.trends.eco_score_change)}
                <span className={`text-xs ${getTrendColor(weekly_trends.trends.eco_score_change)}`}>
                  {Math.abs(weekly_trends.trends.eco_score_change).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xl font-bold">{weekly_trends.current_week.eco_score}</p>
            <p className="text-xs text-muted-foreground">vs {weekly_trends.previous_week.eco_score}</p>
          </div>
        </div>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">
            <Target className="h-4 w-4 mr-2" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Lightbulb className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="categories">
            <BarChart3 className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="records">
            <Award className="h-4 w-4 mr-2" />
            Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Goals</h3>
              <Button variant="outline" size="sm">Add Goal</Button>
            </div>
            
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{goal.title}</h4>
                      {goal.is_achieved ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Badge variant="secondary">
                          {goal.progress_percentage.toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Progress value={goal.progress_percentage} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{goal.current_value.toFixed(1)} {goal.unit}</span>
                        <span>Goal: {goal.target_value} {goal.unit}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ends: {new Date(goal.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active goals. Set your first goal to track progress!</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Insights</h3>
            
            {insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('Mark as read:', insight.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No new insights. Keep logging activities for personalized tips!</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              {category_performance.map((categoryData) => (
                <div key={categoryData.category} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">{categoryData.category}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Score:</span>
                      <span className="font-medium">{categoryData.current_score}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Target Score:</span>
                      <span className="font-medium">{categoryData.target_score}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trend:</span>
                      <span className={`font-medium ${categoryData.trend === 'up' ? 'text-green-600' : categoryData.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {categoryData.trend === 'up' ? '↗ Up' : categoryData.trend === 'down' ? '↘ Down' : '→ Stable'}
                      </span>
                    </div>
                    <Progress 
                      value={categoryData.progress_percentage} 
                      className="h-2 mt-3" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Bests</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              {personal_records.map((record) => (
                <div key={record.id} className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">{record.description}</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{record.value} {record.unit}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.achieved_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{record.category}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Daily Progress Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Daily Progress
          </h3>
          <div className="flex gap-2">
            <Button
              variant={selectedTimeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('7d')}
            >
              7 Days
            </Button>
            <Button
              variant={selectedTimeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('30d')}
            >
              30 Days
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {displayData.slice(-10).map((day, index) => (
            <div key={day.date} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-20 text-sm font-medium">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{day.activities_completed} activities</span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">{day.co2_saved.toFixed(1)} kg CO₂</span>
                    <span className="text-blue-600">₹{day.money_saved.toFixed(0)}</span>
                    <span className="text-purple-600">{day.eco_score} XP</span>
                  </div>
                </div>
                <Progress value={Math.min(100, (day.activities_completed / 5) * 100)} className="h-1.5" />
              </div>
              {day.streak_day > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Day {day.streak_day}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
