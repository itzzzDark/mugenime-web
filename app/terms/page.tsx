import { Scale, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat Layanan - Mugenime",
  description: "Syarat dan ketentuan penggunaan layanan Mugenime.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-12 max-w-4xl">
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-card border border-border p-8 md:p-12 shadow-sm overflow-hidden text-center group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary shadow-sm mb-2">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
              Terakhir Diperbarui:{" "}
              {new Date().toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="space-y-8">
          <Section number="1" title="Penerimaan Syarat">
            <p>
              Dengan mengakses dan menggunakan situs web{" "}
              <strong>Mugenime</strong>, Anda menyetujui untuk terikat oleh
              syarat dan ketentuan ini, semua hukum dan peraturan yang berlaku,
              dan setuju bahwa Anda bertanggung jawab untuk mematuhi hukum
              setempat yang berlaku. Jika Anda tidak setuju dengan salah satu
              syarat ini, Anda dilarang menggunakan atau mengakses situs ini.
            </p>
          </Section>

          <Section number="2" title="Penafian (Disclaimer)">
            <p>
              Materi di situs web Mugenime disediakan &quot;sebagaimana
              adanya&quot;. Mugenime tidak memberikan jaminan, tersurat maupun
              tersirat, dan dengan ini menolak dan menegasikan semua jaminan
              lainnya, termasuk tanpa batasan, jaminan tersirat atau kondisi
              yang dapat diperjualbelikan, kesesuaian untuk tujuan tertentu,
              atau non-pelanggaran kekayaan intelektual atau pelanggaran hak
              lainnya.
            </p>
            <div className="mt-4 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg text-sm text-foreground">
              <strong>Penting:</strong> Mugenime tidak menyimpan file video apa
              pun di servernya. Semua konten disediakan oleh pihak ketiga yang
              tidak terafiliasi. Kami bertindak sebagai mesin pencari/indeks
              konten yang tersedia secara publik.
            </div>
          </Section>

          <Section number="3" title="Batasan">
            <p>
              Dalam hal apa pun Mugenime atau pemasoknya tidak akan bertanggung
              jawab atas kerusakan apa pun (termasuk, tanpa batasan, kerusakan
              karena hilangnya data atau keuntungan, atau karena gangguan
              bisnis) yang timbul dari penggunaan atau ketidakmampuan untuk
              menggunakan materi di situs web Mugenime.
            </p>
          </Section>

          <Section number="4" title="Revisi dan Errata">
            <p>
              Materi yang muncul di situs web Mugenime dapat mencakup kesalahan
              teknis, tipografi, atau fotografi. Mugenime tidak menjamin bahwa
              salah satu materi di situs webnya akurat, lengkap, atau terkini.
              Mugenime dapat membuat perubahan pada materi yang terdapat di
              situs webnya setiap saat tanpa pemberitahuan.
            </p>
          </Section>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="flex justify-center pb-10">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({
  number,
  title,
  icon,
  children,
}: Readonly<{
  number: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 md:p-8 hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold text-sm border border-border">
          {number}
        </span>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          {title}
          {icon}
        </h2>
      </div>
      <div className="text-sm md:text-base text-muted-foreground leading-relaxed pl-2 md:pl-11">
        {children}
      </div>
    </div>
  );
}
