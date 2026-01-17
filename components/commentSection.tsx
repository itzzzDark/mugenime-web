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
  MessageSquare,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Copy,
  Info,
  Terminal,
  Strikethrough,
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
  const [showGuide, setShowGuide] = useState(false);

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

  // --- DATA ---
  const rules = [
    "Dilarang konten 18+ / Pornografi.",
    "Hindari SARA & Ujaran Kebencian.",
    "Hormati sesama User.",
    "Dilarang SPAM link ilegal/judi.",
    "Gunakan fitur Spoiler untuk yaa spoiler 🗿",
  ];

  const tools = [
    {
      label: "Bold",
      icon: <Bold className="w-4 h-4" />,
      syntax: "**teks tebal**",
      desc: "Teks Tebal",
      preview: <span className="font-bold">teks tebal</span>,
    },
    {
      label: "Italic",
      icon: <Italic className="w-4 h-4" />,
      syntax: "_teks miring_",
      desc: "Teks Miring",
      preview: <span className="italic">teks miring</span>,
    },
    {
      label: "Heading",
      icon: <Heading1 className="w-4 h-4" />,
      syntax: "# Judul",
      desc: "Judul Besar",
      preview: (
        <span className="font-bold border-b border-foreground/20">Judul</span>
      ),
    },
    {
      label: "Code",
      icon: <Code className="w-4 h-4" />,
      syntax: "`kode`",
      desc: "Inline Code",
      preview: (
        <code className="bg-primary/10 text-primary px-1 rounded text-[10px] font-mono border border-primary/20">
          kode
        </code>
      ),
    },
    {
      label: "Strike",
      icon: <Strikethrough className="w-4 h-4" />,
      syntax: "~~teks dicoret~~",
      desc: "Teks Coret",
      preview: (
        <span className="line-through text-muted-foreground">teks dicoret</span>
      ),
    },
    {
      label: "Spoiler",
      icon: <EyeOff className="w-4 h-4" />,
      syntax:
        "\n<details>\n<summary>Spoiler</summary>\nIsi rahasia...\n</details>\n",
      desc: "Spoiler Tag",
      preview: (
        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded cursor-help">
          ▶ Spoiler
        </span>
      ),
    },
  ];

  const handleCopySyntax = (syntax: string, label: string) => {
    navigator.clipboard.writeText(syntax);
    toast.success("Disalin!", {
      description: `Format ${label} siap ditempel.`,
      icon: <Copy className="w-4 h-4 text-green-500" />,
      duration: 1500,
      position: "bottom-center",
    });
  };

  return (
    <section className="relative w-full max-w-full mx-auto my-8">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl -z-10" />

      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl backdrop-blur-xl transition-all duration-300">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 border-b border-border/40">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-linear-to-br from-primary/20 to-primary/5 rounded-2xl text-primary ring-1 ring-primary/20 shadow-inner">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Komentar{" "}
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                  Beta
                </span>
              </h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Bagikan pendapatmu tentang{" "}
                <span className="text-foreground font-medium">
                  {title || "topik ini"}
                </span>
                {""}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-secondary">
            <Info className="w-3.5 h-3.5" />
            <span>Masuk via GitHub untuk berkomentar</span>
          </div>
        </div>

        {/* --- GUIDE TOGGLE (MOBILE) --- */}
        <div className="md:hidden px-4 py-2 bg-muted/20 border-b border-border/40">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className="w-full justify-between text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 h-9"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              {showGuide ? "Tutup Panduan" : "Baca Peraturan & Format"}
            </span>
            {showGuide ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        {/* --- INFO AREA (RULES & TOOLS) --- */}
        <div
          className={cn(
            "grid gap-6 p-6 transition-all duration-500 ease-in-out bg-muted/10",
            showGuide ? "block" : "hidden md:grid md:grid-cols-12",
          )}
        >
          {/* KOLOM KIRI: Rules */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="h-full rounded-2xl border border-border/50 bg-background/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-5">
              <div className="bg-secondary/30 px-4 py-3 border-b border-border/50 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
                  Etika Berkomentar
                </span>
              </div>
              <ul className="p-4 space-y-3">
                {rules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* KOLOM KANAN: Syntax Cheatsheet */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="h-full rounded-2xl border border-border/50 bg-background/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="bg-secondary/30 px-4 py-3 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
                    Markdown Shortcut
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground italic hidden sm:block">
                  Klik baris untuk menyalin
                </span>
              </div>

              <div className="flex-1 overflow-x-auto">
                <div className="grid grid-cols-2 gap-px bg-border/30 p-px">
                  {tools.map((tool, i) => (
                    <div
                      key={i}
                      onClick={() => handleCopySyntax(tool.syntax, tool.label)}
                      className="group flex flex-col gap-1.5 p-3 bg-background hover:bg-primary/5 cursor-pointer transition-colors relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {tool.icon} {tool.label}
                        </span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border border-border/50 text-foreground/70 truncate max-w-[80px] sm:max-w-none">
                          {tool.syntax.replaceAll("\n", "")}
                        </code>
                        <span className="text-muted-foreground/30 text-[10px]">
                          →
                        </span>
                        <div className="text-xs opacity-90 truncate">
                          {tool.preview}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Quick Toolbar */}
          <div className="flex items-center justify-between bg-secondary/20 p-2 rounded-xl border border-border/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-1">
              <span className="ml-2 mr-2 text-[10px] font-bold text-muted-foreground uppercase hidden sm:inline-block">
                Quick Tools
              </span>
              <TooltipProvider delayDuration={0}>
                {tools.map((tool) => (
                  <Tooltip key={tool.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCopySyntax(tool.syntax, tool.label)
                        }
                        className="w-8 h-8 rounded-lg hover:bg-background hover:shadow-sm text-muted-foreground hover:text-primary transition-all"
                      >
                        {tool.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      Salin {tool.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>

          {/* Giscus Container */}
          <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-4 duration-700">
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
              <div className="h-60 w-full rounded-xl bg-muted/10 border-2 border-dashed border-muted flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                </div>
                <p className="text-sm font-medium animate-pulse">
                  Memuat komentar...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
