// app/api/meals/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/db";
import { auth } from "../../../../../auth";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gemini config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

async function uploadToCloudinary(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64String, {
      folder: "meal-tracker",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Image upload failed");
  }
}

// In route.ts, update analyzeWithGemini:
async function analyzeWithGemini(imageUrl: string) {
  try {
    const response = await model.generateContent([
      {
        text: `Analyze this food image and provide ONLY a JSON object with the following structure:
        {
          "name": "dish name",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number,
          "fiber": number,
          "iron": number,
          "calcium": number,
          "potassium": number,
          "vitaminA": number,
          "vitaminC": number
        }`,
      },
      imageUrl,
    ]);

    let result = await response.response.text();

    // Clean up the response
    result = result.replace(/```json\s*|\s*```/g, "").trim();

    try {
      return JSON.parse(result);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Fallback default values
      return {
        name: "Unknown Food",
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        iron: 0,
        calcium: 0,
        potassium: 0,
        vitaminA: 0,
        vitaminC: 0,
      };
    }
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error("Food analysis failed");
  }
}
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate form data
    const formData = await request.formData();
    const imageFile = formData.get("imageFile") as File;
    const mealType = (formData.get("mealType") as string)?.toLowerCase();
    const portions = Number(formData.get("portions")) || 1;

    if (
      !imageFile ||
      !mealType ||
      !["breakfast", "lunch", "dinner", "snack"].includes(mealType)
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    // 3. Process image and analyze
    const imageUrl = await uploadToCloudinary(imageFile);
    const nutritionData = await analyzeWithGemini(imageUrl);

    // 4. Get or create daily log
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    });

    if (!dailyLog) {
      dailyLog = await prisma.dailyLog.create({
        data: {
          userId: session.user.id,
          date: today,
        },
      });
    }

    // 5. Create meal
    const meal = await prisma.meal.create({
      data: {
        userId: session.user.id,
        dailyLogId: dailyLog.id,
        mealType: mealType as MealType,
        imageUrl,
        name: nutritionData.name || "",
        portions,
        calories: (nutritionData.calories || 0) * portions,
        protein: (nutritionData.protein || 0) * portions,
        carbs: (nutritionData.carbs || 0) * portions,
        fats: (nutritionData.fats || 0) * portions,
        fiber: (nutritionData.fiber || 0) * portions,
        iron: (nutritionData.iron || 0) * portions,
        calcium: (nutritionData.calcium || 0) * portions,
        potassium: (nutritionData.potassium || 0) * portions,
        vitaminA: (nutritionData.vitaminA || 0) * portions,
        vitaminC: (nutritionData.vitaminC || 0) * portions,
      },
    });

    // 6. Update daily totals
    await prisma.dailyLog.update({
      where: { id: dailyLog.id },
      data: {
        totalCalories: { increment: meal.calories || 0 },
        totalProtein: { increment: meal.protein || 0 },
        totalCarbs: { increment: meal.carbs || 0 },
        totalFats: { increment: meal.fats || 0 },
        totalFiber: { increment: meal.fiber || 0 },
        totalIron: { increment: meal.iron || 0 },
        totalCalcium: { increment: meal.calcium || 0 },
        totalPotassium: { increment: meal.potassium || 0 },
        totalVitaminA: { increment: meal.vitaminA || 0 },
        totalVitaminC: { increment: meal.vitaminC || 0 },
      },
    });

    return NextResponse.json({ success: true, meal });
  } catch (error) {
    console.error("Meal creation failed:", error);
    return NextResponse.json(
      { error: "Failed to process meal" },
      { status: 500 }
    );
  }
}
