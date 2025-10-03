-- Enhanced Progress Tracking System
-- This migration adds comprehensive progress tracking tables

-- Daily Progress Tracking
CREATE TABLE daily_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    activities_completed INTEGER DEFAULT 0,
    co2_saved DECIMAL(10,2) DEFAULT 0,
    money_saved DECIMAL(10,2) DEFAULT 0,
    calories_burned INTEGER DEFAULT 0,
    steps_taken INTEGER DEFAULT 0,
    eco_score INTEGER DEFAULT 0,
    streak_day INTEGER DEFAULT 0,
    goals_achieved INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Weekly Progress Summaries
CREATE TABLE weekly_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    total_activities INTEGER DEFAULT 0,
    total_co2_saved DECIMAL(10,2) DEFAULT 0,
    total_money_saved DECIMAL(10,2) DEFAULT 0,
    average_eco_score DECIMAL(5,2) DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    goals_achieved INTEGER DEFAULT 0,
    challenges_completed INTEGER DEFAULT 0,
    level_gained INTEGER DEFAULT 0,
    achievements_unlocked INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, week_start_date)
);

-- User Goals
CREATE TABLE user_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    goal_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly', 'custom'
    category VARCHAR(50) NOT NULL, -- 'co2_saved', 'money_saved', 'activities', 'steps', etc.
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(20) NOT NULL, -- 'kg', 'rupees', 'count', 'minutes'
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP WITH TIME ZONE,
    reward_type VARCHAR(50), -- 'badge', 'xp', 'discount', 'feature_unlock'
    reward_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Progress Milestones
CREATE TABLE progress_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    milestone_type VARCHAR(50) NOT NULL, -- 'total_co2', 'total_money', 'streak', 'activities'
    threshold_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    is_achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP WITH TIME ZONE,
    reward_xp INTEGER DEFAULT 0,
    reward_badge VARCHAR(100),
    reward_title VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Category Performance Tracking
CREATE TABLE category_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'transport', 'food', 'energy', 'waste'
    time_period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
    period_date DATE NOT NULL,
    activities_count INTEGER DEFAULT 0,
    co2_saved DECIMAL(10,2) DEFAULT 0,
    money_saved DECIMAL(10,2) DEFAULT 0,
    efficiency_score DECIMAL(5,2) DEFAULT 0, -- calculated metric
    improvement_rate DECIMAL(5,2) DEFAULT 0, -- % improvement from previous period
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category, time_period, period_date)
);

-- Personal Records & Achievements
CREATE TABLE personal_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    record_type VARCHAR(50) NOT NULL, -- 'highest_daily_co2', 'longest_streak', 'most_activities_day'
    record_value DECIMAL(10,2) NOT NULL,
    record_date DATE NOT NULL,
    previous_record DECIMAL(10,2),
    improvement_percentage DECIMAL(5,2),
    description TEXT,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Progress Insights & Recommendations
CREATE TABLE progress_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    insight_type VARCHAR(50) NOT NULL, -- 'trend', 'recommendation', 'celebration', 'warning'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high
    category VARCHAR(50),
    data JSONB, -- additional insight data
    is_read BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_daily_progress_user_date ON daily_progress(user_id, date DESC);
CREATE INDEX idx_weekly_progress_user ON weekly_progress(user_id, week_start_date DESC);
CREATE INDEX idx_user_goals_active ON user_goals(user_id, is_active, end_date);
CREATE INDEX idx_category_performance_user ON category_performance(user_id, time_period, period_date DESC);
CREATE INDEX idx_progress_insights_user ON progress_insights(user_id, is_read, priority DESC);

-- Enable RLS
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own daily progress" ON daily_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own weekly progress" ON weekly_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own goals" ON user_goals
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own milestones" ON progress_milestones
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own category performance" ON category_performance
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own records" ON personal_records
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own insights" ON progress_insights
    FOR ALL USING (auth.uid() = user_id);

-- Functions to update progress automatically

