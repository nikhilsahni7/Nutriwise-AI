import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/db";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_API = "https://api.spoonacular.com/recipes";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile and recent meals
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        dailyLogs: {
          take: 7,
          orderBy: { date: "desc" },
          include: { meals: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Analyze nutritional gaps
    const nutritionGaps = analyzeNutritionalGaps(user.dailyLogs);

    const queryParams = new URLSearchParams();
    queryParams.append("apiKey", SPOONACULAR_API_KEY || "");
    queryParams.append("number", "10");
    queryParams.append("diet", user.dietPreference?.toLowerCase() || "");
    queryParams.append("intolerances", user.foodAllergies.join(","));
    queryParams.append("cuisine", mapRegionToCuisine(user.region));
    queryParams.append("minProtein", nutritionGaps.needsProtein ? "25" : "0");
    queryParams.append(
      "maxCalories",
      user.goals === "loseWeight" ? "500" : "800"
    );
    queryParams.append("sort", "healthiness");

    // Fetch recipes from Spoonacular
    const response = await fetch(
      `${SPOONACULAR_API}/complexSearch?${queryParams.toString()}`
    );
    const data = await response.json();

    // Get detailed nutrition for each recipe
    const recipesWithNutrition = await Promise.all(
      data.results.map(async (recipe: any) => {
        const nutritionResponse = await fetch(
          `${SPOONACULAR_API}/${recipe.id}/nutritionWidget.json?apiKey=${SPOONACULAR_API_KEY}`
        );
        const nutritionData = await nutritionResponse.json();
        return { ...recipe, nutrition: nutritionData };
      })
    );

    return NextResponse.json(
      {
        recipes: recipesWithNutrition,
        nutritionGaps,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recipe discovery error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

// Helper functions
function analyzeNutritionalGaps(dailyLogs: any[]) {
  const averages = calculateAverages(dailyLogs);
  return {
    needsProtein: averages.protein < 50,
    needsFiber: averages.fiber < 25,
    needsVitaminC: averages.vitaminC < 65,
    lowCalories: averages.calories < 1500,
    highCalories: averages.calories > 2500,
  };
}

function calculateAverages(dailyLogs: any[]) {
  const totals = dailyLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.totalCalories,
      protein: acc.protein + log.totalProtein,
      fiber: acc.fiber + log.totalFiber,
      vitaminC: acc.vitaminC + log.totalVitaminC,
    }),
    { calories: 0, protein: 0, fiber: 0, vitaminC: 0 }
  );

  return {
    calories: totals.calories / dailyLogs.length,
    protein: totals.protein / dailyLogs.length,
    fiber: totals.fiber / dailyLogs.length,
    vitaminC: totals.vitaminC / dailyLogs.length,
  };
}

function mapRegionToCuisine(region: string | null) {
  const mapping: { [key: string]: string } = {
    south_america: "Latin American",
    north_america: "American",
    indian_subcontinent: "Indian",
    european: "European",
  };
  return region ? mapping[region] : "";
}
