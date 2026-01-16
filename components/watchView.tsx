"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  AnimeDetail,
  EpisodeDetail,
  BatchResponse,
  DownloadQuality,
} from "@/lib/types";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  List,
  Info,
  Download,
  FileVideo,
  Film,
  User,
  Clock,
  Video,
  PlayCircle,
  Calendar,
  Home,
  Tv,
  Building2,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BatchDownload from "./batchDownload";
import CommentSection from "./commentSection";

interface WatchViewProps {
  episode: EpisodeDetail;
  animeDetail: AnimeDetail | null;
  batchData: BatchResponse | null;
  episodeSlug: string;
  slug: string;
}

export default function WatchView({
  episode,
  animeDetail,
  batchData,
  episodeSlug,
  slug,
}: Readonly<WatchViewProps>) {
  // --- STATE ---
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(
    episode?.defaultStreamingUrl || ""
  );
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  const activeRequestRef = useRef<string>("");
  const addToHistory = useStore((state) => state.addToHistory);

  const isInvalid = !episode?.defaultStreamingUrl;

  // --- HELPERS ---
  const getProxyUrl = (url: string | undefined) => {
    if (!url) return "";
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  const parseDownloadTitle = (title: string) => {
    const match = new RegExp(/^(mp4|mkv)[\s_]+(\d+p)$/i).exec(title);
    if (match) {
      return {
        format: match[1].toUpperCase(),
        res: match[2],
      };
    }
    const isMkv = title.toLowerCase().includes("mkv");
    return {
      format: isMkv ? "MKV" : "MP4",
      res: title.replaceAll(/mp4|mkv|_|\s/gi, ""),
    };
  };

  const normalizeDownloads = (): DownloadQuality[] => {
    if (!episode.downloadUrl) return [];
    if (episode.downloadUrl.formats) {
      return episode.downloadUrl.formats.flatMap((group) => group.qualities);
    }
    if (episode.downloadUrl.qualities) {
      return episode.downloadUrl.qualities;
    }
    return [];
  };

  const groupedDownloads = useMemo(() => {
    const allQualities = normalizeDownloads();
    const groups: Record<string, DownloadQuality[]> = {};
    allQualities.forEach((item) => {
      const { format } = parseDownloadTitle(item.title);
      if (!groups[format]) groups[format] = [];
      groups[format].push(item);
    });
    return groups;
  }, [episode.downloadUrl]);

  // --- EFFECTS ---
  useEffect(() => {
    if (isInvalid) return;

    setCurrentVideoUrl(episode.defaultStreamingUrl);
    setSelectedServerId(null);
    setIsLoadingVideo(false);
    activeRequestRef.current = "";

    const cleanTitle = episode.title.replace(/Episode\s+\d+.*/i, "").trim();

    addToHistory({
      title: cleanTitle,
      slug: slug,
      poster: animeDetail?.poster || "",
      currentEpisode: episode.title,
      url: `/watch/${slug}/${episodeSlug}`,
    });
  }, [episode, episodeSlug, addToHistory, isInvalid, animeDetail, slug]);

  const handleServerChange = async (urlId: string) => {
    if (urlId === selectedServerId) return;
    setIsLoadingVideo(true);
    setSelectedServerId(urlId);
    activeRequestRef.current = urlId;

    try {
      const res = await fetch(`/api/server?id=${encodeURIComponent(urlId)}`);
      const data = await res.json();

      if (activeRequestRef.current !== urlId) return;

      if (data.url) {
        setCurrentVideoUrl(data.url);
      } else {
        throw new Error("URL tidak ditemukan");
      }
    } catch (error) {
      if (activeRequestRef.current === urlId) console.error(error);
    } finally {
      if (activeRequestRef.current === urlId) setIsLoadingVideo(false);
    }
  };

  if (isInvalid) return null;

  let parentAnimeSlug = slug;
  if (!parentAnimeSlug && episode.animeId) {
    parentAnimeSlug = episode.animeId.replace("-sub-indo", "");
  }

  const displayEpisodeList =
    episode.info?.episodeList && episode.info.episodeList.length > 0
      ? episode.info.episodeList
      : animeDetail?.episodeList || [];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm text-zinc-500 mb-6 space-x-2 overflow-hidden">
        <Link href="/" className="hover:text-indigo-600 transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        <span className="text-zinc-300">/</span>
        <Link href="/" className="hover:text-indigo-600 transition-colors">
          Anime
        </Link>
        <span className="text-zinc-300">/</span>
        <Link
          href={`/anime/${parentAnimeSlug}`}
          className="hover:text-indigo-600 transition-colors truncate max-w-[150px] md:max-w-xs"
        >
          {animeDetail?.title || "Detail"}
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="font-medium text-zinc-900 dark:text-zinc-200 truncate">
          Episode {episode.title.match(/Episode\s+(\d+)/i)?.[1] || "Playing"}
        </span>
      </nav>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* --- LEFT COLUMN (PLAYER & INFO) --- */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. PLAYER CARD */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="relative w-full aspect-video bg-black">
              {/* Loading State Overlay */}
              <div
                className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm transition-all duration-300 ${
                  isLoadingVideo
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="bg-white/10 p-3 rounded-full mb-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
                <p className="text-white/80 font-medium text-sm">
                  Menghubungkan ke Server...
                </p>
              </div>

              <iframe
                key={currentVideoUrl}
                src={currentVideoUrl}
                title={episode.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Player Controls */}
            <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {episode.title}
                  </h1>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {episode.releaseTime || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none border-zinc-200 hover:bg-zinc-50 text-zinc-700 hover:text-indigo-600 hover:border-indigo-200"
                    disabled={!episode.hasPrevEpisode}
                    asChild
                  >
                    {episode.prevEpisode ? (
                      <Link
                        href={`/watch/${slug}/${episode.prevEpisode.episodeId}`}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                      </Link>
                    ) : (
                      <span>
                        <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                      </span>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                    disabled={!episode.hasNextEpisode}
                    asChild
                  >
                    {episode.nextEpisode ? (
                      <Link
                        href={`/watch/${slug}/${episode.nextEpisode.episodeId}`}
                      >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    ) : (
                      <span>
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. SERVER SELECTION */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm flex items-center gap-2">
                <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                Pilih Server
              </h3>
              <a
                href={currentVideoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center hover:underline"
              >
                <ExternalLink className="w-3 h-3 mr-1" /> Tab Baru
              </a>
            </div>

            <Tabs
              defaultValue={episode.server.qualities[0]?.title || "360p"}
              className="w-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <TabsList className="w-full sm:w-auto h-auto p-0 bg-transparent gap-2 justify-start flex-wrap">
                  {episode.server.qualities.map((qualityGroup) => (
                    <TabsTrigger
                      key={qualityGroup.title}
                      value={qualityGroup.title}
                      className="rounded-full px-4 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-600 text-zinc-500 transition-all shadow-sm"
                    >
                      {qualityGroup.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {episode.server.qualities.map((qualityGroup) => (
                <TabsContent
                  key={qualityGroup.title}
                  value={qualityGroup.title}
                  className="mt-0 focus-visible:outline-none"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {qualityGroup.serverList.map((server) => (
                      <button
                        key={server.serverId}
                        onClick={() => handleServerChange(server.serverId)}
                        disabled={
                          isLoadingVideo && selectedServerId !== server.serverId
                        }
                        className={`
                          relative group flex items-center justify-center px-3 py-2.5 rounded-lg text-xs font-medium border transition-all duration-200
                          ${
                            selectedServerId === server.serverId
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                              : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 hover:border-indigo-400 hover:text-indigo-600"
                          }
                        `}
                      >
                        {isLoadingVideo &&
                        selectedServerId === server.serverId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                        ) : (
                          <PlayCircle
                            className={`w-3.5 h-3.5 mr-2 ${
                              selectedServerId === server.serverId
                                ? "opacity-100"
                                : "opacity-50 group-hover:opacity-100"
                            }`}
                          />
                        )}
                        <span className="truncate capitalize">
                          {server.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* 3. ANIME DETAIL CARD (Overview) */}
          {animeDetail && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col md:flex-row gap-5">
              <div className="shrink-0 relative w-[100px] md:w-[120px] aspect-[2/3] rounded-lg overflow-hidden bg-zinc-100 shadow-sm border border-zinc-100 mx-auto md:mx-0">
                {animeDetail.poster ? (
                  <Image
                    src={getProxyUrl(animeDetail.poster)}
                    alt={animeDetail.title}
                    fill
                    className="object-cover"
                    sizes="120px"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <Info className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 transition-colors line-clamp-1">
                    <Link href={`/anime/${parentAnimeSlug}`}>
                      {animeDetail.title}
                    </Link>
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-zinc-100 text-zinc-600 border-zinc-200 rounded-md"
                    >
                      {animeDetail.status}
                    </Badge>
                    {animeDetail.score && (
                      <Badge
                        variant="outline"
                        className="border-yellow-300 text-yellow-700 bg-yellow-50 rounded-md flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{" "}
                        {animeDetail.score}
                      </Badge>
                    )}
                    {/* Menampilkan Studio sesuai request */}
                    {animeDetail.studios && (
                      <Badge
                        variant="outline"
                        className="border-zinc-200 text-zinc-500 flex items-center gap-1 rounded-md"
                      >
                        <Building2 className="w-3 h-3" />
                        {animeDetail.studios}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1">
                    Sinopsis
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-4 leading-relaxed">
                    {(typeof animeDetail.synopsis === "string"
                      ? animeDetail.synopsis
                      : animeDetail.synopsis?.paragraphs?.join(" ")) ||
                      "Sinopsis tidak tersedia."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN (SIDEBAR) --- */}
        {/* Tidak menggunakan 'sticky' agar sidebar ikut scroll */}
        <div className="lg:col-span-4 space-y-6">
          {/* A. EPISODE LIST */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                <List className="w-4 h-4 text-indigo-600" /> Daftar Episode
              </h3>
              <span className="text-[10px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full">
                {displayEpisodeList.length} Episode
              </span>
            </div>

            <div className="p-3 max-h-[350px] overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-900">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {displayEpisodeList.toReversed().map((ep) => {
                  const isCurrent = ep.episodeId === episodeSlug;
                  return (
                    <Link
                      key={ep.episodeId}
                      href={`/watch/${slug}/${ep.episodeId}`}
                      className={`
                          group relative flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition-all duration-200
                          ${
                            isCurrent
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                              : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-700 text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white hover:shadow-sm"
                          }
                        `}
                    >
                      <span className="z-10 relative">{ep.eps}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* B. INFO CREDITS */}
          {episode.info && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-4 text-xs space-y-3">
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 pb-2 mb-2">
                Informasi File
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <User className="w-3 h-3" /> Credit
                  </span>
                  <span className="text-zinc-800 font-medium truncate max-w-[150px]">
                    {episode.info.credit || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Video className="w-3 h-3" /> Encoder
                  </span>
                  <span className="text-zinc-800 font-medium truncate max-w-[150px]">
                    {episode.info.encoder || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Durasi
                  </span>
                  <span className="text-zinc-800 font-medium">
                    {episode.info.duration || "-"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* C. DOWNLOAD SECTION */}
          {(Object.keys(groupedDownloads).length > 0 || batchData) && (
            <div className="space-y-4">
              {Object.keys(groupedDownloads).length > 0 && (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <div className="p-4 bg-zinc-50/50 border-b border-zinc-100 flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-sm text-zinc-800">
                      Download
                    </h3>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(groupedDownloads).map(
                      ([format, qualities], idx) => (
                        <AccordionItem
                          key={format}
                          value={format}
                          className="border-zinc-100 px-0"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:bg-zinc-50 hover:no-underline text-sm font-medium text-zinc-700">
                            <div className="flex items-center gap-2">
                              {format === "MP4" ? (
                                <FileVideo className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Film className="w-4 h-4 text-purple-500" />
                              )}
                              <span>{format}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-1 bg-zinc-50/30 space-y-2">
                            {qualities.map((item) => {
                              const { res } = parseDownloadTitle(item.title);
                              return (
                                <div
                                  key={item.title}
                                  className="bg-white border border-zinc-200 rounded-md p-2.5 shadow-sm"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-zinc-700">
                                      {res}
                                    </span>
                                    <span className="text-[10px] text-zinc-400">
                                      {item.size}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {item.urls.map((link) => (
                                      <a
                                        key={link.title}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center h-6 px-2 text-[10px] font-medium text-zinc-600 bg-zinc-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 border border-zinc-200 rounded transition-colors"
                                      >
                                        {link.title}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                </div>
              )}

              {batchData && <BatchDownload batchData={batchData} />}
            </div>
          )}
        </div>
      </div>

      {/* 4. Comments */}
      <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <CommentSection
          identifier={episodeSlug}
          title={`${animeDetail?.title} - ${episode.title}`}
          type="episode"
        />
      </div>
    </div>
  );
}
