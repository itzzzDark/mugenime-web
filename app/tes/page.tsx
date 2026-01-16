"use client";

import { useState, useRef } from "react";
import Giscus from "@giscus/react";
import {
  Bold,
  Italic,
  Code,
  EyeOff,
  Heading1,
  Heading2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner"; // Asumsi Anda pakai Sonner/Toast, kalau tidak bisa pakai alert biasa

export default function CommentSection() {
  // Ref untuk iframe container agar bisa di-scroll saat user klik tool
  const containerRef = useRef<HTMLDivElement>(null);

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
    
    // Feedback Visual (Toast atau Alert)
    // Jika pakai shadcn/ui toast: toast.success(...)
    // Disini saya pakai alert sederhana atau manipulasi DOM sementara
    const el = document.getElementById("giscus-feedback");
    if (el) {
        el.innerText = `Format ${label} disalin! Tekan CTRL+V di kolom komentar.`;
        el.classList.remove("opacity-0");
        setTimeout(() => el.classList.add("opacity-0"), 3000);
    }
    
    // Coba fokus ke area giscus (Best effort)
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe && iframe instanceof HTMLElement) {
        iframe.focus();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4" ref={containerRef}>
      {/* --- TOOLBAR HELPER --- */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 uppercase mr-2">
            Tools:
            </span>

            <TooltipProvider>
            {tools.map((tool) => (
                <Tooltip key={tool.label}>
                <TooltipTrigger asChild>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopySyntax(tool.syntax, tool.label)}
                    className="h-8 w-8 p-0 border-zinc-300 dark:border-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                    >
                    {tool.icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tool.desc}</p>
                </TooltipContent>
                </Tooltip>
            ))}
            </TooltipProvider>
        </div>
        
        {/* Feedback Text Area */}
        <div className="flex items-center justify-between text-xs px-1">
            <span id="giscus-feedback" className="text-indigo-600 font-medium transition-opacity duration-300 opacity-0 bg-indigo-50 px-2 py-1 rounded-md">
                {/* Text ini akan muncul lewat JS */}
            </span>
            <span className="text-zinc-400 italic">
            *Klik icon lalu <b>Paste (Ctrl+V)</b> di kolom komentar.
            </span>
        </div>
      </div>

      {/* --- GISCUS CONTAINER --- */}
      <div className="p-4 md:p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm min-h-[300px]">
        <Giscus
          id="comments"
          repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
          repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
          category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || ""}
          categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="light"
          lang="en"
          loading="lazy"
        />
      </div>
    </div>
  );
}