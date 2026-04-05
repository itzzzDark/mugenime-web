import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const revalidate = 3600;

export default async function JadwalPage() {
  const daysMap: { [key: number]: string } = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
    0: "Minggu",
  };
  const todayIndex = new Date().getDay();
  const currentDayName = daysMap[todayIndex];

  const defaultTab = currentDayName;

  return (
    <div className="min-h-screen bg-background pb-20 py-10">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HERO HEADER SECTION (PREMIUM) --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* 1. BACKGROUND DECORATION */}
          {/* Grid Pattern Halus - menggunakan currentColor */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />

          {/* Gradient Blobs (Kiri & Kanan) - menggunakan Primary */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            {/* --- KIRI: KONTEN UTAMA --- */}
            <div className="space-y-6 max-w-2xl flex-1">
              <div className="space-y-3">
                {/* Label Kecil */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                  <Calendar className="w-3.5 h-3.5" />
                  Weekly Update
                </div>

                {/* Judul dengan Gradient Text */}
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                  <span className="text-primary">Jadwal Rilis</span> Anime
                </h1>

                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                  Pantau jadwal tayang anime terbaru yang diperbarui secara
                  otomatis setiap minggu. Arahkan kursor ke poster untuk melihat
                  detail genre dan durasi.
                </p>
              </div>

              {/* Modern Alert Box */}
              <div className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 backdrop-blur-sm">
                <div className="shrink-0">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Catatan</p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                    Terkadang anime yang statusnya sudah{" "}
                    <span className="font-semibold text-primary">
                      Completed (Tamat)
                    </span>{" "}
                    masih muncul di daftar jadwal{" "}
                    <span className="font-semibold text-primary">
                      Ongoing (Sedang Tayang)
                    </span>{" "}
                    ini karena bug pada sistem. Harap maklum! 🙏
                  </p>
                </div>
              </div>
            </div>

            {/* --- KANAN: WIDGET HARI (Calendar Style) --- */}
            <div className="shrink-0 w-full lg:w-auto">
              <div className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border shadow-sm overflow-hidden lg:min-w-[200px]">
                {/* Dekorasi Background Halus */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-primary/10" />

                {/* Label Atas */}
                <div className="relative z-10 flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  <Calendar className="w-3 h-3" />
                  HARI INI
                </div>

                {/* Nama Hari Besar */}
                <div className="relative z-10">
                  <span className="text-4xl md:text-5xl font-black tracking-tighter text-primary">
                    {currentDayName}
                  </span>
                </div>

                {/* Tanggal Lengkap (Formatted) */}
                <div className="relative z-10 mt-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <p className="text-xs font-semibold text-primary">
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Fitur jadwal anime sedang dalam pengembangan. Harap periksa kembali nanti untuk melihat jadwal tayang anime terbaru.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
