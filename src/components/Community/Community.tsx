"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDebounce } from "@/hooks/use-debounce";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Recipe {
  id: string;
  name: string;
  userId: string;
  userEmail: string;
  description: string;
  ingredients: string[];
  steps: string;
  tags: string[];
  createdAt: Date;
}

export default function CommunityRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState("");
  const [tags, setTags] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false); // Added isSharing state
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchRecipes(debouncedSearch);
  }, [debouncedSearch]);

  const fetchRecipes = async (query: string) => {
    try {
      const res = await fetch(`/api/community?q=${query}`);
      if (!res.ok) throw new Error("Failed to fetch recipes");
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recipes",
        variant: "destructive",
      });
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleGenerateRecipe = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipeName,
          description,
          ingredients: ingredients.filter((i) => i.trim()),
          tags: tags.split(",").map((tag) => tag.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to generate recipe");

      const recipe = await response.json();
      setSteps(recipe.steps);
      toast({
        title: "Success",
        description: "Recipe generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recipe",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareRecipe = async () => {
    setIsSharing(true); // Set isSharing to true
    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipeName,
          description,
          ingredients: ingredients.filter((i) => i.trim()),
          steps,
          tags: tags.split(",").map((tag) => tag.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to share recipe");

      toast({
        title: "Success",
        description: "Recipe shared successfully!",
      });

      // Reset form
      setIngredients([""]);
      setSteps("");
      setTags("");
      setRecipeName("");
      setDescription("");

      // Refresh recipes
      fetchRecipes(searchQuery);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share recipe",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false); // Set isSharing to false
    }
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{recipe.name}</CardTitle>
          <CardDescription>by {recipe.userEmail}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 mb-2">
            {recipe.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{recipe.description}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setSelectedRecipe(recipe)}>View Recipe</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Recipes</TabsTrigger>
          <TabsTrigger value="create">Create Recipe</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Recipe</CardTitle>
              <CardDescription>
                Share your culinary creations with the community!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipe-name" className="text-sm font-medium">
                  Recipe Name
                </label>
                <Input
                  id="recipe-name"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="Enter recipe name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="recipe-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <Textarea
                  id="recipe-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your recipe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ingredients</label>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) =>
                        handleIngredientChange(index, e.target.value)
                      }
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    {index === ingredients.length - 1 ? (
                      <Button onClick={handleAddIngredient} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRemoveIngredient(index)}
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label htmlFor="recipe-steps" className="text-sm font-medium">
                  Recipe Steps
                </label>
                <div className="flex gap-2">
                  <Textarea
                    id="recipe-steps"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    placeholder="Enter recipe steps or generate them using AI"
                    rows={5}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="recipe-tags" className="text-sm font-medium">
                  Tags (comma-separated)
                </label>
                <Input
                  id="recipe-tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., Vegetarian, Spicy, Quick"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleShareRecipe} disabled={isSharing}>
                {isSharing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  "Share Recipe"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!selectedRecipe}
        onOpenChange={() => setSelectedRecipe(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedRecipe?.name}</DialogTitle>
            <DialogDescription>
              by {selectedRecipe?.userEmail}
            </DialogDescription>
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
              <h4 className="font-semibold mb-2">
                Steps: {selectedRecipe?.description}
              </h4>
              <p className="whitespace-pre-line">{selectedRecipe?.steps}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedRecipe?.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
