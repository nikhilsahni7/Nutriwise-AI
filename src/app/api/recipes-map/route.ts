// pages/api/recipes-map.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const continent = searchParams.get("continent");

  try {
    const response = await fetch(
      `https://cosylab.iiitd.edu.in/recipe-search/continents?searchText=${encodeURIComponent(
        continent || ""
      )}&pageSize=10`,
      {
        method: "GET",
        headers: {
          "x-api-key": "cosylab",
        },
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Error fetching recipes" },
      { status: 500 }
    );
  }
}
