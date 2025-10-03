import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Utensils, ShoppingBag, Zap, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const activityTypes = {
  travel: {
    icon: Car,
    options: ["Car", "Bike", "Public Transport", "Walking"],
    co2Factors: { Car: 0.21, Bike: 0.02, "Public Transport": 0.07, Walking: 0 },
    costFactors: { Car: 8, Bike: 0.5, "Public Transport": 2, Walking: 0 },
  },
  food: {
    icon: Utensils,
    options: ["Meat", "Vegetarian", "Vegan", "Local Produce"],
    co2Factors: { Meat: 2.5, Vegetarian: 0.8, Vegan: 0.5, "Local Produce": 0.3 },
    costFactors: { Meat: 150, Vegetarian: 80, Vegan: 60, "Local Produce": 50 },
  },
  shopping: {
    icon: ShoppingBag,
    options: ["New Clothes", "Second-hand", "Electronics", "Reusable Items"],
    co2Factors: { "New Clothes": 5, "Second-hand": 0.5, Electronics: 10, "Reusable Items": 0.2 },
    costFactors: { "New Clothes": 500, "Second-hand": 150, Electronics: 2000, "Reusable Items": 100 },
  },
  energy: {
    icon: Zap,
    options: ["Electricity", "LED Lights", "Solar Power", "Energy Efficient"],
    co2Factors: { Electricity: 0.5, "LED Lights": 0.1, "Solar Power": 0.02, "Energy Efficient": 0.15 },
    costFactors: { Electricity: 6, "LED Lights": 2, "Solar Power": 1, "Energy Efficient": 3 },
  },
};

type Category = keyof typeof activityTypes;

interface ActivityLoggerProps {
  userId: string;
  onActivityLogged?: () => void;
}

export const ActivityLogger = ({ userId, onActivityLogged }: ActivityLoggerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("travel");
  const [selectedType, setSelectedType] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLog = async () => {
    if (!selectedType || !amount) {
      toast({
        title: "Missing Information",
        description: "Please select activity type and enter amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const co2Impact =
      parseFloat(amount) * activityTypes[selectedCategory].co2Factors[selectedType as keyof typeof activityTypes[typeof selectedCategory]['co2Factors']];
    const financialImpact =
      parseFloat(amount) * activityTypes[selectedCategory].costFactors[selectedType as keyof typeof activityTypes[typeof selectedCategory]['costFactors']];

    try {
      const { error } = await supabase.from("activities").insert({
        user_id: userId,
        category: selectedCategory,
        activity_type: selectedType,
        amount: parseFloat(amount),
        co2_impact: co2Impact,
        financial_impact: financialImpact,
      });

      if (error) throw error;

      toast({
        title: "Activity Logged!",
        description: `Saved ${co2Impact.toFixed(2)}kg CO₂ and ₹${financialImpact.toFixed(0)}`,
      });

      setSelectedType("");
      setAmount("");
      onActivityLogged?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 shadow-card">
      <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Log Your Activities</h2>

      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Category)}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 h-auto">
          {Object.keys(activityTypes).map((category) => {
            const Icon = activityTypes[category as Category].icon;
            return (
              <TabsTrigger key={category} value={category} className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="capitalize">{category}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(activityTypes).map(([category, data]) => (
          <TabsContent key={category} value={category} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-10 sm:h-11">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {data.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">
                Amount ({category === "travel" ? "km" : category === "energy" ? "kWh" : "units"})
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.1"
                className="h-10 sm:h-11"
              />
            </div>

            <Button onClick={handleLog} className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={loading}>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {loading ? "Logging..." : "Log Activity"}
            </Button>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};
