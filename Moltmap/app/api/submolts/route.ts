import { NextResponse } from "next/server";

const API_BASE = "https://www.moltbook.com/api/v1";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/submolts`, {
      next: { revalidate: 300 } // 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch submolts: ${response.status}`);
    }
    
    const data = await response.json();
    const submolts = data.submolts || data || [];
    
    return NextResponse.json(submolts, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("API Error /api/submolts:", error);
    return NextResponse.json(
      { error: "Failed to fetch submolts" },
      { status: 500 }
    );
  }
}
