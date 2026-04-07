import { supabase } from "./supabase";
import { notFound } from "next/navigation";
import type {
  HomeData,
  AnimeDetail,
  EpisodeDetail,
  OngoingResponse,
  CompleteAnimeResponse,
  ScheduleDay,
  GenreListResponse,
  GenreDetailResponse,
  AnimeListResponse,
  BatchResponse,
} from "./types";

export class FetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchAnime<T>(endpoint: string): Promise<T> {
  try {
    if (endpoint.startsWith("anime/home")) {
      return (await getHomeData()) as T;
    }

    if (endpoint.startsWith("anime/anime/")) {
      const slug = endpoint.replace("anime/anime/", "");
      return (await getAnimeDetail(slug)) as T;
    }

    if (endpoint.startsWith("anime/episode/")) {
      const episodeSlug = endpoint.replace("anime/episode/", "");
      return (await getEpisodeDetail(episodeSlug)) as T;
    }

    if (endpoint.startsWith("anime/ongoing-anime")) {
      const urlParams = new URLSearchParams(endpoint.split("?")[1] || "");
      const page = parseInt(urlParams.get("page") || "1");
      return (await getOngoingAnime(page)) as T;
    }

    if (endpoint.startsWith("anime/complete-anime")) {
      const urlParams = new URLSearchParams(endpoint.split("?")[1] || "");
      const page = parseInt(urlParams.get("page") || "1");
      return (await getCompletedAnime(page)) as T;
    }

    if (endpoint.startsWith("anime/schedule")) {
      return (await getSchedule()) as T;
    }

    if (endpoint.startsWith("anime/genre/") && !endpoint.includes("?")) {
      return (await getGenreList()) as T;
    }

    if (endpoint.startsWith("anime/genre/") && endpoint.includes("?")) {
      const parts = endpoint.split("?");
      const genreSlug = parts[0].replace("anime/genre/", "");
      const urlParams = new URLSearchParams(parts[1]);
      const page = parseInt(urlParams.get("page") || "1");
      return (await getAnimeByGenre(genreSlug, page)) as T;
    }

    if (endpoint.startsWith("anime/unlimited")) {
      return (await getAnimeList()) as T;
    }

    if (endpoint.startsWith("anime/batch/")) {
      const batchId = endpoint.replace("anime/batch/", "");
      return (await getBatchData(batchId)) as T;
    }

    throw new Error(`Unknown endpoint: ${endpoint}`);
  } catch (error) {
    console.error(`[Fetch Error] ${endpoint}:`, error);
    throw error;
  }
}

async function getHomeData(): Promise<HomeData> {
  const { data: ongoingAnime } = await supabase
    .from("anime")
    .select("*")
    .eq("status", "Ongoing")
    .order("updated_at", { ascending: false })
    .limit(11);

  const { data: completedAnime } = await supabase
    .from("anime")
    .select("*")
    .eq("status", "Completed")
    .order("updated_at", { ascending: false })
    .limit(10);

  const mapAnime = (anime: any) => ({
    title: anime.title,
    animeId: anime.anime_id,
    poster: anime.poster,
    releaseDay: anime.release_day,
    latestReleaseDate: anime.latest_release_date,
    lastReleaseDate: anime.last_release_date,
    episodes: anime.episodes,
    score: anime.score,
  });

  return {
    ongoing: {
      animeList: (ongoingAnime || []).map(mapAnime),
    },
    completed: {
      animeList: (completedAnime || []).map(mapAnime),
    },
  };
}

async function getAnimeDetail(slug: string): Promise<AnimeDetail> {
  const { data: anime, error } = await supabase
    .from("anime")
    .select("*")
    .eq("anime_id", slug)
    .maybeSingle();

  if (error || !anime) {
    return notFound();
  }

  const { data: genreRelations } = await supabase
    .from("anime_genres")
    .select("genre_id, genres(genre_id, title)")
    .eq("anime_id", anime.id);

  const { data: episodesList } = await supabase
    .from("episodes")
    .select("episode_id, title, eps, release_time")
    .eq("anime_id", anime.id)
    .order("eps", { ascending: true });

  const { data: batchData } = await supabase
    .from("batch_downloads")
    .select("batch_id, title, uploaded_at")
    .eq("anime_id", anime.id)
    .maybeSingle();

  const { data: recommendationData } = await supabase
    .from("recommendations")
    .select("recommended_anime_id, anime!recommendations_recommended_anime_id_fkey(anime_id, title, poster, score, episodes)")
    .eq("anime_id", anime.id)
    .limit(10);

  const genres = (genreRelations || [])
    .map((rel: any) => rel.genres)
    .filter(Boolean)
    .map((g: any) => ({ genreId: g.genre_id, title: g.title }));

  const episodes = (episodesList || []).map((ep: any) => ({
    episodeId: ep.episode_id,
    title: ep.title,
    eps: ep.eps,
    date: ep.release_time || "",
  }));

  const recommendations = (recommendationData || [])
    .map((rec: any) => rec.anime)
    .filter(Boolean)
    .map((a: any) => ({
      animeId: a.anime_id,
      title: a.title,
      poster: a.poster,
      score: a.score,
      episodes: a.episodes,
    }));

  return {
    title: anime.title,
    slug: anime.anime_id,
    japanese: anime.japanese || "",
    score: anime.score || "",
    poster: anime.poster || "",
    producers: anime.producers || "",
    type: anime.type || "",
    status: anime.status || "",
    episodes: anime.episodes || "",
    duration: anime.duration || "",
    aired: anime.aired || "",
    studios: anime.studios || "",
    genreList: genres,
    synopsis: anime.synopsis || "",
    batch: batchData
      ? {
          title: batchData.title,
          batchId: batchData.batch_id,
          uploaded_at: batchData.uploaded_at || "",
          otakudesu_url: "",
          href: "",
          otakudesuUrl: "",
        }
      : null,
    episodeList: episodes,
    recommendations,
  };
}

