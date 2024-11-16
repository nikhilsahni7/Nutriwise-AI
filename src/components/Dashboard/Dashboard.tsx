"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";

// Define TypeScript interface for our daily log data
interface DailyLogData {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalFiber: number;
  totalIron: number;
  totalCalcium: number;
  totalPotassium: number;
  totalVitaminA: number;
  totalVitaminC: number;
  meals: Array<{
    mealType: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    iron: number;
    calcium: number;
    potassium: number;
    vitaminA: number;
    vitaminC: number;
  }>;
}

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMicronutrient, setSelectedMicronutrient] =
    useState("vitaminC");
  const [dailyLog, setDailyLog] = useState<DailyLogData | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const fetchDailyLog = async (selectedDate: Date) => {
    if (!session?.user) return;

    setLoading(true);
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      const response = await fetch(`/api/daily-logs?date=${formattedDate}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      setDailyLog(data);
    } catch (error) {
      console.error("Failed to fetch daily logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      fetchDailyLog(date);
    }
  }, [date, session]);

  const macroData = dailyLog
    ? [
        { name: "Carbohydrates", grams: dailyLog.totalCarbs },
        { name: "Protein", grams: dailyLog.totalProtein },
        { name: "Fats", grams: dailyLog.totalFats },
      ]
    : [];

  const getMicronutrientValue = () => {
    if (!dailyLog) return 0;

    const micronutrientMap: { [key: string]: number } = {
      vitaminC: dailyLog.totalVitaminC,
      vitaminA: dailyLog.totalVitaminA,
      calcium: dailyLog.totalCalcium,
      iron: dailyLog.totalIron,
      potassium: dailyLog.totalPotassium,
    };

    return micronutrientMap[selectedMicronutrient] || 0;
  };

  // Calculate nutrients in excess or deficit (example thresholds)
  const calculateNutrientStatus = () => {
    if (!dailyLog) return { excess: [], deficit: [] };

    const thresholds = {
      protein: { min: 50, max: 200 },
      fiber: { min: 25, max: 50 },
      iron: { min: 8, max: 45 },
      calcium: { min: 1000, max: 2500 },
      vitaminC: { min: 65, max: 2000 },
    };

    const excess = [];
    const deficit = [];

    if (dailyLog.totalProtein > thresholds.protein.max) excess.push("Protein");
    if (dailyLog.totalProtein < thresholds.protein.min) deficit.push("Protein");
    if (dailyLog.totalFiber > thresholds.fiber.max) excess.push("Fiber");
    if (dailyLog.totalFiber < thresholds.fiber.min) deficit.push("Fiber");
    // Add more nutrients as needed

    return { excess, deficit };
  };

  const nutrientStatus = calculateNutrientStatus();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            Daily Nutrition Dashboard
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="flex justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              // onSelect={(value) => handleDateSelect(value)}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Calories Consumed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {dailyLog?.totalCalories?.toFixed(0) || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Macronutrients (grams)</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macroData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="grams" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Micronutrient Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={setSelectedMicronutrient}
                defaultValue={selectedMicronutrient}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select micronutrient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vitaminC">Vitamin C</SelectItem>
                  <SelectItem value="vitaminA">Vitamin A</SelectItem>
                  <SelectItem value="calcium">Calcium</SelectItem>
                  <SelectItem value="iron">Iron</SelectItem>
                  <SelectItem value="potassium">Potassium</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-4 text-2xl font-bold">
                {getMicronutrientValue().toFixed(1)} mcg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meal Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dailyLog?.meals.map((meal, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="capitalize">{meal.mealType}:</span>
                    <span>{meal.calories.toFixed(0)} calories</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nutrients in Excess</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {nutrientStatus.excess.map((nutrient, index) => (
                <li key={index}>{nutrient}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutrients in Deficit</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {nutrientStatus.deficit.map((nutrient, index) => (
                <li key={index}>{nutrient}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
