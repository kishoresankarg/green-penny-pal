import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, Leaf, TrendingDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Suggestion {
  title: string;
  description: string;
  ecoImpact: string;
  financialSaving: string;
  category: "high" | "medium" | "low";
}

const categoryColors = {
  high: "bg-primary text-primary-foreground",
  medium: "bg-accent text-accent-foreground",
  low: "bg-muted text-muted-foreground",
};

interface EcoSuggestionsAIProps {
  userId: string;
}

export const EcoSuggestions = ({ userId }: EcoSuggestionsAIProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAISuggestions = async () => {
    setLoading(true);
    try {
      const { data: activities, error: activitiesError } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (activitiesError) throw activitiesError;

      if (!activities || activities.length === 0) {
        toast({
          title: "No activities yet",
          description: "Log some activities to get personalized suggestions",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("ai-insights", {
        body: { activities },
      });

      if (error) throw error;

      setSuggestions(data.suggestions || []);
      toast({
        title: "AI Suggestions Generated!",
        description: "Personalized recommendations based on your activities",
      });
    } catch (error: any) {
      console.error("Error fetching AI suggestions:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate suggestions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-secondary" />
          <h2 className="text-2xl font-bold text-foreground">AI-Powered Suggestions</h2>
        </div>
        <Button onClick={fetchAISuggestions} disabled={loading} size="sm">
          <Sparkles className="h-4 w-4 mr-2" />
          {loading ? "Generating..." : "Get Suggestions"}
        </Button>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Click "Get Suggestions" to receive personalized eco-tips based on your activities</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className="p-4 border-2 border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{suggestion.title}</h3>
                    <Badge className={categoryColors[suggestion.category]}>
                      {suggestion.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-1.5">
                      <Leaf className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {suggestion.ecoImpact}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingDown className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">
                        {suggestion.financialSaving}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};