-- Function to update daily progress when activity is logged
CREATE OR REPLACE FUNCTION update_daily_progress()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO daily_progress (
        user_id, 
        date, 
        activities_completed, 
        co2_saved, 
        money_saved,
        eco_score
    )
    VALUES (
        NEW.user_id,
        NEW.created_at::DATE,
        1,
        NEW.co2_impact,
        NEW.financial_impact,
        CASE NEW.category 
            WHEN 'transport' THEN 15
            WHEN 'food' THEN 12
            WHEN 'energy' THEN 18
            WHEN 'waste' THEN 10
            ELSE 10
        END
    )
    ON CONFLICT (user_id, date)
    DO UPDATE SET
        activities_completed = daily_progress.activities_completed + 1,
        co2_saved = daily_progress.co2_saved + NEW.co2_impact,
        money_saved = daily_progress.money_saved + NEW.financial_impact,
        eco_score = daily_progress.eco_score + CASE NEW.category 
            WHEN 'transport' THEN 15
            WHEN 'food' THEN 12
            WHEN 'energy' THEN 18
            WHEN 'waste' THEN 10
            ELSE 10
        END,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate and update streak
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
DECLARE
    current_streak INTEGER := 0;
    check_date DATE;
BEGIN
    -- Calculate current streak
    check_date := NEW.date;
    
    -- Count consecutive days backwards from current date
    WHILE EXISTS (
        SELECT 1 FROM daily_progress 
        WHERE user_id = NEW.user_id 
        AND date = check_date 
        AND activities_completed > 0
    ) LOOP
        current_streak := current_streak + 1;
        check_date := check_date - INTERVAL '1 day';
    END LOOP;
    
    -- Update the streak_day for current record
    UPDATE daily_progress 
    SET streak_day = current_streak
    WHERE user_id = NEW.user_id AND date = NEW.date;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_daily_progress ON activities;
CREATE TRIGGER trigger_update_daily_progress
    AFTER INSERT ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_progress();

DROP TRIGGER IF EXISTS trigger_update_streak ON daily_progress;
CREATE TRIGGER trigger_update_streak
    AFTER INSERT OR UPDATE ON daily_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_streak();

-- Insert sample data for demo purposes
INSERT INTO user_goals (user_id, goal_type, category, target_value, current_value, unit, start_date, end_date) 
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'weekly', 'co2_saved', 50.0, 12.5, 'kg', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days'),
    ('11111111-1111-1111-1111-111111111111', 'monthly', 'money_saved', 2000.0, 450.0, 'rupees', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'),
    ('11111111-1111-1111-1111-111111111111', 'daily', 'activities', 3.0, 1.0, 'count', CURRENT_DATE, CURRENT_DATE);

-- Insert sample daily progress
INSERT INTO daily_progress (user_id, date, activities_completed, co2_saved, money_saved, eco_score, streak_day)
VALUES 
    ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '6 days', 2, 8.5, 150.0, 35, 1),
    ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '5 days', 3, 12.0, 200.0, 45, 2),
    ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '4 days', 1, 5.2, 80.0, 20, 3),
    ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '3 days', 4, 18.3, 320.0, 60, 4),
    ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '2 days', 2, 9.8, 180.0, 40, 5),
    ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', 3, 15.5, 250.0, 55, 6),
    ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 1, 4.2, 75.0, 25, 7);

-- Insert sample insights
INSERT INTO progress_insights (user_id, insight_type, title, description, priority, category)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'celebration', '🎉 7-Day Streak!', 'Amazing! You\'ve maintained your eco-habits for a full week. Keep going!', 3, 'streak'),
    ('11111111-1111-1111-1111-111111111111', 'trend', '📈 Transportation Impact Up 25%', 'Your eco-transport usage increased significantly this week. You\'re making a real difference!', 2, 'transport'),
    ('11111111-1111-1111-1111-111111111111', 'recommendation', '💡 Try Plant-Based Meals', 'Based on your activity pattern, adding 2 plant-based meals could save an extra 15kg CO₂ this month.', 2, 'food');