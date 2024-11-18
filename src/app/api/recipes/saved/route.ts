import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const savedRecipes = await prisma.savedRecipe.findMany({
      where: { userId: user.id },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({ recipes: savedRecipes }, { status: 200 });
  } catch (error) {
    console.error("Get saved recipes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved recipes" },
      { status: 500 }
    );
  }
}
