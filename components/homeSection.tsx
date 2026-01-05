"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, PlayCircle, TrendingUp, Star } from "lucide-react";
import { Anime } from "@/lib/types";

// --- HERO SECTION COMPONENT ---
export function HeroSection({
  heroAnime,
  proxyUrl,
}: {
  heroAnime: Anime;
  proxyUrl: string;
}) {
  if (!heroAnime) return null;

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 50 },
    },
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-900">
      {/* Background Layer */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={proxyUrl}
          alt="Hero Background"
          fill
          className="object-cover opacity-60 dark:opacity-40 blur-sm"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-zinc-950 dark:via-zinc-950/60 dark:to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-transparent to-transparent dark:from-zinc-950/90 dark:via-zinc-950/20 dark:to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] opacity-20 pointer-events-none" />
      </motion.div>

      {/* Hero Content */}
      <div className="container relative z-10 px-4 pt-20 pb-10 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left: Text Info */}
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-6 lg:space-y-8"
        >
          {/* Badges */}
          <motion.div
            variants={itemVars}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 dark:bg-indigo-500/20 text-white dark:text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <TrendingUp className="w-3.5 h-3.5" />
              On Going
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white dark:text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-current" />
              Episode Terbaru
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVars}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-indigo-600 dark:text-indigo-500 leading-[1.1] tracking-tight"
          >
            {heroAnime.title}
          </motion.h1>

          {/* Meta Data */}
          <motion.div
            variants={itemVars}
            className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-300"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{heroAnime.releaseDay}</span>
            </div>
            {heroAnime.episodes && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-sm">
                <PlayCircle className="w-4 h-4 text-indigo-600" />
                <span>Episode {heroAnime.episodes}</span>
              </div>
            )}
            <div className="text-xs text-indigo-600">
              Updated: {heroAnime.latestReleaseDate}
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVars}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all text-base"
            >
              <Link href={`/anime/${heroAnime.animeId}`}>
                <PlayCircle className="w-5 h-5 mr-2" /> Tonton Sekarang
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-zinc-800 text-zinc-900 dark:text-white backdrop-blur-sm h-12 px-8 text-base transition-all"
            >
              <Link href="/jadwal-anime">Jadwal Rilis</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: Floating Poster (Levitating Effect) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden lg:flex lg:col-span-5 justify-center items-center"
        >
          {/* Levitating Animation */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000" />

            <div className="relative w-[350px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20 dark:ring-white/10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <Image
                src={proxyUrl}
                alt={heroAnime.title}
                fill
                className="object-cover"
                sizes="350px"
                priority
                unoptimized
              />
              <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <p className="text-white text-sm font-medium line-clamp-1 opacity-90">
                  {heroAnime.title}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- FADE IN WRAPPER ---
export function FadeInWrapper({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
