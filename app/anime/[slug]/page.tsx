import { fetchAnime } from "@/lib/api";
import { AnimeDetail, BatchResponse } from "@/lib/types";
import AnimeCard from "@/components/animeCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Star,
  MonitorPlay,
  Info,
  Calendar,
  Clock,
  Layers,
  Tv,
  Users,
  Film,
  Tags,
  Home,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BatchDownload from "@/components/batchDownload";
import CommentSection from "@/components/commentSection";
import ShareButton from "@/components/shareButton";
import BookmarkButton from "@/components/bookmarkButton";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

function isAnimeDetail(data: unknown): data is AnimeDetail {
  if (typeof data !== "object" || data === null) return false;
  const d = data as AnimeDetail;
  return (
    typeof d.title === "string" &&
    (typeof d.synopsis === "object" || typeof d.synopsis === "string") &&
    "episodeList" in d &&
    Array.isArray(d.episodeList)
  );
}

const getProxyUrl = (url: string) =>
  `/api/image-proxy?url=${encodeURIComponent(url)}`;

const getSynopsisText = (synopsis: AnimeDetail["synopsis"]) => {
  if (typeof synopsis === "string") return synopsis;
  if (synopsis && Array.isArray(synopsis.paragraphs)) {
    return synopsis.paragraphs.join(" ");
  }
  return "";
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const responseData = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`);
    if (!isAnimeDetail(responseData)) return { title: "Anime Not Found" };

    const anime = responseData;
    const title = `Nonton ${anime.title} Sub Indo Gratis - Mugenime`;
    const description = `Streaming anime ${anime.title} Subtitle Indonesia gratis resolusi 1080p, 720p, 480p. Download ${anime.title} sub indo lengkap di Mugenime.`;

    return {
      title: title,
      description: description,
      alternates: {
        canonical: `/anime/${slug}`,
      },
      openGraph: {
        title: title,
        description: description,
        images: [getProxyUrl(anime.poster)],
        type: "video.tv_show",
        siteName: "Mugenime",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [getProxyUrl(anime.poster)],
      },
    };
  } catch (e) {
    console.error(e);
    return { title: "Anime Not Found - Mugenime" };
  }
}

export default async function AnimeDetailPage({ params }: Readonly<Props>) {
  const { slug } = await params;
  let responseData: unknown;

  try {
    responseData = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`);
  } catch (error) {
    console.error("Failed to fetch anime detail:", error);
    return notFound();
  }

  if (!isAnimeDetail(responseData)) {
    return notFound();
  }

  const anime = responseData;
  const synopsisText = getSynopsisText(anime.synopsis);

  let batchData: BatchResponse | null = null;
  if (anime.batch?.batchId) {
    try {
      batchData = await fetchAnime<BatchResponse>(
        `anime/batch/${anime.batch.batchId}`,
      );
    } catch (error) {
      console.error("Gagal mengambil data batch:", error);
    }
  }

  const episodeLists = anime.episodeList || [];
  const firstEpisode = episodeLists.length > 0 ? episodeLists.at(-1) : null;
  const genres = anime.genreList || [];

  const genreString = genres.map((g) => g.title).join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: anime.title,
    image: getProxyUrl(anime.poster),
    description: synopsisText,
    numberOfEpisodes: anime.episodes || episodeLists.length.toString(),
    genre: genreString,
    potentialAction: {
      "@type": "WatchAction",
      target: `https://www.mugenime.my.id/anime/${slug}`,
    },
  };

  const animeData = {
    title: anime.title,
    slug: slug,
    poster: anime.poster,
    type: anime.type,
    rating: anime.score,
    studios: anime.studios,
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- 1. HERO BACKGROUND --- */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getProxyUrl(anime.poster)}
            alt="Background"
            fill
            className="object-cover opacity-50 dark:opacity-20 blur-xl scale-110"
            priority
            unoptimized
          />
        </div>

        {/* Gradients using Semantic Background Colors */}
        {/* Gradient atas untuk memudarkan gambar ke background warna solid */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-background/10 to-background opacity-100" />
      </div>

      {/* --- 2. MAIN CONTENT CONTAINER --- */}
      <div className="container mx-auto px-4 -mt-64 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- SIDEBAR (Left - Sticky) --- */}
          <div className="lg:col-span-3 lg:block">
            <div className="lg:top-24 space-y-6">
              {/* Poster Card */}
              <div className="group relative aspect-3/4 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border bg-muted">
                <Image
                  src={getProxyUrl(anime.poster)}
                  alt={anime.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 60vw, 300px"
                  priority
                  unoptimized
                />

                {/* Rating Badge Overlay */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-sm font-bold shadow-lg">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{anime.score || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {firstEpisode ? (
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  >
                    <Link href={`/watch/${slug}/${firstEpisode.episodeId}`}>
                      <Play className="w-5 h-5 mr-2 fill-current" />
                      Mulai Nonton (Episode 1)
                    </Link>
                  </Button>
                ) : (
                  <Button
                    disabled
                    size="lg"
                    className="w-full rounded-xl"
                    variant="secondary"
                  >
                    Belum Tayang
                  </Button>
                )}

                {/* Secondary Actions Row */}
                <div className="grid grid-cols-2 gap-3">
                  <ShareButton title={anime.title} slug={slug} />
                  <BookmarkButton data={animeData} />
                </div>
              </div>

              {/* Information Card */}
              <div className="bg-card rounded-2xl p-5 border border-border space-y-4 shadow-sm">
                <h3 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Info className="w-4 h-4" /> Informasi
                </h3>
                <Separator className="bg-border" />
                <div className="space-y-3 text-sm">
                  <InfoRow
                    icon={<Tv className="w-4 h-4" />}
                    label="Tipe"
                    value={anime.type}
                  />
                  <InfoRow
                    icon={<Layers className="w-4 h-4" />}
                    label="Episode"
                    value={anime.episodes ?? `${episodeLists.length}`}
                  />
                  <InfoRow
                    icon={<Calendar className="w-4 h-4" />}
                    label="Status"
                    value={anime.status}
                  />
                  <InfoRow
                    icon={<Clock className="w-4 h-4" />}
                    label="Durasi"
                    value={anime.duration}
                  />
                  <InfoRow
                    icon={<Users className="w-4 h-4" />}
                    label="Studio"
                    value={anime.studios}
                  />
                  <InfoRow
                    icon={<Film className="w-4 h-4" />}
                    label="Produser"
                    value={anime.producers}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- CONTENT AREA (Right) --- */}
          <div className="lg:col-span-9 space-y-8 pt-4 lg:pt-0">
            {/* Header: Breadcrumbs, Title & Genres */}
            <div className="space-y-4">
              {/* BREADCRUMB */}
              <Breadcrumb className="text-muted-foreground/80">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href="/"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Home className="w-3.5 h-3.5" /> Beranda
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href="/list-anime"
                        className="hover:text-primary transition-colors"
                      >
                        List Anime
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-foreground line-clamp-1 max-w-[200px] sm:max-w-none">
                      {anime.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <h1 className="text-3xl md:text-5xl font-black text-foreground leading-[1.15]">
                {anime.title}
              </h1>

              {/* --- JAPANESE TITLE --- */}
              {anime.japanese && (
                <p className="text-lg text-muted-foreground font-medium font-serif italic">
                  {anime.japanese}
                </p>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {genres.map((genre) => (
                  <Link
                    key={genre.genreId}
                    href={`/genre-anime/${genre.genreId}`}
                  >
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 text-sm bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                    >
                      {genre.title}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                <span className="w-1 h-6 bg-primary rounded-full mr-2"></span>{" "}
                Sinopsis
              </h3>
              <div className="text-muted-foreground leading-relaxed text-base">
                {synopsisText || "Sinopsis belum tersedia untuk anime ini."}
              </div>
            </div>

            {/* Episode List Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center">
                  <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>{" "}
                  Daftar Episode
                </h3>
                <Badge
                  variant="outline"
                  className="h-7 border-border text-muted-foreground"
                >
                  Total: {episodeLists.length}
                </Badge>
              </div>

              {episodeLists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {episodeLists.toReversed().map((ep) => (
                    <Link
                      key={ep.episodeId}
                      href={`/watch/${slug}/${ep.episodeId}`}
                      className="group relative flex items-center justify-center p-3 h-16 bg-card border border-border hover:border-primary/50 rounded-lg transition-all hover:shadow-md hover:shadow-primary/5 overflow-hidden"
                    >
                      {/* Hover Effect Background */}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10 flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                          Episode
                        </span>
                        <span className="text-lg font-bold text-foreground group-hover:text-primary">
                          {ep.eps}
                        </span>
                      </div>

                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-1">
                        <Play className="w-3 h-3 text-primary fill-primary" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/30">
                  <MonitorPlay className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Belum ada episode yang tersedia.
                  </p>
                </div>
              )}
            </div>

            {/* Batch Download */}
            {batchData && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <BatchDownload batchData={batchData} />
              </div>
            )}

            {/* Recommendations */}
            {anime.recommendations && anime.recommendations.length > 0 && (
              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-bold text-foreground flex items-center">
                  <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>{" "}
                  Rekomendasi
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                  {anime.recommendations.map((rec) => (
                    <AnimeCard key={rec.animeId} anime={rec} />
                  ))}
                </div>
              </div>
            )}

            {/* SEO Keywords Card */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Tags className="w-4 h-4 text-primary" />
                  Nonton {anime.title} Sub Indo Gratis
                </h2>
                <div className="text-sm text-muted-foreground leading-relaxed text-justify">
                  Nonton streaming anime <b>{anime.title}</b> Subtitle Indonesia
                  terlengkap dan terbaru di Mugenime. Kamu bisa download{" "}
                  <b>{anime.title}</b> sub indo dengan kualitas HD 720p, 1080p,
                  hingga paket hemat 360p dan 480p. Tersedia format MP4 dan MKV
                  yang bisa diakses gratis. Jangan lupa tonton juga anime dari
                  studio {anime.studios} dan genre {genreString} lainnya hanya
                  disini.
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground/80 leading-normal">
                  <span className="font-bold text-muted-foreground">
                    Keywords:{" "}
                  </span>
                  Nonton {anime.title}, Streaming {anime.title} Sub Indo,
                  Download {anime.title} Subtitle Indonesia,
                  {anime.title} Episode Terakhir, {anime.title} Batch Sub Indo,{" "}
                  {anime.title} 360p 480p 720p 1080p, Streaming Anime Sub Indo
                  Gratis.
                </p>
              </div>
            </div>

            {/* Comments */}
            <div className="pt-2">
              <CommentSection
                identifier={anime.slug}
                title={anime.title}
                type="anime"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value?: string;
}>) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between group">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span
        className="font-medium text-foreground text-right max-w-[150px] group-hover:text-primary transition-colors"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
