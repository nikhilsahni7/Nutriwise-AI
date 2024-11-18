// app/api/onboarding/route.ts
import { NextResponse, NextRequest } from "next/server";
import { auth } from "auth";
import prisma from "@/lib/db";
import {
  Gender,
  PhysicalActivityLevel,
  Goals,
  DietPreference,
  Region,
} from "@prisma/client";

// Type definitions
interface ProfileUpdateData {
  name?: string;
  email?: string;
  image?: string;
  yearOfBirth?: number;
  height?: number;
  weight?: number;
  gender?: Gender;
  physicalActivityLevel?: PhysicalActivityLevel;
  goals?: Goals;
  dietPreference?: DietPreference;
  foodAllergies?: string[];
  foodsToAvoid?: string[];
  region?: Region;
}

// BMI calculation helper
const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
};

export const dynamic = "force-dynamic";
// GET endpoint
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        image: true,
        yearOfBirth: true,
        height: true,
        weight: true,
        gender: true,
        physicalActivityLevel: true,
        goals: true,
        dietPreference: true,
        bmi: true,
        foodAllergies: true,
        foodsToAvoid: true,
        region: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT endpoint
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let body: ProfileUpdateData;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid request body" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (
      body.yearOfBirth &&
      (body.yearOfBirth < 1900 || body.yearOfBirth > new Date().getFullYear())
    ) {
      return NextResponse.json(
        { error: "Invalid year of birth" },
        { status: 400 }
      );
    }

    if (body.height && (body.height < 80 || body.height > 300)) {
      return NextResponse.json(
        { error: "Height must be between 80cm and 300cm" },
        { status: 400 }
      );
    }

    if (body.weight && (body.weight < 20 || body.weight > 500)) {
      return NextResponse.json(
        { error: "Weight must be between 20kg and 500kg" },
        { status: 400 }
      );
    }

    // Calculate BMI if height and weight are provided
    let bmi: number | undefined;
    if (body.height && body.weight) {
      bmi = calculateBMI(body.weight, body.height);
    } else if (body.height || body.weight) {
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { height: true, weight: true },
      });

      if (currentUser?.height && currentUser?.weight) {
        bmi = calculateBMI(
          body.weight || currentUser.weight,
          body.height || currentUser.height
        );
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...body,
        ...(bmi && { bmi }),
      },
      select: {
        name: true,
        email: true,
        image: true,
        yearOfBirth: true,
        height: true,
        weight: true,
        gender: true,
        physicalActivityLevel: true,
        goals: true,
        dietPreference: true,
        bmi: true,
        foodAllergies: true,
        foodsToAvoid: true,
        region: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
