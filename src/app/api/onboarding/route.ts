// app/api/profile/route.ts
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

// Function to calculate BMI
const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100; // Convert cm to meters
  const bmi = weight / (heightInMeters * heightInMeters);
  return Number(bmi.toFixed(2));
};

// Type for profile update data
interface ProfileUpdateData {
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

// GET route to fetch user profile
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
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

// PUT route to update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body: ProfileUpdateData = await req.json();

    // Number validations
    if (
      body.yearOfBirth &&
      (body.yearOfBirth < 1900 || body.yearOfBirth > new Date().getFullYear())
    ) {
      return NextResponse.json(
        { error: "Invalid year of birth" },
        { status: 400 }
      );
    }

    if (body.height && (body.height < 0 || body.height > 300)) {
      return NextResponse.json(
        { error: "Invalid height value" },
        { status: 400 }
      );
    }

    if (body.weight && (body.weight < 0 || body.weight > 500)) {
      return NextResponse.json(
        { error: "Invalid weight value" },
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
