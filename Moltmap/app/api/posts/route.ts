import { NextResponse } from "next/server";

const API_BASE = "https://www.moltbook.com/api/v1";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = (searchParams.get("sort") as "hot" | "new") || "hot";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const response = await fetch(`${API_BASE}/posts?sort=${sort}&limit=${limit}`, {
      next: { revalidate: 120 } // 2 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    
    const data = await response.json();
    const posts = data.posts || data || [];
    
    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("API Error /api/posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
