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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are NutriWise AI, an advanced nutrition and wellness advisor. Using the provided health profile metrics, provide evidence-based nutritional guidance addressing: ${message}

Respond in the following format without asterisks, markdown, or reference to specific profile metrics:

1. Personalized Recommendation
[Provide specific nutritional advice based on the profile]

2. Scientific Rationale
[Explain the nutritional science behind the recommendation in 2-3 sentences]

3. Practical Implementation
• First action step
• Second action step

4. Safety Considerations
[Brief safety note if applicable to the recommendation]

Keep responses clear, professional, and focused on the advice without referencing specific user metrics.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
