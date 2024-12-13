// app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth";
import prisma from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { message } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        gender: true,
        yearOfBirth: true,
        height: true,
        weight: true,
        bmi: true,
        physicalActivityLevel: true,
        goals: true,
        dietPreference: true,
        foodAllergies: true,
        foodsToAvoid: true,
        region: true,
      },
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const {name, gender, yearOfBirth, height, weight, bmi, physicalActivityLevel, goals, dietPreference, foodAllergies, foodsToAvoid} : any = user;

    const prompt = `You are NutriWise AI, a professional nutrition and wellness advisor specializing in personalized, evidence-based guidance. Based on the provided health profile, craft a comprehensive yet concise response addressing the following user query: "${message}"

    Consider the following details about the user who is seeking advice:
    name: ${name},
    gender: ${gender},
    age: ${2024-yearOfBirth},
    height (cm): ${height},
    weight (kg): ${weight},
    bmi: ${bmi},
    physical activity level (level 1 is sedentary, level 5 is very active): ${physicalActivityLevel},
    goals: ${goals},
    diet preferrences: ${dietPreference},
    food allergies: ${foodAllergies},
    foods to avoid: ${foodsToAvoid},

Guidelines for your response:

Personalized Recommendation
Provide targeted nutritional advice tailored to the profile's context and goals. Ensure the advice is actionable and specific.

Scientific Rationale
Offer a brief explanation (2-3 sentences) detailing the science or evidence supporting your recommendation.

Practical Implementation Steps

First action step
Second action step
Safety Considerations
Highlight any relevant precautions, risks, or conditions to consider.

Response Format:

Avoid asterisks, markdown, or references to specific user profile metrics.
Ensure the tone is professional, clear, and solution-oriented.
Focus on providing actionable, science-backed guidance.`;
    console.log(prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text }, { status: 200 });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
