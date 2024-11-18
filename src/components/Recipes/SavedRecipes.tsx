"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChefHat, Bookmark } from "lucide-react";
import { toast } from "sonner";
import type { SavedRecipe } from "@/types/schema";

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      setError(null);
      const response = await fetch("/api/recipes/saved");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.recipes) {
        throw new Error("Invalid data format received");
      }
      setRecipes(data.recipes);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error("Failed to fetch saved recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleRateRecipe = async (recipeId: string, rating: number) => {
    try {
      const response = await fetch("/api/recipes/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, rating }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      toast.success("Recipe rated successfully!");
      fetchSavedRecipes();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to rate recipe: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-primary" />
          Saved Recipes
        </CardTitle>
        <CardDescription>Your collection of saved recipes</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.length === 0 ? (
              <div className="text-center text-gray-500 col-span-2">
                No saved recipes yet
              </div>
            ) : (
              recipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden">
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{recipe.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{recipe.calories} cal</Badge>
                      <Badge variant="outline">{recipe.protein}g protein</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRateRecipe(recipe.id, star)}
                          className={
                            recipe.rating === star ? "text-yellow-500" : ""
                          }
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        window.open(
                          `https://spoonacular.com/recipes/${recipe.recipeId}`,
                          "_blank"
                        )
                      }
                    >
                      <ChefHat className="h-4 w-4 mr-2" />
                      View Recipe
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
