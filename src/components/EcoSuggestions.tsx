import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, Leaf, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Suggestion {
  title: string;
  description: string;
  ecoImpact: string;
  financialSaving: string;
  category: "high" | "medium" | "low";
}

const suggestions: Suggestion[] = [
  {
    title: "Switch to Public Transport",
    description: "Replace 2 car trips per week with metro or bus",
    ecoImpact: "15kg CO₂/month",
    financialSaving: "₹800/month",
    category: "high",
  },
  {
    title: "Use a Reusable Water Bottle",
    description: "Stop buying plastic bottles, use a reusable one",
    ecoImpact: "2kg CO₂/month",
    financialSaving: "₹300/month",
    category: "medium",
  },
  {
    title: "LED Bulb Replacement",
    description: "Replace 5 traditional bulbs with LED ones",
    ecoImpact: "8kg CO₂/month",
    financialSaving: "₹200/month",
    category: "medium",
  },
  {
    title: "Meatless Mondays",
    description: "Go vegetarian one day per week",
    ecoImpact: "12kg CO₂/month",
    financialSaving: "₹400/month",
    category: "high",
  },
];

const categoryColors = {
  high: "bg-primary text-primary-foreground",
  medium: "bg-accent text-accent-foreground",
  low: "bg-muted text-muted-foreground",
};

export const EcoSuggestions = () => {
  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="h-5 w-5 text-secondary" />
        <h2 className="text-2xl font-bold text-foreground">Eco Suggestions</h2>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="p-4 border-2 border-border hover:border-primary/50 transition-colors">
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
    </Card>
  );
};
