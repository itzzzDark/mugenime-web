"use client";

import Link from "next/link";
import Image from "next/image";
import { PlayCircle, ImageOff, Star, CalendarDays, Clock } from "lucide-react";
import { Anime } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

interface AnimeCardProps {
  anime: Anime;
  index?: number; // Tambahkan index untuk delay animasi
}

export default function AnimeCard({ anime, index = 0 }: Readonly<AnimeCardProps>) {
  const isValidPoster =
    anime.poster &&
    anime.poster !== "" &&
    anime.poster !== "null" &&
    anime.poster.startsWith("http");

  const imageUrl = isValidPoster
    ? `/api/image-proxy?url=${encodeURIComponent(anime.poster)}`
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }} // Stagger effect based on index
    >
      <Link href={`/anime/${anime.animeId}`} className="group block space-y-3 w-full h-full">
        {/* --- CARD CONTAINER --- */}
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative aspect-[3/4.2] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-500/10"
        >
          {/* 1. IMAGE LAYER */}
          {isValidPoster ? (
            <Image
              src={imageUrl}
              alt={anime.title}
              fill
              className="object-cover transition-transform duration-700" // CSS transform for image zoom is still fine
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-400">
              <ImageOff className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-[10px] font-medium">No Image</span>
            </div>
          )}

          {/* 2. GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* 3. HOVER PLAY BUTTON */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              className="bg-white/20 backdrop-blur-md p-3 rounded-full shadow-2xl ring-1 ring-white/40"
            >
              <PlayCircle className="w-8 h-8 text-white fill-white/20" />
            </motion.div>
          </div>

          {/* 4. TOP BADGES */}
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start z-20">
            {anime.score && (
              <Badge className="bg-yellow-500/90 backdrop-blur-sm text-white border-0 px-2 py-0.5 h-6 text-[11px] font-bold shadow-sm flex gap-1 items-center">
                <Star className="w-3 h-3 fill-white" />
                {anime.score}
              </Badge>
            )}

            <Badge className="bg-indigo-600/90 backdrop-blur-sm text-white border-0 px-2.5 h-6 text-[11px] shadow-lg shadow-indigo-900/20">
              Ep {anime.episodes}
            </Badge>
          </div>

          {/* 5. BOTTOM INFO */}
          <div className="absolute bottom-2 left-2 right-2 z-20">
            <div className="flex items-center justify-between bg-black/60 backdrop-blur-md rounded-lg p-2 border border-white/10 shadow-lg">
              <div className="flex items-center gap-1.5 text-zinc-100">
                <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-bold uppercase tracking-wide truncate max-w-[60px]">
                  {anime.releaseDay || "Tamat"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[9px] font-medium">
                  {anime.latestReleaseDate || anime.lastReleaseDate || "-"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- TITLE --- */}
        <div className="space-y-1 px-1">
          <h3 className="font-bold text-sm leading-snug line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {anime.title}
          </h3>
          {anime.genres && anime.genres.length > 0 && (
            <p className="text-[10px] text-zinc-500 dark:text-zinc-500 line-clamp-1">
              {anime.genres.map((g) => g.title).join(", ")}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}