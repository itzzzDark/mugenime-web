"use server";

import { getAnimeBySlug, getAnimes } from "@/lib/api";
import { SearchResult } from "@/lib/types";

export async function getAnimeDetailAction(
  slug: string
): Promise<any | null> {
  try {
    const data = await getAnimeBySlug(slug);
    return data;
  } catch (error) {
    console.error(`Gagal fetch detail untuk ${slug}:`, error);
    return null;
  }
}

export async function searchAnimeAction(
  keyword: string
): Promise<SearchResult[]> {
  if (!keyword || keyword.trim().length < 3) return [];

  try {
    // Fetch all animes and filter by keyword on server-side
    const allAnimes = await getAnimes({ limit: 10000 });

    // Filter animes by title or Japanese title
    const filtered = allAnimes.filter(
      (anime) =>
        anime.title.toLowerCase().includes(keyword.toLowerCase()) ||
        (anime.japanese_title &&
          anime.japanese_title.toLowerCase().includes(keyword.toLowerCase()))
    );

    // Map to SearchResult format
    return filtered.slice(0, 20).map((anime: any) => ({
      title: anime.title,
      slug: anime.slug,
      poster: anime.poster_url,
      status: anime.status,
      rating: anime.score?.toString() || "0",
      genres: anime.genres || [],
      url: `/anime/${anime.slug}`,
    }));
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}
