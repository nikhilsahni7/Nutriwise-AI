'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Mock data for recipes
const recipes = [
  { id: 1, name: 'Grilled Chicken Salad', description: 'A healthy and delicious salad with grilled chicken', calories: 350, protein: 30, carbs: 15, fat: 12, image: '/placeholder.svg?height=200&width=300', ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Balsamic vinaigrette'], instructions: ['Grill the chicken breast', 'Chop the vegetables', 'Mix all ingredients in a bowl', 'Drizzle with balsamic vinaigrette'] },
  { id: 2, name: 'Vegetarian Stir Fry', description: 'A quick and easy vegetable stir fry', calories: 300, protein: 15, carbs: 40, fat: 10, image: '/placeholder.svg?height=200&width=300', ingredients: ['Mixed vegetables', 'Tofu', 'Soy sauce', 'Sesame oil', 'Rice'], instructions: ['Cut tofu and vegetables', 'Heat oil in a wok', 'Stir fry tofu and vegetables', 'Add soy sauce and serve with rice'] },
  { id: 3, name: 'Salmon with Roasted Vegetables', description: 'Oven-baked salmon with a medley of roasted vegetables', calories: 400, protein: 35, carbs: 20, fat: 18, image: '/placeholder.svg?height=200&width=300', ingredients: ['Salmon fillet', 'Broccoli', 'Carrots', 'Bell peppers', 'Olive oil'], instructions: ['Preheat oven to 400°F', 'Season salmon and vegetables', 'Roast vegetables for 20 minutes', 'Add salmon and roast for 12-15 minutes'] },
  { id: 4, name: 'Quinoa Bowl with Avocado', description: 'A nutritious quinoa bowl topped with fresh avocado', calories: 380, protein: 12, carbs: 50, fat: 16, image: '/placeholder.svg?height=200&width=300', ingredients: ['Quinoa', 'Avocado', 'Black beans', 'Corn', 'Lime juice'], instructions: ['Cook quinoa according to package instructions', 'Prepare black beans and corn', 'Slice avocado', 'Assemble bowl and drizzle with lime juice'] },
]

const moods = ['Happy', 'Energetic', 'Relaxed', 'Stressed', 'Tired']
const seasons = ['Spring', 'Summer', 'Autumn', 'Winter']
const regions = ['Mediterranean', 'Asian', 'Latin American', 'European', 'Middle Eastern']

export default function MealRecommendations() {
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedSeason, setSelectedSeason] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const RecipeCard = ({ recipe }: {recipe: any}) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col justify-between">
        <CardHeader className="p-0">
          <img src={recipe.image} alt={recipe.name} className="w-full h-40 object-cover rounded-t-lg" />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg">{recipe.name}</CardTitle>
          <CardDescription className="text-sm mt-1">{recipe.description}</CardDescription>
          <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
            <div>Calories: {recipe.calories}</div>
            <div>Protein: {recipe.protein}g</div>
            <div>Carbs: {recipe.carbs}g</div>
            <div>Fat: {recipe.fat}g</div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 ">
          <Button className="w-full text-sm" onClick={() => setSelectedRecipe(recipe)}>View Recipe</Button>
        </CardFooter>
      </Card>
    </motion.div>
  )

  const TagSelector = ({ tags, selectedTag, setSelectedTag } : {tags: any, selectedTag: any, setSelectedTag: any}) => (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag : any) => (
        <Badge
          key={tag}
          variant={selectedTag === tag ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setSelectedTag(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  )

  return (
    <div className="container w-full h-full mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Meal Recommendations</h1>
      <Tabs defaultValue="nutrition" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nutrition">Nutrition Goals</TabsTrigger>
          <TabsTrigger value="moods">Moods</TabsTrigger>
          <TabsTrigger value="seasons">Seasons</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
        </TabsList>
        <TabsContent value="nutrition">
          <h2 className="text-2xl font-semibold mb-4">Recommended Recipes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="moods">
          <h2 className="text-2xl font-semibold mb-4">Select Your Mood</h2>
          <TagSelector tags={moods} selectedTag={selectedMood} setSelectedTag={setSelectedMood} />
          {selectedMood && (
            <>
              <h3 className="text-xl font-semibold mb-4">Recipes for {selectedMood} Mood</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recipes.slice(0, 3).map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </TabsContent>
        <TabsContent value="seasons">
          <h2 className="text-2xl font-semibold mb-4">Select a Season</h2>
          <TagSelector tags={seasons} selectedTag={selectedSeason} setSelectedTag={setSelectedSeason} />
          {selectedSeason && (
            <>
              <h3 className="text-xl font-semibold mb-4">{selectedSeason} Recipes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recipes.slice(1, 4).map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </TabsContent>
        <TabsContent value="regions">
          <h2 className="text-2xl font-semibold mb-4">Select a Region</h2>
          <TagSelector tags={regions} selectedTag={selectedRegion} setSelectedTag={setSelectedRegion} />
          {selectedRegion && (
            <>
              <h3 className="text-xl font-semibold mb-4">{selectedRegion} Cuisine</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recipes.slice(2).map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedRecipe?.name}</DialogTitle>
            <DialogDescription>{selectedRecipe?.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <img src={selectedRecipe?.image} alt={selectedRecipe?.name} className="w-full h-48 object-cover rounded-lg" />
            <div>
              <h4 className="font-semibold mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside">
                {selectedRecipe?.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <ol className="list-decimal list-inside">
                {selectedRecipe?.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}