// // src/app/api/meals/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import { auth } from "../../../../auth";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { calculateScaledNutrients, calculateTotalNutrients } from "@/lib/utils";
// import { z } from "zod";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });

// const mealSchema = z.object({
//   dailyLogId: z.string(),
//   mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
//   inputMethod: z.enum(["DISH", "IMAGE"]),
//   portions: z.number().optional(),
//   imageData: z.string().optional(),
//   dishId: z.string().optional(),
// });

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// export async function POST(req: Request) {
//   try {
//     const session = await auth();
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const validated = mealSchema.parse(body);

//     const dailyLog = await prisma.dailyLog.findUnique({
//       where: { id: validated.dailyLogId },
//     });

//     if (!dailyLog) {
//       return NextResponse.json(
//         { error: "Daily log not found" },
//         { status: 404 }
//       );
//     }

//     let meal;
//     if (validated.inputMethod === "DISH") {
//       meal = await handleDishInput(
//         session.user.id!,
//         validated.dailyLogId,
//         validated.mealType,
//         validated.dishId!,
//         validated.portions || 1
//       );
//     } else {
//       meal = await handleImageInput(
//         session.user.id!,
//         validated.dailyLogId,
//         validated.mealType,
//         validated.imageData!
//       );
//     }

//     await updateDailyLogTotals(validated.dailyLogId);
//     return NextResponse.json(meal);
//   } catch (error) {
//     console.error(error);
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: error.errors }, { status: 400 });
//     }
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// async function handleDishInput(
//   userId: string,
//   dailyLogId: string,
//   mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK",
//   dishId: string,
//   portions: number
// ) {
//   const dish = await prisma.dish.findUnique({
//     where: { id: dishId },
//     include: { nutrients: true },
//   });

//   if (!dish) {
//     throw new Error("Dish not found");
//   }

//   const scaledNutrients = calculateScaledNutrients(dish.nutrients, portions);
//   const nutrients = await prisma.nutrients.create({
//     data: scaledNutrients,
//   });

//   return prisma.meal.create({
//     data: {
//       userId,
//       dailyLogId,
//       mealType,
//       inputMethod: "DISH",
//       dishId,
//       portions,
//       nutrientId: nutrients.id,
//       name: dish.name,
//     },
//     include: {
//       nutrients: true,
//       dish: true,
//     },
//   });
// }

// async function handleImageInput(
//   userId: string,
//   dailyLogId: string,
//   mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK",
//   imageData: string
// ) {
//   const imageUrl = await uploadImageToCloudinary(imageData);
//   const nutrients = await analyzeImageWithGemini(imageUrl);

//   return prisma.meal.create({
//     data: {
//       userId,
//       dailyLogId,
//       mealType,
//       inputMethod: "IMAGE",
//       imageUrl,
//       nutrientId: nutrients.id,
//     },
//     include: {
//       nutrients: true,
//     },
//   });
// }

// async function updateDailyLogTotals(dailyLogId: string) {
//   const meals = await prisma.meal.findMany({
//     where: { dailyLogId },
//     include: { nutrients: true },
//   });

//   const totals = calculateTotalNutrients(meals);

//   await prisma.dailyLog.update({
//     where: { id: dailyLogId },
//     data: totals,
//   });
// }

// async function uploadImageToCloudinary(base64Image: string) {
//   const result = await cloudinary.uploader.upload(base64Image, {
//     folder: "meals",
//   });
//   return result.secure_url;
// }

// async function analyzeImageWithGemini(imageUrl: string) {
//   const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
//   const result = await model.generateContent([
//     imageUrl,
//     "Analyze this food image and provide detailed nutritional information in JSON format including: calories, protein (g), carbs (g), fats (g), fiber (g), iron (mg), calcium (mg), potassium (mg), vitamin A (IU), vitamin C (mg)",
//   ]);

//   const response = await result.response;
//   const analysisText = response.text();
//   const nutritionData = JSON.parse(analysisText);

//   return prisma.nutrients.create({
//     data: {
//       calories: nutritionData.calories || 0,
//       protein: nutritionData.protein || 0,
//       carbs: nutritionData.carbs || 0,
//       fats: nutritionData.fats || 0,
//       fiber: nutritionData.fiber || null,
//       iron: nutritionData.iron || null,
//       calcium: nutritionData.calcium || null,
//       potassium: nutritionData.potassium || null,
//       vitaminA: nutritionData.vitaminA || null,
//       vitaminC: nutritionData.vitaminC || null,
//     },
//   });
// }
