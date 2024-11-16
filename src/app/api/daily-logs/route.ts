// app/api/daily-logs/route.ts
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

    // 2. Get date from query params
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);

    // 3. Query daily log with meals
    const dailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: date,
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

    if (!dailyLog) {
      return NextResponse.json(
        { error: "Daily log not found" },
        { status: 404 }
      );
    }

    // 4. Return formatted response
    return NextResponse.json({
      success: true,
      data: dailyLog,
    });
  } catch (error) {
    console.error("Error fetching daily log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
