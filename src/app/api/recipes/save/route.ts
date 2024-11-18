import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let data;
    try {
      data = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON data provided" },
        { status: 400 }
      );
    }

    const { recipeId, name, image, calories, protein, carbs, fats } = data;

    if (!recipeId || typeof recipeId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing recipeId" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing recipe name" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingRecipe = await prisma.savedRecipe.findFirst({
      where: {
        userId: user.id,
        recipeId: recipeId,
      },
      select: { id: true },
    });

    if (existingRecipe) {
      return NextResponse.json(
        { error: "Recipe already saved" },
        { status: 400 }
      );
    }

    // Save the recipe with data validation
    const savedRecipe = await prisma.savedRecipe.create({
      data: {
        userId: user.id,
        recipeId,
        name,
        image: image && typeof image === "string" ? image : null,
        calories: typeof calories === "number" ? calories : 0,
        protein: typeof protein === "number" ? protein : 0,
        carbs: typeof carbs === "number" ? carbs : 0,
        fats: typeof fats === "number" ? fats : 0,
      },
    });

    return NextResponse.json(
      {
        message: "Recipe saved successfully",
        recipe: savedRecipe,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Save recipe error:", error);
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}