async function getEpisodeDetail(episodeSlug: string): Promise<EpisodeDetail> {
  const { data: episode, error } = await supabase
    .from("episodes")
    .select("*, anime(*)")
    .eq("episode_id", episodeSlug)
    .maybeSingle();

  if (error || !episode) {
    return notFound();
  }

  const { data: servers } = await supabase
    .from("streaming_servers")
    .select("*")
    .eq("episode_id", episode.id)
    .order("quality", { ascending: true });

  const { data: downloads } = await supabase
    .from("download_links")
    .select("*")
    .eq("episode_id", episode.id);

  const { data: allEpisodes } = await supabase
    .from("episodes")
    .select("episode_id, title, eps")
    .eq("anime_id", episode.anime_id)
    .order("eps", { ascending: true });

  const currentIndex = (allEpisodes || []).findIndex((e) => e.eps === episode.eps);
  const prevEp = currentIndex > 0 ? allEpisodes![currentIndex - 1] : null;
  const nextEp = currentIndex >= 0 && currentIndex < (allEpisodes?.length || 0) - 1 ? allEpisodes![currentIndex + 1] : null;

  const serverGroups: any = {};
  (servers || []).forEach((s: any) => {
    if (!serverGroups[s.quality]) {
      serverGroups[s.quality] = [];
    }
    serverGroups[s.quality].push({
      title: s.server_title,
      serverId: s.server_id,
      href: s.href,
    });
  });

  const downloadGroups: any = {};
  (downloads || []).forEach((d: any) => {
    const key = `${d.format}_${d.quality}`;
    if (!downloadGroups[key]) {
      downloadGroups[key] = {
        title: key,
        size: d.size || "",
        urls: [],
      };
    }
    downloadGroups[key].urls.push({
      title: d.server_title,
      url: d.url,
    });
  });

  const { data: genreRelations } = await supabase
    .from("anime_genres")
    .select("genres(genre_id, title)")
    .eq("anime_id", episode.anime_id);

  const genres = (genreRelations || [])
    .map((rel: any) => rel.genres)
    .filter(Boolean)
    .map((g: any) => ({ title: g.title, genreId: g.genre_id }));

  return {
    title: episode.title,
    animeId: episode.anime?.anime_id || "",
    releaseTime: episode.release_time || "",
    defaultStreamingUrl: episode.default_streaming_url || "",
    hasPrevEpisode: !!prevEp,
    prevEpisode: prevEp
      ? {
          title: prevEp.title,
          episodeId: prevEp.episode_id,
          href: "",
          otakudesuUrl: "",
        }
      : null,
    hasNextEpisode: !!nextEp,
    nextEpisode: nextEp
      ? {
          title: nextEp.title,
          episodeId: nextEp.episode_id,
          href: "",
          otakudesuUrl: "",
        }
      : null,
    server: {
      qualities: Object.entries(serverGroups).map(([quality, serverList]) => ({
        title: quality,
        serverList: serverList as any[],
      })),
    },
    downloadUrl: {
      qualities: Object.values(downloadGroups),
    },
    info: {
      credit: episode.credit || "",
      encoder: episode.encoder || "",
      duration: episode.duration || "",
      type: episode.anime?.type || "",
      genreList: genres,
      episodeList: (allEpisodes || []).map((e: any) => ({
        episodeId: e.episode_id,
        title: e.title,
        eps: e.eps,
        date: "",
      })),
    },
  };
}

async function getOngoingAnime(page: number = 1): Promise<OngoingResponse> {
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: anime, count } = await supabase
    .from("anime")
    .select("*", { count: "exact" })
    .eq("status", "Ongoing")
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    animeList: (anime || []).map((a: any) => ({
      title: a.title,
      animeId: a.anime_id,
      poster: a.poster,
      releaseDay: a.release_day,
      latestReleaseDate: a.latest_release_date,
      episodes: a.episodes,
      score: a.score,
    })),
    pagination: {
      currentPage: page,
      hasPrevPage: page > 1,
      prevPage: page > 1 ? page - 1 : null,
      hasNextPage: page < totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      totalPages,
    },
  };
}

