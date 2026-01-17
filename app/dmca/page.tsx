import { Mail, Gavel, FileWarning, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA & Disclaimer - Mugenime",
  description: "Informasi hak cipta dan disclaimer legal Mugenime.",
};

export default function DmcaPage() {
  return (
    <div className="min-h-screen pb-20 pt-8 bg-background">
      <div className="container mx-auto px-4 space-y-12 max-w-4xl">
        {/* --- HERO HEADER --- */}
        <div className="relative rounded-3xl bg-card border border-border p-8 md:p-12 shadow-sm overflow-hidden text-center group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary shadow-sm mb-2">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
              <span className="text-primary">DMCA</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
              Harap baca ketentuan hukum dan penyangkalan tanggung jawab berikut
              dengan seksama sebelum menggunakan layanan Mugenime.
            </p>
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="grid gap-8">
          {/* Section 1: General Disclaimer */}
          <div className="group p-6 md:p-8 rounded-2xl bg-muted/20 border border-border hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileWarning className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                General Disclaimer
              </h2>
            </div>

            <div className="prose dark:prose-invert text-sm text-muted-foreground space-y-4 leading-relaxed">
              <p>
                Mugenime adalah layanan penyedia indeks link video anime yang
                tersedia secara publik di internet. Kami{" "}
                <strong>TIDAK MENYIMPAN</strong> file video apapun di server
                kami sendiri.
              </p>
              <p>
                Semua konten video yang ditampilkan di situs ini diambil dari
                layanan pihak ketiga seperti{" "}
                <i>Otakudesu, Samehadaku, Kusonime, Sankavollerei</i>, dan
                layanan hosting video lainnya. Kami tidak memiliki kendali atas
                konten tersebut dan tidak bertanggung jawab atas isi dari konten
                yang disediakan oleh pihak ketiga.
              </p>
            </div>
          </div>

          {/* Section 2: Copyright & DMCA */}
          <div className="group p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Gavel className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Copyright & Takedown Notice
              </h2>
            </div>

            <div className="prose dark:prose-invert text-sm text-muted-foreground space-y-4 leading-relaxed">
              <p>
                Kami sangat menghormati Hak Kekayaan Intelektual (HAKI). Jika
                Anda adalah pemilik hak cipta yang sah atau agen yang berwenang,
                dan Anda percaya bahwa konten yang ada di situs kami melanggar
                hak cipta Anda, silakan hubungi kami.
              </p>
              <div className="bg-muted p-4 rounded-xl border border-border">
                <p className="font-semibold text-foreground mb-2">
                  Harap sertakan informasi berikut dalam laporan Anda:
                </p>
                <ul className="list-disc list-inside space-y-1 marker:text-primary">
                  <li>Nama lengkap dan afiliasi perusahaan (jika ada).</li>
                  <li>Bukti kepemilikan hak cipta yang sah.</li>
                  <li>
                    URL spesifik di situs kami yang memuat konten yang
                    dipermasalahkan.
                  </li>
                  <li>
                    Pernyataan resmi bahwa penggunaan konten tersebut tidak
                    diizinkan oleh pemilik hak cipta.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Contact Action (CTA) */}
          <div className="relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-10 rounded-3xl bg-primary text-primary-foreground text-center space-y-6 shadow-xl shadow-primary/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-background opacity-20 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm mb-2">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold font-heading">Hubungi Kami</h3>
              <p className="text-primary-foreground/90 text-sm md:text-base max-w-lg mx-auto">
                Kirimkan laporan DMCA atau pertanyaan legal lainnya melalui
                email kami. Kami berkomitmen untuk merespons dalam waktu 3x24
                jam kerja.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="relative z-10 bg-background text-primary hover:bg-muted font-bold rounded-full px-8 h-12 shadow-lg"
            >
              <Link href="mailto:mugenime.id@gmail.com">
                Kirim Email Laporan
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
