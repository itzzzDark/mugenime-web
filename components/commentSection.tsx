"use client";

import { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
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
import { cn } from "@/lib/utils";

interface CommentSectionProps {
  identifier?: string;
  title?: string;
  type?: "anime" | "episode" | "page";
}

export default function CommentSection({
  identifier,
  title,
  type = "page",
}: Readonly<CommentSectionProps>) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const giscusTheme =
    mounted && resolvedTheme === "dark" ? "transparent_dark" : "light";

  const mappingMode = identifier ? "specific" : "pathname";

  let termValue = undefined;
  if (identifier) {
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
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 p-4 md:p-8 space-y-6">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Komentar</h3>
              <p className="text-xs text-muted-foreground">
                Diskusi {title ? `tentang "${title}"` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 p-2.5 rounded-lg max-w-sm">
            <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-yellow-700 dark:text-yellow-400 leading-tight">
              Maaf jika agak ribet. Sistem komentar menggunakan <b>GitHub</b>{" "}
              agar bebas iklan. Gunakan toolbar di bawah untuk format teks.
            </p>
          </div>
        </div>

        {/* --- TOOLBAR --- */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 border border-border rounded-xl">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1">
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
                    className="h-8 w-8 rounded-lg hover:bg-primary/10 cursor-pointer hover:text-primary transition-all text-muted-foreground"
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
          <div className="ml-auto text-[10px] text-muted-foreground italic hidden sm:block">
            *Klik icon lalu Paste (Ctrl+V)
          </div>
        </div>

        {/* --- GISCUS ENGINE --- */}
        <div className="min-h-[200px]">
          {mounted ? (
            <Giscus
              id="comments"
              repo={
                process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`
              }
              repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
              category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || ""}
              categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
              mapping={mappingMode as never}
              term={termValue}
              strict="0"
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme={giscusTheme}
              lang="id"
              loading="lazy"
            />
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
              Memuat komentar...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
