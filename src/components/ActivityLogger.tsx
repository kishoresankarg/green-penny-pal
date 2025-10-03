import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Utensils, ShoppingBag, Zap, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const ActivityLogger = () => {
  const [selectedTab, setSelectedTab] = useState("travel");

  const handleLogActivity = (category: string) => {
    toast.success(`${category} activity logged!`, {
      description: "Your eco and finance scores have been updated.",
    });
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Log Activity</h2>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="travel" className="gap-2">
            <Car className="h-4 w-4" />
            Travel
          </TabsTrigger>
          <TabsTrigger value="food" className="gap-2">
            <Utensils className="h-4 w-4" />
            Food
          </TabsTrigger>
          <TabsTrigger value="shopping" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Shopping
          </TabsTrigger>
          <TabsTrigger value="energy" className="gap-2">
            <Zap className="h-4 w-4" />
            Energy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="travel" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="travel-mode">Travel Mode</Label>
            <Select>
              <SelectTrigger id="travel-mode">
                <SelectValue placeholder="Select travel mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walk">Walking</SelectItem>
                <SelectItem value="bike">Bicycle</SelectItem>
                <SelectItem value="public">Public Transport</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input id="distance" type="number" placeholder="Enter distance" />
          </div>
          <Button onClick={() => handleLogActivity("Travel")} className="w-full">
            Log Travel
          </Button>
        </TabsContent>

        <TabsContent value="food" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select>
              <SelectTrigger id="meal-type">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="pescatarian">Pescatarian</SelectItem>
                <SelectItem value="meat">Meat-based</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost (₹)</Label>
            <Input id="cost" type="number" placeholder="Enter cost" />
          </div>
          <Button onClick={() => handleLogActivity("Food")} className="w-full">
            Log Meal
          </Button>
        </TabsContent>

        <TabsContent value="shopping" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="item-type">Item Type</Label>
            <Select>
              <SelectTrigger id="item-type">
                <SelectValue placeholder="Select item type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reusable">Reusable Item</SelectItem>
                <SelectItem value="secondhand">Second-hand</SelectItem>
                <SelectItem value="local">Local Product</SelectItem>
                <SelectItem value="new">New Item</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input id="amount" type="number" placeholder="Enter amount" />
          </div>
          <Button onClick={() => handleLogActivity("Shopping")} className="w-full">
            Log Purchase
          </Button>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="energy-type">Energy Source</Label>
            <Select>
              <SelectTrigger id="energy-type">
                <SelectValue placeholder="Select energy source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="usage">Usage (kWh)</Label>
            <Input id="usage" type="number" placeholder="Enter usage" />
          </div>
          <Button onClick={() => handleLogActivity("Energy")} className="w-full">
            Log Energy
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
