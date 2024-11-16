// app/api/recommendations/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/db";
import { auth } from "../../../../auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function fetchRecipes(searchText: string) {
  const response = await fetch(
    `https://cosylab.iiitd.edu.in/recipe-search/recipe?pageSize=10&searchText=${searchText}`
  );
  const data = await response.json();
  return data.payload.data;
}

async function generateMealSuggestions(userProfile: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Generate meal suggestions for a user with the following profile:
    - Goals: ${userProfile.goals}
    - Diet Preference: ${userProfile.dietPreference}
    - Food Allergies: ${userProfile.foodAllergies.join(", ")}
    - Foods to Avoid: ${userProfile.foodsToAvoid.join(", ")}
    - Physical Activity Level: ${userProfile.physicalActivityLevel}
    - Region: ${userProfile.region}
    
    Suggest 5 specific dishes that would be suitable for this user, considering their dietary restrictions and nutritional needs.
    Return the response as a JSON array of dish names only.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const suggestions = JSON.parse(response.text());

  return suggestions;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        goals: true,
        dietPreference: true,
        foodAllergies: true,
        foodsToAvoid: true,
        physicalActivityLevel: true,
        region: true,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Get AI-generated meal suggestions based on user profile
    const suggestions = await generateMealSuggestions(user);

    // Fetch detailed recipes for each suggestion
    const allRecipes = await Promise.all(
      suggestions.map((dish: string) => fetchRecipes(dish))
    );

    // Flatten and filter recipes
    const recipes = allRecipes
      .flat()
      .filter((recipe: any) => {
        // Filter out recipes that contain allergens or foods to avoid
        const recipeText = JSON.stringify(recipe).toLowerCase();
        return (
          !user.foodAllergies.some((allergen) =>
            recipeText.includes(allergen.toLowerCase())
          ) &&
          !user.foodsToAvoid.some((food) =>
            recipeText.includes(food.toLowerCase())
          )
        );
      })
      .slice(0, 10); // Limit to top 10 recipes

    return new Response(JSON.stringify({ recipes }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in recommendations:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
