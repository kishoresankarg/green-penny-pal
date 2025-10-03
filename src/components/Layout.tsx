import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

// Import pages - using relative paths to avoid module resolution issues
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import TrackActivities from "../pages/TrackActivities";
import Analytics from "../pages/Analytics";
import Progress from "../pages/Progress";
import Community from "../pages/Community";
import Insights from "../pages/Insights";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

export const Layout = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock user level data (in real app, fetch from database)
  const userLevel = {
    level: 6,
    title: "Eco Warrior",
    icon: "🌿"
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={user} 
        onSignOut={signOut}
        userLevel={userLevel}
        notifications={3}
        currentStreak={12}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/track" element={<TrackActivities />} />
          <Route path="/analytics/*" element={<Analytics />} />
          <Route path="/progress/*" element={<Progress />} />
          <Route path="/community/*" element={<Community />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};