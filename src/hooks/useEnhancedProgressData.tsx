import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Enhanced Progress Types
export interface DailyProgressData {
  date: string;
  activities_completed: number;
  co2_saved: number;
  money_saved: number;
  eco_score: number;
  streak_day: number;
}

export interface ProgressGoal {
  id: string;
  title: string;
  category: 'co2_saved' | 'money_saved' | 'activities' | 'streak';
  target_value: number;
  current_value: number;
  unit: string;
  progress_percentage: number;
  end_date: string;
  is_achieved: boolean;
}

export interface ProgressInsight {
  id: string;
  type: 'celebration' | 'trend' | 'recommendation' | 'warning';
  title: string;
  description: string;
  priority: number;
  data?: any;
}

export interface WeeklyTrend {
  current_week: {
    activities: number;
    co2_saved: number;
    money_saved: number;
    eco_score: number;
  };
  previous_week: {
    activities: number;
    co2_saved: number;
    money_saved: number;
    eco_score: number;
  };
  trends: {
    activities_change: number;
    co2_change: number;
    money_change: number;
    eco_score_change: number;
  };
}

export interface CategoryPerformance {
  category: string;
  current_score: number;
  target_score: number;
  progress_percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PersonalRecord {
  id: string;
  category: string;
  record_type: 'highest_daily_co2' | 'longest_streak' | 'biggest_savings' | 'most_activities';
  value: number;
  unit: string;
  achieved_date: string;
  description: string;
}

export interface EnhancedProgressStats {
  loading: boolean;
  error: string | null;
  progress_data: DailyProgressData[];
  weekly_trends: WeeklyTrend;
  goals: ProgressGoal[];
  insights: ProgressInsight[];
  category_performance: CategoryPerformance[];
  personal_records: PersonalRecord[];
  total_stats: {
    total_co2_saved: number;
    total_money_saved: number;
    total_activities: number;
    current_streak: number;
    average_eco_score: number;
    days_active: number;
  };
}

// Generate realistic mock data for 30 days
const generateEnhancedMockData = (): DailyProgressData[] => {
  const data: DailyProgressData[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate realistic daily variations
    const baseActivities = Math.floor(Math.random() * 8) + 2;
    const baseCO2 = Math.random() * 15 + 3;
    const baseMoney = Math.random() * 25 + 5;
    
    data.push({
      date: date.toISOString().split('T')[0],
      activities_completed: baseActivities,
      co2_saved: Number(baseCO2.toFixed(2)),
      money_saved: Number(baseMoney.toFixed(2)),
      eco_score: Math.floor((baseActivities * 10 + baseCO2 + baseMoney) / 2),
      streak_day: i < 7 ? 30 - i : 0, // Last 7 days maintain streak
    });
  }
  
  return data;
};

const generateMockGoals = (): ProgressGoal[] => [
  {
    id: 'goal-1',
    title: 'Weekly CO2 Reduction',
    category: 'co2_saved',
    target_value: 50,
    current_value: 34.5,
    unit: 'kg CO2',
    progress_percentage: 69,
    end_date: '2024-12-31',
    is_achieved: false,
  },
  {
    id: 'goal-2',
    title: 'Monthly Savings Target',
    category: 'money_saved',
    target_value: 200,
    current_value: 145,
    unit: '$',
    progress_percentage: 72,
    end_date: '2024-12-31',
    is_achieved: false,
  },
  {
    id: 'goal-3',
    title: '30-Day Streak',
    category: 'streak',
    target_value: 30,
    current_value: 23,
    unit: 'days',
    progress_percentage: 77,
    end_date: '2024-12-15',
    is_achieved: false,
  },
];

const generateMockInsights = (): ProgressInsight[] => [
  {
    id: 'insight-1',
    type: 'celebration',
    title: 'Great Progress!',
    description: 'You\'ve saved 15% more CO2 this week compared to last week.',
    priority: 1,
  },
  {
    id: 'insight-2',
    type: 'trend',
    title: 'Consistency Improving',
    description: 'Your daily activity completion rate has increased by 25% this month.',
    priority: 2,
  },
  {
    id: 'insight-3',
    type: 'recommendation',
    title: 'Weekend Opportunity',
    description: 'Consider adding weekend activities to boost your eco-score.',
    priority: 3,
  },
];

const generateMockCategories = (): CategoryPerformance[] => [
  {
    category: 'Transportation',
    current_score: 85,
    target_score: 90,
    progress_percentage: 94,
    trend: 'up',
  },
  {
    category: 'Energy',
    current_score: 78,
    target_score: 85,
    progress_percentage: 92,
    trend: 'stable',
  },
  {
    category: 'Water',
    current_score: 92,
    target_score: 90,
    progress_percentage: 100,
    trend: 'up',
  },
  {
    category: 'Waste',
    current_score: 73,
    target_score: 80,
    progress_percentage: 91,
    trend: 'down',
  },
];

const generateMockRecords = (): PersonalRecord[] => [
  {
    id: 'record-1',
    category: 'Daily Impact',
    record_type: 'highest_daily_co2',
    value: 28.5,
    unit: 'kg CO2',
    achieved_date: '2024-11-15',
    description: 'Highest daily CO2 savings',
  },
  {
    id: 'record-2',
    category: 'Consistency',
    record_type: 'longest_streak',
    value: 45,
    unit: 'days',
    achieved_date: '2024-10-20',
    description: 'Longest activity streak',
  },
  {
    id: 'record-3',
    category: 'Financial',
    record_type: 'biggest_savings',
    value: 125,
    unit: '$',
    achieved_date: '2024-11-01',
    description: 'Biggest monthly savings',
  },
];

export const useEnhancedProgressData = () => {
  const { user } = useAuth();
  const [progressStats, setProgressStats] = useState<EnhancedProgressStats>({
    loading: true,
    error: null,
    progress_data: [],
    weekly_trends: {
      current_week: { activities: 0, co2_saved: 0, money_saved: 0, eco_score: 0 },
      previous_week: { activities: 0, co2_saved: 0, money_saved: 0, eco_score: 0 },
      trends: { activities_change: 0, co2_change: 0, money_change: 0, eco_score_change: 0 },
    },
    goals: [],
    insights: [],
    category_performance: [],
    personal_records: [],
    total_stats: {
      total_co2_saved: 0,
      total_money_saved: 0,
      total_activities: 0,
      current_streak: 0,
      average_eco_score: 0,
      days_active: 0,
    },
  });

  // Calculate weekly trends from daily data
  const calculateWeeklyTrends = (data: DailyProgressData[]): WeeklyTrend => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - 6);
    
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);
    
    const currentWeekData = data.filter(d => {
      const date = new Date(d.date);
      return date >= currentWeekStart && date <= today;
    });
    
    const previousWeekData = data.filter(d => {
      const date = new Date(d.date);
      return date >= previousWeekStart && date < currentWeekStart;
    });
    
    const sumWeekData = (weekData: DailyProgressData[]) => ({
      activities: weekData.reduce((sum, d) => sum + d.activities_completed, 0),
      co2_saved: weekData.reduce((sum, d) => sum + d.co2_saved, 0),
      money_saved: weekData.reduce((sum, d) => sum + d.money_saved, 0),
      eco_score: weekData.reduce((sum, d) => sum + d.eco_score, 0) / weekData.length || 0,
    });
    
    const current_week = sumWeekData(currentWeekData);
    const previous_week = sumWeekData(previousWeekData);
    
    const calculateChange = (current: number, previous: number) => 
      previous > 0 ? Number(((current - previous) / previous * 100).toFixed(1)) : 0;
    
    return {
      current_week,
      previous_week,
      trends: {
        activities_change: calculateChange(current_week.activities, previous_week.activities),
        co2_change: calculateChange(current_week.co2_saved, previous_week.co2_saved),
        money_change: calculateChange(current_week.money_saved, previous_week.money_saved),
        eco_score_change: calculateChange(current_week.eco_score, previous_week.eco_score),
      },
    };
  };

  // Calculate total statistics
  const calculateTotalStats = (data: DailyProgressData[]) => {
    const total_co2_saved = data.reduce((sum, d) => sum + d.co2_saved, 0);
    const total_money_saved = data.reduce((sum, d) => sum + d.money_saved, 0);
    const total_activities = data.reduce((sum, d) => sum + d.activities_completed, 0);
    const current_streak = Math.max(...data.map(d => d.streak_day));
    const average_eco_score = data.reduce((sum, d) => sum + d.eco_score, 0) / data.length;
    const days_active = data.filter(d => d.activities_completed > 0).length;
    
    return {
      total_co2_saved: Number(total_co2_saved.toFixed(2)),
      total_money_saved: Number(total_money_saved.toFixed(2)),
      total_activities,
      current_streak,
      average_eco_score: Number(average_eco_score.toFixed(1)),
      days_active,
    };
  };

  // Fetch data from database or use mock data
  const fetchEnhancedProgressData = async () => {
    if (!user?.id) {
      // Generate mock data for demo
      const mockData = generateEnhancedMockData();
      const weekly_trends = calculateWeeklyTrends(mockData);
      const total_stats = calculateTotalStats(mockData);
      
      setProgressStats({
        loading: false,
        error: null,
        progress_data: mockData,
        weekly_trends,
        goals: generateMockGoals(),
        insights: generateMockInsights(),
        category_performance: generateMockCategories(),
        personal_records: generateMockRecords(),
        total_stats,
      });
      return;
    }

    try {
      setProgressStats(prev => ({ ...prev, loading: true, error: null }));

      // Try to fetch from activities table (existing table)
      const { data: activitiesData, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Transform activities data to progress format
      const progressData = activitiesData?.map(activity => ({
        date: activity.created_at.split('T')[0],
        activities_completed: 1,
        co2_saved: activity.co2_impact || 0,
        money_saved: activity.financial_impact || 0,
        eco_score: Math.floor((activity.co2_impact || 0) * 10),
        streak_day: 0, // Would need streak calculation logic
      })) || [];

      // Fill in with mock data if insufficient real data
      const mockData = generateEnhancedMockData();
      const finalData = progressData.length > 0 ? progressData : mockData;
      
      const weekly_trends = calculateWeeklyTrends(finalData);
      const total_stats = calculateTotalStats(finalData);

      setProgressStats({
        loading: false,
        error: null,
        progress_data: finalData,
        weekly_trends,
        goals: generateMockGoals(),
        insights: generateMockInsights(),
        category_performance: generateMockCategories(),
        personal_records: generateMockRecords(),
        total_stats,
      });

    } catch (error) {
      console.error('Error fetching progress data:', error);
      
      // Fallback to mock data
      const mockData = generateEnhancedMockData();
      const weekly_trends = calculateWeeklyTrends(mockData);
      const total_stats = calculateTotalStats(mockData);
      
      setProgressStats({
        loading: false,
        error: null,
        progress_data: mockData,
        weekly_trends,
        goals: generateMockGoals(),
        insights: generateMockInsights(),
        category_performance: generateMockCategories(),
        personal_records: generateMockRecords(),
        total_stats,
      });
    }
  };

  useEffect(() => {
    fetchEnhancedProgressData();
  }, [user?.id]);

  return {
    ...progressStats,
    refetch: fetchEnhancedProgressData,
  };
};