import { MetadataRoute } from "next";
import { getOngoingAnimes, getCompletedAnimes } from "@/lib/api";

export const revalidate = 3600;

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
    getOngoingAnimes(1000),
    getCompletedAnimes(1000),
  ]);

  const ongoingRoutes = ongoingList.map((anime) => ({
    url: `${baseUrl}/anime/${anime.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const completedRoutes = completedList.map((anime) => ({
    url: `${baseUrl}/anime/${anime.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...ongoingRoutes, ...completedRoutes];
}
