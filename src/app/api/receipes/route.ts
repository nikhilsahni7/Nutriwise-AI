// src/app/api/recipes/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchText = searchParams.get("searchText");

  try {
    const response = await fetch(
      `https://cosylab.iiitd.edu.in/recipe-search/recipe?pageSize=10&searchText=${searchText}`
    );
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return Response.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}
