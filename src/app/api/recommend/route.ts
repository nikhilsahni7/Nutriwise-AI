import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { userPreferences } = await req.json();

    // First fetch some initial recipes to ensure we have data to work with
    const response = await fetch(
      `https://cosylab.iiitd.edu.in/recipe-search/recipe?pageSize=30&searchText=indian`
    );
    const initialData = await response.json();

    // Use actual recipes from the API to generate recommendations
    const availableRecipes = initialData.payload.data.map(
      (recipe: any) => recipe.Recipe_title
    );

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Given the following user preferences and this list of available recipes: ${availableRecipes.join(
      ", "
    )}, 
    return only an array of indices for which the recipe matches the following user preferences and goals:
    
    User Preferences:
    - Goals: ${userPreferences.goals}
    - Diet Preferences: ${userPreferences.dietPreference}
    - Allergies: ${userPreferences.foodAllergies.join(", ")}
    - Foods to Avoid: ${userPreferences.foodsToAvoid.join(", ")}
    - Physical Activity Level: ${userPreferences.physicalActivityLevel}
    - Region: ${userPreferences.region}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log(text);

    // Return both the AI suggestions and the initial recipe data
    return Response.json({
      suggestions: text.split("\n").filter((t) => t.trim().length > 0),
      recipes: initialData.payload.data,
    });
  } catch (error) {
    console.error("Error in recommendation API:", error);
    return Response.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

// src/app/api/recipes/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchText = searchParams.get("searchText") || "indian";

  try {
    const response = await fetch(
      `https://cosylab.iiitd.edu.in/recipe-search/recipe?pageSize=20&searchText=${searchText}`
    );
    const data = await response.json();

    if (!data.success || !data.payload?.data) {
      throw new Error("Invalid API response format");
    }

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch recipes",
        payload: { data: [], totalCount: 0 },
      },
      { status: 200 } // Return 200 with empty data instead of 500
    );
  }
}
