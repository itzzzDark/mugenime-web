"use server";

import { fetchAnime } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { AnimeDetail, SearchResult } from "@/lib/types";

export async function getAnimeDetailAction(
  slug: string
): Promise<AnimeDetail | null> {
  try {
    const data = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`);
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
    const { data: anime } = await supabase
      .from("anime")
      .select("anime_id, title, poster, status, score")
      .or(`title.ilike.%${keyword}%,japanese.ilike.%${keyword}%`)
      .limit(20);

    if (!anime || anime.length === 0) return [];

    const animeIds = anime.map((a) => a.id);

    const { data: genreRelations } = await supabase
      .from("anime_genres")
      .select("anime_id, genres(genre_id, title)")
      .in("anime_id", animeIds);

    const genreMap = new Map<string, any[]>();
    (genreRelations || []).forEach((rel: any) => {
      if (!rel.genres) return;
      if (!genreMap.has(rel.anime_id)) {
        genreMap.set(rel.anime_id, []);
      }
      genreMap.get(rel.anime_id)!.push({
        genreId: rel.genres.genre_id,
        title: rel.genres.title,
      });
    });

    return anime.map((item: any) => ({
      title: item.title,
      slug: item.anime_id,
      poster: item.poster || "",
      status: item.status || "Unknown",
      rating: item.score || "N/A",
      genres: genreMap.get(item.id) || [],
      url: `/anime/${item.anime_id}`,
    }));
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}
