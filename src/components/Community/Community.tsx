'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, Trash2 } from 'lucide-react'

// Mock data for community recipes
const communityRecipes = [
  { id: 1, name: 'Spicy Vegetable Curry', author: 'Alice', ingredients: ['Vegetables', 'Coconut milk', 'Curry paste'], steps: 'Cook vegetables, add coconut milk and curry paste, simmer for 20 minutes.', tags: ['Vegetarian', 'Spicy', 'Indian'] },
  { id: 2, name: 'Grilled Salmon with Lemon', author: 'Bob', ingredients: ['Salmon fillet', 'Lemon', 'Olive oil', 'Dill'], steps: 'Marinate salmon in lemon and oil, grill for 10 minutes, garnish with dill.', tags: ['Seafood', 'Healthy', 'Quick'] },
  { id: 3, name: 'Chocolate Chip Cookies', author: 'Charlie', ingredients: ['Flour', 'Butter', 'Sugar', 'Chocolate chips'], steps: 'Mix ingredients, form into cookies, bake at 350°F for 12 minutes.', tags: ['Dessert', 'Baking', 'Kid-friendly'] },
]

export default function CommunityRecipes() {
  const [ingredients, setIngredients] = useState([''])
  const [steps, setSteps] = useState('')
  const [tags, setTags] = useState('')
  const [recipeName, setRecipeName] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index)
    setIngredients(newIngredients)
  }

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const handleGenerateRecipe = () => {
    setIsGenerating(true)
    // Simulating AI generation with a timeout
    setTimeout(() => {
      setSteps(`1. Prepare all ingredients: ${ingredients.join(', ')}\n2. Mix ingredients in a bowl\n3. Cook for 20 minutes\n4. Serve and enjoy!`)
      setIsGenerating(false)
    }, 2000)
  }

  const handleShareRecipe = () => {
    const newRecipe = {
      id: communityRecipes.length + 1,
      name: recipeName,
      author: 'Current User',
      ingredients,
      steps,
      tags: tags.split(',').map(tag => tag.trim()),
    }
    communityRecipes.push(newRecipe)
    // Reset form
    setIngredients([''])
    setSteps('')
    setTags('')
    setRecipeName('')
    alert('Recipe shared successfully!')
  }

  const RecipeCard = ({ recipe }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{recipe.name}</CardTitle>
          <CardDescription>by {recipe.author}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 mb-2">
            {recipe.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Ingredients: {recipe.ingredients.join(', ')}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setSelectedRecipe(recipe)}>View Recipe</Button>
        </CardFooter>
      </Card>
    </motion.div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Community Recipes</h1>
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Recipes</TabsTrigger>
          <TabsTrigger value="create">Create Recipe</TabsTrigger>
        </TabsList>
        <TabsContent value="browse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Recipe</CardTitle>
              <CardDescription>Share your culinary creations with the community!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipe-name" className="text-sm font-medium">Recipe Name</label>
                <Input
                  id="recipe-name"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="Enter recipe name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ingredients</label>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    {index === ingredients.length - 1 ? (
                      <Button onClick={handleAddIngredient} size="icon"><Plus className="h-4 w-4" /></Button>
                    ) : (
                      <Button onClick={() => handleRemoveIngredient(index)} variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <label htmlFor="recipe-steps" className="text-sm font-medium">Recipe Steps</label>
                <div className="flex gap-2">
                  <Textarea
                    id="recipe-steps"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    placeholder="Enter recipe steps or generate them using AI"
                    rows={5}
                  />
                  <Button onClick={handleGenerateRecipe} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="recipe-tags" className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  id="recipe-tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., Vegetarian, Spicy, Quick"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleShareRecipe}>Share Recipe</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedRecipe?.name}</DialogTitle>
            <DialogDescription>by {selectedRecipe?.author}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <h4 className="font-semibold mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside">
                {selectedRecipe?.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Steps:</h4>
              <p className="whitespace-pre-line">{selectedRecipe?.steps}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedRecipe?.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}