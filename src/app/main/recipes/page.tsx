import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SmartRecipeDiscovery from "@/components/Recipes/RecipeDiscovery";
import SavedRecipes from "@/components/Recipes/SavedRecipes";
export const dynamic = "force-dynamic";

export default function RecipesPage() {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="discover" className="w-full">
        <TabsList>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="saved">Saved Recipes</TabsTrigger>
        </TabsList>
        <TabsContent value="discover">
          <SmartRecipeDiscovery />
        </TabsContent>
        <TabsContent value="saved">
          <SavedRecipes />
        </TabsContent>
      </Tabs>
    </div>
  );
}
