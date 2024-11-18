import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/db";
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId, rating } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedRecipe = await prisma.savedRecipe.update({
      where: {
        id: recipeId,
        userId: user.id,
      },
      data: {
        rating,
      },
    });

    return NextResponse.json({ recipe: updatedRecipe }, { status: 200 });
  } catch (error) {
    console.error("Rate recipe error:", error);
    return NextResponse.json(
      { error: "Failed to rate recipe" },
      { status: 500 }
    );
  }
}
