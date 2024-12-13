"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"

interface Recipe {
  Recipe_id: string;
  Recipe_title: string;
  Region: string;
  Sub_region: string;
  Calories: number;
  "Protein (g)": number;
  "Carbohydrate, by difference (g)": number;
  "Total lipid (fat) (g)": number;
  img_url: string | null;
  url: string;
  total_time: number;
}

interface RecipeCardProps {
  recipe: Recipe;
}

interface TagSelectorProps {
  tags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  onSelect?: (tag: string) => void;
}

interface ApiResponse {
  success?: string;
  payload?: {
    data?: any[];
  };
}

type MoodType = "Happy" | "Energetic" | "Relaxed" | "Stressed" | "Tired";
type SeasonType = "Spring" | "Summer" | "Autumn" | "Winter";
type RegionType =
  | "Indian"
  | "Australian"
  | "Chinese"
  | "Mexican"
  | "Italian";

const MealRecommendations: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("")

  const moods: MoodType[] = [
    "Happy",
    "Energetic",
    "Relaxed",
    "Stressed",
    "Tired",
  ];
  const seasons: SeasonType[] = ["Spring", "Summer", "Autumn", "Winter"];
  const regions: RegionType[] = [
    "Indian",
    "Australian",
    "Chinese",
    "Mexican",
    "Italian",
  ];

  const seasonalIngredients: Record<SeasonType, string[]> = {
    Spring: ["Asparagus", "Peas", "Strawberries", "Spinach"],
    Summer: ["Tomatoes", "Corn", "Watermelon", "Zucchini"],
    Autumn: ["Pumpkin", "Sweet Potato", "Apple", "Brussels Sprouts"],
    Winter: ["Citrus", "Root Vegetables", "Kale", "Winter Squash"],
  };

  const moodFoods: Record<MoodType, string[]> = {
    Happy: ["Chocolate", "Berries", "Fish", "Nuts"],
    Energetic: ["Quinoa", "Green Tea", "Banana", "Oats"],
    Relaxed: ["Turkey", "Chamomile", "Warm Milk", "Cherries"],
    Stressed: ["Dark Chocolate", "Avocado", "Green Leafy Vegetables", "Yogurt"],
    Tired: ["Coffee", "Green Tea", "Chia Seeds", "Dates"],
  };

  const fetchRecipes = async (searchText: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/receipes?searchText=${encodeURIComponent(searchText)}`, 
        {
          method: 'GET',
          cache: 'no-store' 
        }
      );
  
      // Log the raw response for debugging
      const responseText = await response.text();
  
      const data: ApiResponse = responseText ? JSON.parse(responseText) : {};
  
      if (data.success === "true" && data.payload?.data) {
        setRecipes(data.payload.data);
        console.log(data.payload.data);
      } else {
        console.warn('Unexpected response structure:', data);
        setRecipes([]); 
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]); // Ensure recipes is reset on error
    } finally {
      setLoading(false);
    }
  };
  
  const handleRecipeSearch = () => {
    console.log(searchQuery)
    if(searchQuery.length === 0)
      return;

    fetchRecipes(searchQuery)
  }

  useEffect(() => {
      fetchRecipes("Indian");
  }, []);

  const filterRecipesBySeason = (season: string): Recipe[] => {
    if (!season) return recipes;
    const seasonalItems = seasonalIngredients[season as SeasonType] || [];
    return recipes.filter((recipe) =>
      seasonalItems.some((ingredient) =>
        recipe.Recipe_title.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
  };

  const filterRecipesByMood = (mood: string): Recipe[] => {
    if (!mood) return recipes;
    const moodItems = moodFoods[mood as MoodType] || [];
    return recipes.filter((recipe) =>
      moodItems.some((ingredient) =>
        recipe.Recipe_title.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
  };

  const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="p-0">
        <img
          src={recipe.img_url || "/api/placeholder/400/300"}
          alt={recipe.Recipe_title.replace(/<[^>]+>/g, "")}
          className="w-full h-40 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">
          {recipe.Recipe_title.replace(/<[^>]+>/g, "")}
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          {recipe.Region} • {recipe.Sub_region}
        </CardDescription>
        <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
          <div>Calories: {recipe.Calories}</div>
          <div>Protein: {recipe["Protein (g)"]}g</div>
          <div>Carbs: {recipe["Carbohydrate, by difference (g)"]}g</div>
          <div>Fat: {recipe["Total lipid (fat) (g)"]}g</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full text-sm"
          onClick={() => setSelectedRecipe(recipe)}
        >
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );

  const TagSelector: React.FC<TagSelectorProps> = ({
    tags,
    selectedTag,
    setSelectedTag,
    onSelect,
  }) => (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTag === tag ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => {
            setSelectedTag(tag);
            if (onSelect) onSelect(tag);
          }}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );



  return (
    <div className="container w-full h-full mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Recipe Recommendations
      </h1>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full h-16 rounded-3xl">
          <TabsList className="grid w-full grid-cols-4 h-16 rounded-3xl">
            <TabsTrigger value="all" className="h-12 rounded-3xl">All Recipes</TabsTrigger>
            <TabsTrigger value="moods" className="h-12 rounded-3xl">Moods</TabsTrigger>
            <TabsTrigger value="seasons" className="h-12 rounded-3xl">Seasons</TabsTrigger>
            <TabsTrigger value="regions" className="h-12 rounded-3xl">Regions</TabsTrigger>
          </TabsList>

          <TabsContent value="all">

            <div className="w-full max-w-[500px] flex gap-2 mb-4 mt-4">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button 
                type="submit" 
                size="icon"
                onClick={handleRecipeSearch}
              >
                <Search className="h-4 w-4" />
                <span 
                  className="sr-only"
                >
                  Search
                </span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.Recipe_id} recipe={recipe} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="moods">
            <h2 className="text-2xl font-semibold mb-4">Select Your Mood</h2>
            <TagSelector
              tags={moods}
              selectedTag={selectedMood}
              setSelectedTag={setSelectedMood}
            />
            {selectedMood && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filterRecipesByMood(selectedMood).map((recipe) => (
                  <RecipeCard key={recipe.Recipe_id} recipe={recipe} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="seasons">
            <h2 className="text-2xl font-semibold mb-4">Select Season</h2>
            <TagSelector
              tags={seasons}
              selectedTag={selectedSeason}
              setSelectedTag={setSelectedSeason}
            />
            {selectedSeason && (
              <>
                <div className="mt-4 mb-6">
                  <h4 className="text-lg font-medium mb-2">
                    Featured Seasonal Ingredients:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {seasonalIngredients[selectedSeason as SeasonType].map(
                      (ingredient) => (
                        <Badge key={ingredient} variant="outline">
                          {ingredient}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filterRecipesBySeason(selectedSeason).map((recipe) => (
                    <RecipeCard key={recipe.Recipe_id} recipe={recipe} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="regions">
            <h2 className="text-2xl font-semibold mb-4">Select Region</h2>
            <TagSelector
              tags={regions}
              selectedTag={selectedRegion}
              setSelectedTag={setSelectedRegion}
              onSelect={(region) => fetchRecipes(region)}
            />
            {selectedRegion && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.Recipe_id} recipe={recipe} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog
        open={!!selectedRecipe}
        onOpenChange={() => setSelectedRecipe(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedRecipe?.Recipe_title.replace(/<[^>]+>/g, "")}
            </DialogTitle>
            <DialogDescription>
              {selectedRecipe?.Region} • {selectedRecipe?.Sub_region}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <img
              src={selectedRecipe?.img_url || "/api/placeholder/400/300"}
              alt={selectedRecipe?.Recipe_title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-semibold mb-2">Nutritional Information:</h4>
              <ul className="list-disc list-inside">
                <li>Calories: {selectedRecipe?.Calories}</li>
                <li>Protein: {selectedRecipe?.["Protein (g)"]}g</li>
                <li>
                  Carbohydrates:{" "}
                  {selectedRecipe?.["Carbohydrate, by difference (g)"]}g
                </li>
                <li>Fat: {selectedRecipe?.["Total lipid (fat) (g)"]}g</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Cooking Time:</h4>
              <p>Total Time: {selectedRecipe?.total_time} minutes</p>
            </div>
            <Button
              className="mt-4"
              onClick={() =>
                selectedRecipe?.url && window.open(selectedRecipe.url, "_blank")
              }
            >
              View Full Recipe
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MealRecommendations;
