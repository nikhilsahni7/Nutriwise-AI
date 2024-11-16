'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useSession } from "next-auth/react";

// Mock data
const nutritionData = {
  maintenanceCalories: 2500,
  date: new Date(),
  caloriesConsumed: 2300,
  macronutrients: {
    carbohydrates: 250,
    protein: 100,
    fats: 80
  },
  micronutrients: {
    vitaminC: 75,
    vitaminD: 15,
    calcium: 1000,
    iron: 18
  },
  sleepTiming: { start: '22:30', end: '06:30' },
  exerciseTiming: { start: '07:00', end: '08:00' },
  exerciseIntensity: 'Moderate',
  nutrientsInExcess: ['Sodium', 'Sugar'],
  nutrientsInDeficit: ['Fiber', 'Potassium']
}

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedMicronutrient, setSelectedMicronutrient] = useState('vitaminC')
  const [bmr, setBmr] = useState(0);
  const { data: session } = useSession();

  const macroData = [
    { name: 'Carbohydrates', grams: nutritionData.macronutrients.carbohydrates },
    { name: 'Protein', grams: nutritionData.macronutrients.protein },
    { name: 'Fats', grams: nutritionData.macronutrients.fats },
  ]

  const handleDateSelect = async (value: Date | undefined) => {
    
    console.log(value);
    const date = value;

    if (!session) {
      console.error("User is not authenticated.");
      return;
    }

    // Destructure year, month, day
    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date?.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    try {
      const response = await fetch(`/api/daily-logs?date=${formattedDate}`);

      if (!response.ok) {
        console.log(response.status)
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      // setLogs(data.logs); // Update state with fetched logs
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch daily logs:", error);
    }


  }

  useEffect(() => {
    
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            Maintenance Calories: {nutritionData.maintenanceCalories}
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
              onSelect={(value) => handleDateSelect(value)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calories Consumed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{nutritionData.caloriesConsumed}</p>
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
            <Select onValueChange={setSelectedMicronutrient} defaultValue={selectedMicronutrient}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select micronutrient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vitaminC">Vitamin C</SelectItem>
                <SelectItem value="vitaminD">Vitamin D</SelectItem>
                <SelectItem value="calcium">Calcium</SelectItem>
                <SelectItem value="iron">Iron</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-4 text-2xl font-bold">
              {nutritionData.micronutrients[selectedMicronutrient as keyof typeof nutritionData.micronutrients]} mcg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep & Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Sleep:</strong> {nutritionData.sleepTiming.start} - {nutritionData.sleepTiming.end}</p>
            <p><strong>Exercise:</strong> {nutritionData.exerciseTiming.start} - {nutritionData.exerciseTiming.end}</p>
            <p><strong>Intensity:</strong> {nutritionData.exerciseIntensity}</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nutrients in Excess</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {nutritionData.nutrientsInExcess.map((nutrient, index) => (
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
              {nutritionData.nutrientsInDeficit.map((nutrient, index) => (
                <li key={index}>{nutrient}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}