import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get date from query params and format it properly
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Create start and end date for the full day
    const startDate = new Date(dateParam);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dateParam);
    endDate.setHours(23, 59, 59, 999);

    // 3. First try to find existing daily log
    let dailyLog = await prisma.dailyLog.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        meals: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // 4. If no daily log exists, create a new one
    if (!dailyLog) {
      dailyLog = await prisma.dailyLog.create({
        data: {
          userId: session.user.id,
          date: startDate,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
          totalFiber: 0,
          totalIron: 0,
          totalCalcium: 0,
          totalPotassium: 0,
          totalVitaminA: 0,
          totalVitaminC: 0,
        },
        include: {
          meals: true,
        },
      });
    }

    // 5. Calculate totals from meals if they exist
    if (dailyLog.meals.length > 0) {
      const totals = dailyLog.meals.reduce(
        (acc, meal) => ({
          totalCalories: acc.totalCalories + (meal.calories || 0),
          totalProtein: acc.totalProtein + (meal.protein || 0),
          totalCarbs: acc.totalCarbs + (meal.carbs || 0),
          totalFats: acc.totalFats + (meal.fats || 0),
          totalFiber: acc.totalFiber + (meal.fiber || 0),
          totalIron: acc.totalIron + (meal.iron || 0),
          totalCalcium: acc.totalCalcium + (meal.calcium || 0),
          totalPotassium: acc.totalPotassium + (meal.potassium || 0),
          totalVitaminA: acc.totalVitaminA + (meal.vitaminA || 0),
          totalVitaminC: acc.totalVitaminC + (meal.vitaminC || 0),
        }),
        {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
          totalFiber: 0,
          totalIron: 0,
          totalCalcium: 0,
          totalPotassium: 0,
          totalVitaminA: 0,
          totalVitaminC: 0,
        }
      );

      // Update the daily log with calculated totals
      dailyLog = await prisma.dailyLog.update({
        where: { id: dailyLog.id },
        data: totals,
        include: {
          meals: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    }

    // 6. Return formatted response
    return NextResponse.json({
      success: true,
      data: dailyLog,
    });
  } catch (error) {
    console.error("Error fetching daily log:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST endpoint to add a meal and update daily totals
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date, mealData } = body;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    // Find or create daily log
    let dailyLog = await prisma.dailyLog.findFirst({
      where: {
        userId: session.user.id,
        date: startDate,
      },
    });

    if (!dailyLog) {
      dailyLog = await prisma.dailyLog.create({
        data: {
          userId: session.user.id,
          date: startDate,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
          totalFiber: 0,
          totalIron: 0,
          totalCalcium: 0,
          totalPotassium: 0,
          totalVitaminA: 0,
          totalVitaminC: 0,
        },
      });
    }

    // Create new meal
    const meal = await prisma.meal.create({
      data: {
        ...mealData,
        userId: session.user.id,
        dailyLogId: dailyLog.id,
      },
    });

    // Update daily log totals
    await prisma.dailyLog.update({
      where: { id: dailyLog.id },
      data: {
        totalCalories: { increment: meal.calories },
        totalProtein: { increment: meal.protein },
        totalCarbs: { increment: meal.carbs },
        totalFats: { increment: meal.fats },
        totalFiber: { increment: meal.fiber },
        totalIron: { increment: meal.iron },
        totalCalcium: { increment: meal.calcium },
        totalPotassium: { increment: meal.potassium },
        totalVitaminA: { increment: meal.vitaminA },
        totalVitaminC: { increment: meal.vitaminC },
      },
    });

    return NextResponse.json({
      success: true,
      data: meal,
    });
  } catch (error) {
    console.error("Error adding meal:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
