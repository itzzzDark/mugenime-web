import { getAnimeBySlug } from "@/lib/api";
import { BatchResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const anime = await getAnimeBySlug(slug);
    if (!anime) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }
    
    const data: BatchResponse = {
      anime,
      episodes: anime.episodes || [],
    };
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[API Batch Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch batch" },
      { status: 500 }
    );
  }
}
