import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Recipe {
  _id: string;
  Recipe_id: string;
  Recipe_title: string;
  img_url: string;
  Calories: string;
  "Carbohydrate, by difference (g)": string;
  "Protein (g)": string;
  "Total lipid (fat) (g)": string;
  "Energy (kcal)": string;
  cook_time: string;
  prep_time: string;
  servings: string;
  Region: string;
  Sub_region: string;
  Continent: string;
  url: string;
  Processes: string;
  vegan: string;
  pescetarian: string;
  ovo_vegetarian: string;
  lacto_vegetarian: string;
}

export default async function RecipeOfTheDay() {
  const API_URL = "https://cosylab.iiitd.edu.in/recipe/recipeOftheDay";

  let data: Recipe | null = null;
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'x-api-key': 'cosylab'
      },
      cache: 'no-store' 
    });
    const result = await response.json();
    console.log(result);
    data = result.payload;
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          Recipe DB API is down. Please try again later 😢
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const dietaryBadges = [];
  if (data.vegan === "1.0") dietaryBadges.push("Vegan");
  if (data.pescetarian === "1.0") dietaryBadges.push("Pescatarian");
  if (data.ovo_vegetarian === "1.0") dietaryBadges.push("Ovo-Vegetarian");
  if (data.lacto_vegetarian === "1.0") dietaryBadges.push("Lacto-Vegetarian");

  const processes = data.Processes?.split("||") || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader className="relative p-0">
          <Image
            src={data.img_url || "/placeholder.svg"}
            alt={data.Recipe_title}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60 rounded-t-lg" />
          <CardTitle className="absolute bottom-4 left-4 text-3xl font-bold text-white">
            {data.Recipe_title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{data.Region}</Badge>
            <Badge variant="secondary">{data.Sub_region}</Badge>
            {dietaryBadges.map((badge) => (
              <Badge key={badge} variant="outline">
                {badge}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Nutritional Information
              </h3>
              <div className="space-y-2">
                {[
                  {
                    name: "Calories",
                    value: `${Math.round(parseFloat(data.Calories))} kcal`,
                  },
                  {
                    name: "Protein",
                    value: `${Math.round(parseFloat(data["Protein (g)"]))}g`,
                  },
                  {
                    name: "Carbs",
                    value: `${Math.round(
                      parseFloat(data["Carbohydrate, by difference (g)"])
                    )}g`,
                  },
                  {
                    name: "Fat",
                    value: `${Math.round(
                      parseFloat(data["Total lipid (fat) (g)"])
                    )}g`,
                  },
                ].map((nutrient) => (
                  <div key={nutrient.name} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {nutrient.name}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {nutrient.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Cooking Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Prep Time
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {data.prep_time || "N/A"} mins
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Cook Time
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {data.cook_time || "N/A"} mins
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Servings
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {data.servings}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Cooking Process
          </h3>
          <ScrollArea className="h-48 rounded-md border p-4">
            <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2">
              {processes.map((process, index) => (
                <li key={index} className="capitalize">
                  {process.trim()}
                </li>
              ))}
            </ol>
          </ScrollArea>

          <div className="mt-4">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Full Recipe →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
