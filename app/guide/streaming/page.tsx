import { MonitorPlay, Settings, RefreshCcw, Layers } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panduan Streaming - Mugenime",
  description: "Cara menonton anime dan mengatasi masalah video error.",
};

export default function StreamingGuidePage() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-10 max-w-5xl">
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
              <MonitorPlay className="w-3.5 h-3.5" />
              Guide
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              Panduan <span className="text-primary">Streaming</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
              Video tidak bisa diputar? Buffering terus? Jangan panik. Pelajari
              cara menggunakan player di Mugenime dengan maksimal.
            </p>
          </div>
        </div>

        {/* --- TROUBLESHOOTING GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GuideCard
            icon={<Layers className="w-6 h-6" />}
            title="Pilih Server Terbaik"
            content="Mugenime menyediakan banyak server (VidHide, StreamWish, dll). Jika Server 1 lemot atau mati, langsung klik tab server lain di bawah player."
          />
          <GuideCard
            icon={<Settings className="w-6 h-6" />}
            title="Resolusi Video"
            content="Koneksi lambat? Pilih tab resolusi yang lebih rendah (360p atau 480p) untuk menghemat kuota dan mengurangi buffering."
          />
          <GuideCard
            icon={<RefreshCcw className="w-6 h-6" />}
            title="Refresh Halaman"
            content="Terkadang player mengalami 'timeout'. Coba refresh halaman browser kamu atau bersihkan cache jika video stuck."
          />
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="space-y-6 border-t border-border pt-10">
          <h2 className="text-2xl font-bold text-foreground">
            Masalah Umum (FAQ)
          </h2>

          <div className="grid gap-4">
            <FAQItem
              q="Video muncul tulisan 'Sandbox' atau 'Forbidden'?"
              a="Ini biasanya terjadi karena proteksi dari pihak ketiga. Solusinya: Klik tombol 'Buka Tab Baru' di atas player untuk membuka video langsung di sumber aslinya."
            />
            <FAQItem
              q="Apakah streaming di sini boros kuota?"
              a="Tergantung resolusi yang kamu pilih. Untuk hemat kuota, gunakan resolusi 360p atau 480p. Resolusi 720p dan 1080p memakan data lebih besar namun gambarnya jernih."
            />
            <FAQItem
              q="Kenapa subtitlenya tidak muncul?"
              a="Semua video di Mugenime sudah Hardsub (subtitle menempel di video). Jika tidak muncul, kemungkinan itu kesalahan server. Silakan lapor ke admin."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideCard({
  icon,
  title,
  content,
}: Readonly<{
  icon: React.ReactNode;
  title: string;
  content: string;
}>) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-muted/30 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary shadow-sm mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
    </div>
  );
}

function FAQItem({ q, a }: Readonly<{ q: string; a: string }>) {
  return (
    <div className="rounded-xl border border-border p-5 bg-card">
      <h4 className="font-bold text-foreground mb-2 flex items-start gap-2">
        <span className="text-primary">Q:</span> {q}
      </h4>
      <p className="text-sm text-muted-foreground ml-6">{a}</p>
    </div>
  );
}
