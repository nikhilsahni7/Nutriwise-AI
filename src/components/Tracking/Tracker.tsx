'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Component() {
  const [manualForms, setManualForms] = useState([{ calories: '', fats: '', carbs: '', protein: '' }])
  const [selectedDish, setSelectedDish] = useState('')
  const [portionSize, setPortionSize] = useState('')
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [confirmedDishName, setConfirmedDishName] = useState('')
  const [imagePortionSize, setImagePortionSize] = useState('')
  const [exerciseStartTime, setExerciseStartTime] = useState('')
  const [exerciseEndTime, setExerciseEndTime] = useState('')
  const [sleepStartTime, setSleepStartTime] = useState('')
  const [sleepEndTime, setSleepEndTime] = useState('')
  const [exerciseIntensity, setExerciseIntensity] = useState('')
  const [dishes, setDishes] = useState<string[]>([])

  const handleManualInputChange = (index: number, field: string, value: string) => {
    const newForms = [...manualForms]
    newForms[index] = { ...newForms[index], [field]: value }
    setManualForms(newForms)
  }

  const addManualForm = () => {
    setManualForms([...manualForms, { calories: '', fats: '', carbs: '', protein: '' }])
  }

  const handleDishSearch = (query: string) => {
    // Simulating a fetch operation
    setTimeout(() => {
      setDishes([`${query} Salad`, `${query} Soup`, `${query} Steak`])
    }, 300)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Meal Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">Update Manually</TabsTrigger>
            <TabsTrigger value="dishes">Update using Dishes</TabsTrigger>
            <TabsTrigger value="image">Update using Image</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            {manualForms.map((form, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor={`calories-${index}`}>Calories consumed</Label>
                  <Input
                    id={`calories-${index}`}
                    value={form.calories}
                    onChange={(e) => handleManualInputChange(index, 'calories', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`fats-${index}`}>Fats consumed</Label>
                  <Input
                    id={`fats-${index}`}
                    value={form.fats}
                    onChange={(e) => handleManualInputChange(index, 'fats', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`carbs-${index}`}>Carbs Consumed</Label>
                  <Input
                    id={`carbs-${index}`}
                    value={form.carbs}
                    onChange={(e) => handleManualInputChange(index, 'carbs', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`protein-${index}`}>Protein consumed</Label>
                  <Input
                    id={`protein-${index}`}
                    value={form.protein}
                    onChange={(e) => handleManualInputChange(index, 'protein', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button onClick={addManualForm} className="mt-4">Add Another Entry</Button>
          </TabsContent>
          <TabsContent value="dishes">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dish-search">Select dish</Label>
                <Input
                  id="dish-search"
                  placeholder="Search for a dish"
                  onChange={(e) => handleDishSearch(e.target.value)}
                />
                {dishes.length > 0 && (
                  <Select onValueChange={setSelectedDish}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a dish" />
                    </SelectTrigger>
                    <SelectContent>
                      {dishes.map((dish, index) => (
                        <SelectItem key={index} value={dish}>{dish}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="portion-size">Select portion size</Label>
                <Input
                  id="portion-size"
                  value={portionSize}
                  onChange={(e) => setPortionSize(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="image">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload image</Label>
                <Input id="image-upload" type="file" onChange={handleImageUpload} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-dish">Confirm dish name</Label>
                <Input
                  id="confirm-dish"
                  value={confirmedDishName}
                  onChange={(e) => setConfirmedDishName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-portion">Select Portion</Label>
                <Input
                  id="image-portion"
                  value={imagePortionSize}
                  onChange={(e) => setImagePortionSize(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-start-time">Exercise Start Time</Label>
              <Input
                id="exercise-start-time"
                type="time"
                value={exerciseStartTime}
                onChange={(e) => setExerciseStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exercise-end-time">Exercise End Time</Label>
              <Input
                id="exercise-end-time"
                type="time"
                value={exerciseEndTime}
                onChange={(e) => setExerciseEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sleep-start-time">Sleep Start Time</Label>
              <Input
                id="sleep-start-time"
                type="time"
                value={sleepStartTime}
                onChange={(e) => setSleepStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleep-end-time">Sleep End Time</Label>
              <Input
                id="sleep-end-time"
                type="time"
                value={sleepEndTime}
                onChange={(e) => setSleepEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exercise-intensity">Exercise Intensity</Label>
            <Select value={exerciseIntensity} onValueChange={setExerciseIntensity}>
              <SelectTrigger id="exercise-intensity">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="intense">Intense</SelectItem>
                <SelectItem value="very-intense">Very Intense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}