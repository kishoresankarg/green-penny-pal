import { ActivityLogger } from "@/components/ActivityLogger";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Plus, Clock, TrendingUp } from "lucide-react";

const TrackActivities = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Plus className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Track Activities</h1>
          <p className="text-muted-foreground">Log your eco-friendly activities and see your impact</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-sm text-muted-foreground">Activities today</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-foreground">8.5kg</div>
              <div className="text-sm text-muted-foreground">CO₂ saved today</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold">₹</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">₹340</div>
              <div className="text-sm text-muted-foreground">Saved today</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Logger */}
      <ActivityLogger userId={user.id} onActivityLogged={() => window.location.reload()} />
    </div>
  );
};

export default TrackActivities;