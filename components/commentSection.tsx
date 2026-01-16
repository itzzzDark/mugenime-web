"use client";

import { useState } from "react";
import Giscus from "@giscus/react";
import {
  Bold,
  Italic,
  Code,
  EyeOff,
  Heading1,
  Heading2,
  MessageSquare,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner"; 

interface CommentSectionProps {
  identifier?: string; 
  title?: string;      
  type?: "anime" | "episode" | "page"; // Tambahkan tipe untuk pembeda
}

export default function CommentSection({
  identifier,
  title,
  type = "page", // Default ke 'page' jika tidak diisi
}: Readonly<CommentSectionProps>) {
  
  // LOGIKA MAPPING SUPER SPESIFIK:
  // Kita tambahkan PREFIX agar ID Anime tidak bentrok dengan ID Episode.
  // Contoh: 
  // - Anime: "ANIME_jujutsu-kaisen"
  // - Episode: "EPISODE_jujutsu-kaisen-eps-1"
  
  const mappingMode = identifier ? "specific" : "pathname";
  
  let termValue = undefined;
  if (identifier) {
      // Gabungkan tipe + identifier agar unik 100%
      termValue = `${type.toUpperCase()}_${identifier}`;
  }

  const tools = [
    {
      label: "Bold",
      icon: <Bold className="w-4 h-4" />,
      syntax: "**teks tebal**",
      desc: "Teks Tebal",
    },
    {
      label: "Italic",
      icon: <Italic className="w-4 h-4" />,
      syntax: "_teks miring_",
      desc: "Teks Miring",
    },
    {
      label: "Heading 1",
      icon: <Heading1 className="w-4 h-4" />,
      syntax: "# Judul Besar",
      desc: "Judul Besar",
    },
    {
      label: "Heading 2",
      icon: <Heading2 className="w-4 h-4" />,
      syntax: "## Judul Sedang",
      desc: "Judul Sub-bab",
    },
    {
      label: "Code",
      icon: <Code className="w-4 h-4" />,
      syntax: "`kode disini`",
      desc: "Format Kode",
    },
    {
      label: "Spoiler",
      icon: <EyeOff className="w-4 h-4" />,
      syntax:
        "\n<details>\n<summary>Spoiler (Klik untuk buka)</summary>\n\nIsi spoiler disini...\n</details>\n",
      desc: "Spoiler Tag",
    },
  ];

  const handleCopySyntax = (syntax: string, label: string) => {
    navigator.clipboard.writeText(syntax);
    toast.success(`Format ${label} disalin!`, {
      description: "Paste (Ctrl+V) di kolom komentar.",
      duration: 3000,
      position: "bottom-center",
    });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-sm">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 p-4 md:p-8 space-y-6">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Komentar
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Diskusi {title ? `tentang "${title}"` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-2.5 rounded-lg max-w-sm">
            <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-yellow-700 dark:text-yellow-400 leading-tight">
              Maaf jika agak ribet. Sistem komentar menggunakan <b>GitHub</b> agar
              bebas iklan. Gunakan toolbar di bawah untuk format teks.
            </p>
          </div>
        </div>

        {/* --- TOOLBAR --- */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-1">
            Tools:
          </span>
          <TooltipProvider>
            {tools.map((tool) => (
              <Tooltip key={tool.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopySyntax(tool.syntax, tool.label)}
                    className="h-8 w-8 rounded-lg hover:bg-indigo-50 cursor-pointer hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-all"
                  >
                    {tool.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">{tool.desc} (Klik untuk Salin)</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          <div className="ml-auto text-[10px] text-zinc-400 italic hidden sm:block">
            *Klik icon lalu Paste (Ctrl+V)
          </div>
        </div>

        {/* --- GISCUS ENGINE --- */}
        <div className="min-h-[200px]">
          <Giscus
            id="comments"
            repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
            repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
            category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || ""}
            categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
            mapping={mappingMode as never}
            term={termValue}
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="light"
            lang="id"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}