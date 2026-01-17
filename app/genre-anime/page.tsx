import { fetchAnime } from "@/lib/api";
import { GenreListResponse } from "@/lib/types";
import Link from "next/link";
import { Tags, Hash } from "lucide-react";

export const revalidate = 86400;

export default async function GenrePage() {
  const genres = await fetchAnime<GenreListResponse>("anime/genre");

  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
              <Tags className="w-3.5 h-3.5" />
              List Genre
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              Cari <span className="text-primary">Genre Anime</span>
            </h1>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
              Temukan anime favoritmu berdasarkan genre. Mulai comedy, fantasy,
              drama, action hingga romance.
            </p>
          </div>
        </div>

        {/* --- GENRE GRID --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {genres.genreList.map((genre) => (
            <Link
              key={genre.genreId}
              href={`/genre-anime/${genre.genreId}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/50 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                  {genre.title}
                </span>
                <Hash className="w-4 h-4 text-muted-foreground group-hover:text-primary/70 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
