"use client"
import { useEffect, useState } from "react";
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
}


// Simulating an API call to fetch badge data
const fetchBadgeData = async () => {
    // Simulated API response (you can replace it with an actual API call)
    return new Promise<{ labels: string[] }>((resolve) => {
        setTimeout(() => {
            resolve({ labels: ["Gluten-Free", "High Protein", "Low Carb", "Omega-3 Rich"] });
        }, 1000); // Simulating network delay
    });
};

export default async function Component() {
    const API_URL = "https://cosylab.iiitd.edu.in/recipe/recipeOftheDay";

    let data: Recipe | null = null;
    try {
        const response = await fetch(API_URL, { cache: "no-store" });
        const result = await response.json();
        data = result.payload;
    } catch (error) {
        console.error("Error fetching the recipe:", error);
        return (
            ""
        );
    }

    // Render the recipe content as before if data exists
    if (!data) return null;

    const {
        Recipe_title,
        img_url,
        Calories,
        "Carbohydrate, by difference (g)": Carbs,
        "Protein (g)": Protein,
        "Total lipid (fat) (g)": Fat,
        "Energy (kcal)": Energy,
        cook_time,
        prep_time,
        servings,
        Region,
        Sub_region,
        Continent,
        url,
    } = data;


    // const [badgeData, setBadgeData] = useState<{ labels: string[] } | null>(null);

    // Fetching badge data on component mount
    // useEffect(() => {
    //     const loadBadgeData = async () => {
    //         const data = await fetchBadgeData(); // Replace with actual API call
    //         setBadgeData(data);
    //     };
    //     loadBadgeData();
    // }, []);

    return (        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl">
                <CardHeader className="relative p-0">
                    <Image
                        src="/placeholder.svg?height=400&width=800"
                        alt="Grilled Salmon with Asparagus"
                        width={800}
                        height={400}
                        className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60 rounded-t-lg" />
                    <CardTitle className="absolute bottom-4 left-4 text-3xl font-bold text-white">
                        Recipe of the Day
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                        Grilled Salmon with Asparagus
                    </h2>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Nutritional Information
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { name: "Calories", value: "400 kcal" },
                                    { name: "Protein", value: "35g" },
                                    { name: "Carbs", value: "10g" },
                                    { name: "Fat", value: "25g" },
                                    { name: "Fiber", value: "4g" },
                                    { name: "Vitamin D", value: "15 mcg" },
                                    { name: "Omega-3", value: "1.5g" },
                                ].map((nutrient) => (
                                    <div key={nutrient.name} className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">{nutrient.name}</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{nutrient.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Ingredients
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                                <li>4 salmon fillets (6 oz each)</li>
                                <li>1 bunch asparagus, trimmed</li>
                                <li>2 tbsp olive oil</li>
                                <li>1 lemon, sliced</li>
                                <li>2 cloves garlic, minced</li>
                                <li>Salt and pepper to taste</li>
                                <li>Fresh dill for garnish</li>
                            </ul>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Instructions
                    </h3>
                    <ScrollArea className="h-48 rounded-md border p-4">
                        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Preheat grill to medium-high heat (about 400°F).</li>
                            <li>Brush salmon and asparagus with olive oil and season with salt, pepper, and minced garlic.</li>
                            <li>Place salmon skin-side down on the grill. Add asparagus to the grill.</li>
                            <li>Grill salmon for 5-6 minutes per side, or until it flakes easily with a fork.</li>
                            <li>Grill asparagus for 3-4 minutes, turning occasionally, until tender-crisp.</li>
                            <li>Remove salmon and asparagus from the grill.</li>
                            <li>Squeeze fresh lemon juice over the salmon and asparagus.</li>
                            <li>Garnish with fresh dill and serve immediately.</li>
                        </ol>
                    </ScrollArea>

                    {/* Display badges if data is available */}
                    {/* <div className="mt-4 flex flex-wrap gap-2">
                        {badgeData ? (
                            badgeData.labels.map((label, index) => (
                                <Badge key={index} variant="secondary">
                                    {label}
                                </Badge>
                            ))
                        ) : (
                            <div className="text-gray-600 dark:text-gray-400">Loading badges...</div>
                        )}
                    </div> */}
                </CardContent>
            </Card>
        </div>
    );
}