import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ActivityLogger } from "@/components/ActivityLogger";
import { EcoSuggestions } from "@/components/EcoSuggestions";
import { ProgressTracker } from "@/components/ProgressTracker";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <DashboardHeader userId={user.id} onSignOut={signOut} />

        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="space-y-6">
            <ActivityLogger userId={user.id} onActivityLogged={() => window.location.reload()} />
            <ProgressTracker userId={user.id} />
          </div>

          <div>
            <EcoSuggestions userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
