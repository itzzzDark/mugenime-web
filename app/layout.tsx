import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Mugenime - Nonton Anime Subtitle Indonesia Gratis",
  description:
    "Nonton anime subtitle Indonesia terbaru dan terlengkap secara gratis di Mugenime. Streaming anime favoritmu dengan kualitas HD tanpa iklan mengganggu.",
  icons: {
    icon: ["app/icon.png"],
    apple: ["app/icon.png"],
    shortcut: ["app/favicon.ico"],
  },
  metadataBase: new URL("https://www.mugenime.my.id"),
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body className="antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
        <NextTopLoader color="#4f39f6" />
        <Providers>
          <Navbar />
          <main>
            {children}
            <Toaster position="top-center" richColors />
            <Analytics />
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
