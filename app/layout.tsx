import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { AdminProvider } from "@/lib/admin-context";

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
  title: "Mugenime - Free Anime Streaming",
  description:
    "Watch the latest anime with subtitles on Mugenime. Stream your favorite anime in HD quality without ads.",
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
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AdminProvider>
            <AuthProvider>
              <NextTopLoader color="#4f39f6" />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <Toaster position="top-center" richColors />
              <Analytics />
            </AuthProvider>
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
