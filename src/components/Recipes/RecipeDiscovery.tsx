"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ChefHat, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Image from "next/image";

interface NutritionGaps {
  needsProtein: boolean;
  needsFiber: boolean;
  needsVitaminC: boolean;
  lowCalories: boolean;
  highCalories: boolean;
}

interface Recipe {
  id: string;
  title: string;
  image: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface SaveRecipePayload {
  recipeId: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export default function SmartRecipeDiscovery() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [nutritionGaps, setNutritionGaps] = useState<NutritionGaps | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [savingRecipes, setSavingRecipes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recipes/discover");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecipes(data.recipes || []);
      setNutritionGaps(data.nutritionGaps);
    } catch (error) {
      console.error("Recipe fetch error:", error);
      toast.error("Failed to fetch recipe recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (savingRecipes.has(recipe.id)) return;

    try {
      // Add to saving state immediately
      setSavingRecipes((prev) => new Set(prev).add(recipe.id));

      // Prepare the payload
      const payload: SaveRecipePayload = {
        recipeId: recipe.id,
        name: recipe.title,
        image: recipe.image || "",
        calories: recipe.nutrition.calories,
        protein: recipe.nutrition.protein,
        carbs: recipe.nutrition.carbs || 0,
        fats: recipe.nutrition.fat || 0,
      };

      console.log("Sending payload:", payload); // Debug log

      const response = await fetch("/api/recipes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // Important for auth
      });

      console.log("Response status:", response.status); // Debug log

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save recipe");
      }

      toast.success("Recipe saved successfully!");
    } catch (error) {
      console.error("Save recipe error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save recipe"
      );
    } finally {
      // Remove from saving state
      setSavingRecipes((prev) => {
        const updated = new Set(prev);
        updated.delete(recipe.id);
        return updated;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Smart Recipe Recommendations
          </CardTitle>
          <CardDescription>
            Based on your nutrition needs and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {nutritionGaps && (
            <div className="mb-4 flex flex-wrap gap-2">
              {nutritionGaps.needsProtein && (
                <Badge variant="secondary">Needs more protein</Badge>
              )}
              {nutritionGaps.needsFiber && (
                <Badge variant="secondary">Needs more fiber</Badge>
              )}
              {nutritionGaps.needsVitaminC && (
                <Badge variant="secondary">Needs more vitamin C</Badge>
              )}
            </div>
          )}

          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={recipe.image || "/placeholder-recipe.jpg"}
                      alt={recipe.title}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {recipe.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">
                        {recipe.nutrition.calories} cal
                      </Badge>
                      <Badge variant="outline">
                        {recipe.nutrition.protein}g protein
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveRecipe(recipe)}
                        disabled={savingRecipes.has(recipe.id)}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        {savingRecipes.has(recipe.id) ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          window.open(
                            `https://spoonacular.com/recipes/${recipe.id}`,
                            "_blank"
                          );
                        }}
                      >
                        <ChefHat className="h-4 w-4 mr-2" />
                        View Recipe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
