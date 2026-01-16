import { MetadataRoute } from "next";
import { fetchAnime } from "@/lib/api";
import { OngoingResponse, CompleteAnimeResponse, Anime } from "@/lib/types";

export const revalidate = 3600;

async function getMultiplePages(
  endpoint: string,
  maxPages: number
): Promise<Anime[]> {
  const pages = Array.from({ length: maxPages }, (_, i) => i + 1);

  try {
    const responses = await Promise.all(
      pages.map((page) =>
        fetchAnime<OngoingResponse | CompleteAnimeResponse>(
          `${endpoint}?page=${page}`
        ).catch((err) => {
          console.error(`Gagal fetch ${endpoint} page ${page}:`, err);
          return null;
        })
      )
    );

    const allAnime: Anime[] = [];

    responses.forEach((res) => {
      if (res && res.animeList) {
        allAnime.push(...res.animeList);
      }
    });

    return allAnime;
  } catch (error) {
    console.error("Critical error fetching multiple pages:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.mugenime.my.id";

  const staticRoutes = [
    "",
    "/jadwal-anime",
    "/ongoing-anime",
    "/completed-anime",
    "/list-anime",
    "/genre-anime",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const [ongoingList, completedList] = await Promise.all([
    getMultiplePages("anime/ongoing-anime", 3),
    getMultiplePages("anime/complete-anime", 3),
  ]);

  const ongoingRoutes = ongoingList.map((anime) => ({
    url: `${baseUrl}/anime/${anime.animeId}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const completedRoutes = completedList.map((anime) => ({
    url: `${baseUrl}/anime/${anime.animeId}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...ongoingRoutes, ...completedRoutes];
}
