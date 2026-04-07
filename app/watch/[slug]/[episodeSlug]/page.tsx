import WatchView from "@/components/watchView";
import { getAnimeBySlug, getAnimeEpisodes } from "@/lib/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type Props = {
  params: Promise<{ episodeSlug: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const anime = await getAnimeBySlug(slug);
    return {
      title: `Nonton ${anime.title} - Mugenime`,
      description: `Streaming ${anime.title} subtitle Indonesia gratis.`,
    };
  } catch {
    return { title: "Episode Not Found" };
  }
}

export default async function WatchPage({ params }: Readonly<Props>) {
  const { episodeSlug, slug } = await params;

  try {
    // Fetch anime detail
    const animeData = await getAnimeBySlug(slug);
    if (!animeData) return notFound();

    // Get episodes for this anime
    const episodes = await getAnimeEpisodes(animeData.id);
    
    // Find the specific episode by slug
    const episodeData = episodes.find((ep: any) => ep.slug === episodeSlug);
    if (!episodeData) return notFound();

    return (
      <div className="min-h-screen bg-background pb-20">
        <WatchView
          episode={episodeData}
          animeDetail={animeData}
          slug={slug}
          episodeSlug={episodeSlug}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching episode data:", error);
    return notFound();
  }
}
