// app/api/community/route.ts
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    const { name, description, ingredients, tags } = data;

    const recipe = await prisma.community.create({
      data: {
        name,
        description,
        ingredients,

        tags,
        userId: session.user.id!,
        userEmail: session.user.email!,
      },
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const recipes = await prisma.community.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { hasSome: [query] } },
        ],
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
