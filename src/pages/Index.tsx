import { DashboardHeader } from "@/components/DashboardHeader";
import { ActivityLogger } from "@/components/ActivityLogger";
import { EcoSuggestions } from "@/components/EcoSuggestions";
import { ProgressTracker } from "@/components/ProgressTracker";

const Index = () => {
  // Mock data - will be replaced with real data from backend
  const dashboardData = {
    ecoScore: 85,
    financeScore: 92,
    treesSaved: 12,
    co2Reduced: 145,
    moneySaved: 3150,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <DashboardHeader {...dashboardData} />
        
        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="space-y-6">
            <ActivityLogger />
            <ProgressTracker />
          </div>
          
          <div>
            <EcoSuggestions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