async function getCompletedAnime(page: number = 1): Promise<CompleteAnimeResponse> {
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: anime, count } = await supabase
    .from("anime")
    .select("*", { count: "exact" })
    .eq("status", "Completed")
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    animeList: (anime || []).map((a: any) => ({
      title: a.title,
      animeId: a.anime_id,
      poster: a.poster,
      lastReleaseDate: a.last_release_date,
      episodes: a.episodes,
      score: a.score,
    })),
    pagination: {
      currentPage: page,
      hasPrevPage: page > 1,
      prevPage: page > 1 ? page - 1 : null,
      hasNextPage: page < totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      totalPages,
    },
  };
}

async function getSchedule(): Promise<ScheduleDay[]> {
  const { data: schedules } = await supabase
    .from("schedules")
    .select("day, anime(anime_id, title, poster)")
    .order("day", { ascending: true });

  const grouped: Record<string, any[]> = {};
  (schedules || []).forEach((s: any) => {
    if (!s.anime) return;
    if (!grouped[s.day]) {
      grouped[s.day] = [];
    }
    grouped[s.day].push({
      title: s.anime.title,
      slug: s.anime.anime_id,
      poster: s.anime.poster,
      url: `/anime/${s.anime.anime_id}`,
    });
  });

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  return days.map((day) => ({
    day,
    anime_list: grouped[day] || [],
  }));
}

async function getGenreList(): Promise<GenreListResponse> {
  const { data: genres } = await supabase
    .from("genres")
    .select("genre_id, title")
    .order("title", { ascending: true });

  return {
    genreList: (genres || []).map((g: any) => ({
      genreId: g.genre_id,
      title: g.title,
    })),
  };
}

async function getAnimeByGenre(genreSlug: string, page: number = 1): Promise<GenreDetailResponse> {
  const { data: genre } = await supabase
    .from("genres")
    .select("id")
    .eq("genre_id", genreSlug)
    .maybeSingle();

  if (!genre) {
    return { animeList: [], pagination: { currentPage: 1, hasPrevPage: false, prevPage: null, hasNextPage: false, nextPage: null, totalPages: 0 } };
  }

  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: animeGenres, count } = await supabase
    .from("anime_genres")
    .select("anime(anime_id, title, poster, score, episodes, studios, season)", { count: "exact" })
    .eq("genre_id", genre.id)
    .range(offset, offset + limit - 1);

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    animeList: (animeGenres || [])
      .map((ag: any) => ag.anime)
      .filter(Boolean)
      .map((a: any) => ({
        animeId: a.anime_id,
        title: a.title,
        poster: a.poster,
        score: a.score,
        episodes: a.episodes,
        studios: a.studios,
        season: a.season,
      })),
    pagination: {
      currentPage: page,
      hasPrevPage: page > 1,
      prevPage: page > 1 ? page - 1 : null,
      hasNextPage: page < totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      totalPages,
    },
  };
}

async function getAnimeList(): Promise<AnimeListResponse> {
  const { data: anime } = await supabase
    .from("anime")
    .select("anime_id, title")
    .order("title", { ascending: true });

  const grouped: Record<string, any[]> = {};

  (anime || []).forEach((a: any) => {
    const firstChar = a.title.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(firstChar) ? firstChar : "#";

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push({
      animeId: a.anime_id,
      title: a.title,
      href: `/anime/${a.anime_id}`,
      otakudesuUrl: "",
    });
  });

  const list = Object.entries(grouped)
    .map(([startWith, animeList]) => ({
      startWith,
      animeList,
    }))
    .sort((a, b) => a.startWith.localeCompare(b.startWith));

  return { list };
}

async function getBatchData(batchId: string): Promise<BatchResponse> {
  const { data: batch, error } = await supabase
    .from("batch_downloads")
    .select("*, anime(anime_id, title, poster, status)")
    .eq("batch_id", batchId)
    .maybeSingle();

  if (error || !batch) {
    return notFound();
  }

  const { data: links } = await supabase
    .from("batch_links")
    .select("*")
    .eq("batch_id", batch.id);

  const formatGroups: any = {};
  (links || []).forEach((link: any) => {
    if (!formatGroups[link.format]) {
      formatGroups[link.format] = {};
    }
    const qualityKey = link.quality;
    if (!formatGroups[link.format][qualityKey]) {
      formatGroups[link.format][qualityKey] = {
        title: qualityKey,
        size: link.size || "",
        urls: [],
      };
    }
    formatGroups[link.format][qualityKey].urls.push({
      title: link.server_title,
      url: link.url,
    });
  });

  const formats = Object.entries(formatGroups).map(([formatName, qualities]) => ({
    title: formatName,
    qualities: Object.values(qualities),
  }));

  return {
    title: batch.title,
    animeId: batch.anime?.anime_id || "",
    poster: batch.anime?.poster || "",
    status: batch.anime?.status || "",
    downloadUrl: { formats },
  };
}
