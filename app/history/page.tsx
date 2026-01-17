import { History, Construction, ArrowLeft, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Tontonan - Mugenime",
  description: "Lacak riwayat anime yang telah Anda tonton.",
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-12">
        {/* --- HEADER SECTION --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
              <History className="w-3.5 h-3.5" />
              History
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              Riwayat <span className="text-primary">Tontonan</span>
            </h1>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
              History semua anime yang pernah kamu tonton agar tidak lupa sampai
              episode berapa.
            </p>
          </div>
        </div>

        {/* --- UNDER CONSTRUCTION STATE --- */}
        <div className="relative flex flex-col items-center justify-center min-h-[400px] text-center p-8 rounded-3xl border border-dashed border-border bg-muted/20 overflow-hidden">
          {/* Ambient Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
            {/* Icon Wrapper */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-card border border-border rounded-3xl flex items-center justify-center shadow-xl rotate-3 transition-transform hover:rotate-6">
                <Construction className="w-12 h-12 text-primary" />
              </div>
              {/* Floating Tool Icon */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg border-2 border-background -rotate-12">
                <Hammer className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
                🚧 Sedang Dibangun 🚧
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Fitur <b>History</b> sedang dikerjakan. Nantinya kamu bisa
                melihat episode terakhir yang kamu tonton di sini.
              </p>
            </div>

            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
              >
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
