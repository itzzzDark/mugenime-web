import { createClient } from "./supabase/server";

export class FetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Fetch animes with optional filters
export async function getAnimes(filters?: {
  status?: string;
  type?: string;
  year?: number;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("animes")
    .select("*, genres(id, name, slug)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  if (filters?.year) {
    query = query.eq("year", filters.year);
  }

  if (filters?.limit) {
    const offset = filters?.offset || 0;
    query = query.range(offset, offset + filters.limit - 1);
  }

  const { data, error } = await query;

  if (error) throw new FetchError(error.message, 400);
  return data || [];
}

// Get featured animes for home page
export async function getFeaturedAnimes(limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("animes")
    .select("*, genres(id, name, slug)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new FetchError(error.message, 400);
  return data || [];
}

// Get ongoing animes
export async function getOngoingAnimes(limit = 11) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("animes")
    .select("*, genres(id, name, slug)")
    .eq("is_active", true)
    .eq("status", "ongoing")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new FetchError(error.message, 400);
  return data || [];
}

// Get completed animes
export async function getCompletedAnimes(limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("animes")
    .select("*, genres(id, name, slug)")
    .eq("is_active", true)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new FetchError(error.message, 400);
  return data || [];
}

// Get upcoming animes
export async function getUpcomingAnimes(limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("animes")
    .select("*, genres(id, name, slug)")
    .eq("is_active", true)
    .eq("status", "upcoming")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new FetchError(error.message, 400);
  return data || [];
}

// Get single anime by slug
export async function getAnimeBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("animes")
    .select("*, genres(id, name, slug), episodes(*, download_links(*), streaming_links(*))")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) throw new FetchError(error.message, 404);
  return data;
}

// Get episodes for an anime
export async function getAnimeEpisodes(animeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("episodes")
    .select("*, download_links(*), streaming_links(*)")
    .eq("anime_id", animeId)
    .eq("is_active", true)
    .order("episode_number", { ascending: true });

  if (error) throw new FetchError(error.message, 400);
  return data || [];
}

// Get all genres
export async function getGenres() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("genres")
    .select("*")
    .order("name");

  if (error) throw new FetchError(error.message, 400);
  return data || [];
}

// Get animes by genre
export async function getAnimesByGenre(genreSlug: string, limit = 20) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("anime_genres")
    .select("animes(*, genres(id, name, slug))")
    .in(
      "genre_id",
      (
        await supabase
          .from("genres")
          .select("id")
          .eq("slug", genreSlug)
      ).data?.map((g: any) => g.id) || []
    )
    .limit(limit);

  if (error) throw new FetchError(error.message, 400);
  return data?.map((item: any) => item.animes) || [];
}

// Record a view/analytics event
export async function recordView(animeId: string, episodeId?: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("analytics").insert({
    anime_id: animeId,
    episode_id: episodeId,
    view_type: episodeId ? "episode" : "anime",
  });

  if (error) console.error("Failed to record view:", error);
}
