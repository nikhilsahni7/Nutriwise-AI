import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt =
      "What are the top 3 possible dishes in this food image? List only dish names.";
    const result = await model.generateContent([prompt, imageUrl]);
    const suggestions = result.response
      .text()
      .split("\n")
      .map((s) => s.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);

    return NextResponse.json({ suggestions, imageUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
