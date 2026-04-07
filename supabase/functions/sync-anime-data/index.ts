import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnimeData {
  title: string;
  animeId: string;
  poster: string;
  releaseDay?: string;
  latestReleaseDate?: string;
  episodes?: string;
  score?: string;
  lastReleaseDate?: string;
  japanese?: string;
  type?: string;
  status?: string;
  duration?: string;
  aired?: string;
  studios?: string;
  producers?: string;
  synopsis?: string;
  season?: string;
  genres?: Array<{ title: string; genreId: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const externalApiUrl = Deno.env.get("EXTERNAL_API_URL") || "https://api.sankavollerei.my.id/api/v1";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, type } = await req.json();

    if (action === "sync-ongoing") {
      const response = await fetch(`${externalApiUrl}/anime/ongoing-anime`);
      const data = await response.json();

      const animeList: AnimeData[] = data.data?.animeList || [];

      for (const anime of animeList) {
        const { data: existingAnime } = await supabase
          .from("anime")
          .select("id")
          .eq("anime_id", anime.animeId)
          .maybeSingle();

        const animeRecord = {
          anime_id: anime.animeId,
          title: anime.title,
          poster: anime.poster || null,
          release_day: anime.releaseDay || null,
          latest_release_date: anime.latestReleaseDate || null,
          episodes: anime.episodes || null,
          score: anime.score || null,
          last_release_date: anime.lastReleaseDate || null,
          status: "Ongoing",
          updated_at: new Date().toISOString(),
        };

        if (existingAnime) {
          await supabase
            .from("anime")
            .update(animeRecord)
            .eq("id", existingAnime.id);
        } else {
          const { data: inserted } = await supabase
            .from("anime")
            .insert(animeRecord)
            .select()
            .single();

          if (anime.genres && inserted) {
            for (const genre of anime.genres) {
              const { data: genreData } = await supabase
                .from("genres")
                .select("id")
                .eq("genre_id", genre.genreId)
                .maybeSingle();

              let genreId = genreData?.id;

              if (!genreId) {
                const { data: newGenre } = await supabase
                  .from("genres")
                  .insert({ genre_id: genre.genreId, title: genre.title })
                  .select()
                  .single();
                genreId = newGenre?.id;
              }

              if (genreId) {
                await supabase
                  .from("anime_genres")
                  .insert({ anime_id: inserted.id, genre_id: genreId })
                  .onConflict("anime_id,genre_id")
                  .ignore();
              }
            }
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Synced ${animeList.length} ongoing anime`,
          count: animeList.length
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (action === "sync-completed") {
      const response = await fetch(`${externalApiUrl}/anime/complete-anime`);
      const data = await response.json();

      const animeList: AnimeData[] = data.data?.animeList || [];

      for (const anime of animeList) {
        const { data: existingAnime } = await supabase
          .from("anime")
          .select("id")
          .eq("anime_id", anime.animeId)
          .maybeSingle();

        const animeRecord = {
          anime_id: anime.animeId,
          title: anime.title,
          poster: anime.poster || null,
          episodes: anime.episodes || null,
          score: anime.score || null,
          last_release_date: anime.lastReleaseDate || null,
          status: "Completed",
          updated_at: new Date().toISOString(),
        };

        if (existingAnime) {
          await supabase
            .from("anime")
            .update(animeRecord)
            .eq("id", existingAnime.id);
        } else {
          await supabase
            .from("anime")
            .insert(animeRecord)
            .select()
            .single();
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Synced ${animeList.length} completed anime`,
          count: animeList.length
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (action === "sync-anime-detail") {
      const { slug } = await req.json();

      const response = await fetch(`${externalApiUrl}/anime/anime/${slug}`);
      const data = await response.json();
      const anime = data.data;

      const { data: existingAnime } = await supabase
        .from("anime")
        .select("id")
        .eq("anime_id", slug)
        .maybeSingle();

      const synopsisText = typeof anime.synopsis === "string"
        ? anime.synopsis
        : anime.synopsis?.paragraphs?.join("\n") || null;

      const animeRecord = {
        anime_id: slug,
        title: anime.title,
        japanese: anime.japanese || null,
        poster: anime.poster || null,
        score: anime.score || null,
        type: anime.type || null,
        status: anime.status || null,
        episodes: anime.episodes || null,
        duration: anime.duration || null,
        aired: anime.aired || null,
        studios: anime.studios || null,
        producers: anime.producers || null,
        synopsis: synopsisText,
        updated_at: new Date().toISOString(),
      };

      let animeDbId: string;

      if (existingAnime) {
        await supabase
          .from("anime")
          .update(animeRecord)
          .eq("id", existingAnime.id);
        animeDbId = existingAnime.id;
      } else {
        const { data: inserted } = await supabase
          .from("anime")
          .insert(animeRecord)
          .select()
          .single();
        animeDbId = inserted.id;
      }

      if (anime.genreList) {
        await supabase
          .from("anime_genres")
          .delete()
          .eq("anime_id", animeDbId);

        for (const genre of anime.genreList) {
          const { data: genreData } = await supabase
            .from("genres")
            .select("id")
            .eq("genre_id", genre.genreId)
            .maybeSingle();

          let genreId = genreData?.id;

          if (!genreId) {
            const { data: newGenre } = await supabase
              .from("genres")
              .insert({ genre_id: genre.genreId, title: genre.title })
              .select()
              .single();
            genreId = newGenre?.id;
          }

          if (genreId) {
            await supabase
              .from("anime_genres")
              .insert({ anime_id: animeDbId, genre_id: genreId });
          }
        }
      }

      if (anime.episodeList) {
        for (const episode of anime.episodeList) {
          await supabase
            .from("episodes")
            .insert({
              anime_id: animeDbId,
              episode_id: episode.episodeId,
              title: episode.title,
              eps: episode.eps,
              release_time: episode.date || null,
            })
            .onConflict("episode_id")
            .ignore();
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Synced anime detail for ${anime.title}`,
          animeId: animeDbId
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
