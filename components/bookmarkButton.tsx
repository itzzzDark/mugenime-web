"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore, AnimeItem } from "@/lib/store";

interface BookmarkButtonProps {
  data?: AnimeItem;
  className?: string;
}

export default function BookmarkButton({ data, className }: BookmarkButtonProps) {
  // Gunakan state mounted untuk menghindari hydration mismatch karena localStorage
  const [mounted, setMounted] = useState(false);
  const { bookmarks, addBookmark, removeBookmark } = useStore();

  useEffect(() => {
    useStore.persist.rehydrate(); // Pastikan store terhidrasi
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !data) {
    return (
      <Button
        disabled
        variant="outline"
        size="lg"
        className={cn("w-full rounded-xl gap-2", className)}
      >
        <Bookmark className="w-5 h-5 cursor-pointer" />
        Bookmark
      </Button>
    );
  }

  const isBookmarked = bookmarks.some((b) => b.slug === data.slug);

  const handleToggle = () => {
    if (isBookmarked) {
      removeBookmark(data.slug);
      toast.info("Dihapus dari Bookmark", {
        description: `${data.title} telah dihapus dari daftar simpan.`,
      });
    } else {
      addBookmark(data);
      toast.success("Ditambahkan ke Bookmark", {
        description: `${data.title} berhasil disimpan.`,
      });
    }
  };

  return (
    <Button
      onClick={handleToggle}
      size="lg"
      variant={isBookmarked ? "default" : "secondary"}
      className={cn(
        "w-full rounded-xl transition-all duration-300 gap-2 border shadow-sm cursor-pointer",
        isBookmarked
          ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 hover:shadow-indigo-500/25"
          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700",
        className
      )}
    >
      <Bookmark
        className={cn(
          "w-5 h-5 transition-transform duration-300",
          isBookmarked ? "fill-white scale-110" : "fill-transparent"
        )}
      />
      <span className="font-semibold">
        {isBookmarked ? "Tersimpan" : "Bookmark"}
      </span>
    </Button>
  );
}