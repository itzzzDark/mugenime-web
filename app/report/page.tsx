"use client";

import { useState } from "react";
import { AlertTriangle, Copy, Check, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CommentSection from "@/components/commentSection";

export default function ReportPage() {
  const [copied, setCopied] = useState(false);

  const templateText = `Anime Title: [Anime Name]
Episode: [Episode Number]
Issue: [Broken Link / Video Error / Missing Subtitles]
Server (use if video player has issues): [VidHide / StreamWish / etc]
Additional Details: [Explain the details]
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(templateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-10 max-w-5xl">
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
              <AlertTriangle className="w-3.5 h-3.5" />
              Help Center
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              Report <span className="text-primary">Issues</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
              Found broken links, video errors, or episode naming issues? Help us improve by reporting them here.
            </p>
          </div>
        </div>

        {/* --- BAGIAN 1: PANDUAN & TEMPLATE (Grid Side-by-Side) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Kiri: Cara Melapor */}
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Info className="w-5 h-5 text-primary" />
                How to Report
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Follow the guide below so your report can be processed quickly by our team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-1">
                <li>Make sure your internet connection is stable.</li>
                <li>
                  Try refreshing or use a{" "}
                  <b className="text-foreground">Different Browser</b>.
                </li>
                <li>
                  Use the{" "}
                  <b className="text-foreground">&quot;Open in New Tab&quot;</b>{" "}
                  feature if the player has issues.
                </li>
                <li>Don&apos;t spam duplicate comments.</li>
                <li>Gunakan bahasa yang sopan.</li>
              </ul>
              <Alert className="bg-primary/5 border-primary/20 mt-4">
                <HelpCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">
                  Catatan
                </AlertTitle>
                <AlertDescription className="text-muted-foreground text-xs">
                  Laporan &quot;Batch&quot; error mungkin butuh waktu lebih lama
                  untuk diperbaiki.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Card Kanan: Template */}
          <Card className="border-border bg-card h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex justify-between items-center text-foreground">
                <span>Template Laporan</span>
                <Button
                  size="sm"
                  variant={copied ? "default" : "outline"}
                  className={
                    copied
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-background border-border text-foreground hover:bg-muted"
                  }
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-2" /> Disalin
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-2" /> Salin
                    </>
                  )}
                </Button>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Gunakan format ini agar mudah diidentifikasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="bg-muted p-4 rounded-lg border border-border font-mono text-xs md:text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed h-full">
                {templateText}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- BAGIAN 2: KOMENTAR (FULL WIDTH DI BAWAH) --- */}
        <div className="w-full">
          <CommentSection
            identifier="report-problem"
            title="Lapor Masalah"
            type="page"
          />
        </div>
      </div>
    </div>
  );
}
