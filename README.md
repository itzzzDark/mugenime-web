<div align="center">
  <!-- Ganti link gambar di bawah dengan logo proyek Anda jika ada -->
  <a href="https://mugenime.vercel.app/"><img src="https://i.ibb.co.com/7JcFYF2Q/Mugenime-Logo-stroke.png" alt="Mugenime Logo" width="500"></a>
 
  
  <p>
    <strong>Modern Anime Streaming Platform</strong>
  </p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16"></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React 19"></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind v4"></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-Blue?style=flat-square&logo=typescript" alt="TypeScript"></a>
  </p>
</div>

<br />

## 📖 Deskripsi

Download dan streaming anime subtitle Indonesia lengkap dalam format Mp4 dan MKV dengan berbagai resolusi (360p, 480p, 720p, dan 1080p) di platform gratis, tanpa iklan yang mengganggu, dan hemat kuota.

---

## 📸 Preview

<!-- Ganti link gambar di bawah dengan Screenshot asli aplikasi Anda -->
<img width="1903" height="1079" alt="mugenimeweb" src="https://github.com/user-attachments/assets/949357e6-32b6-4ed3-a172-0b229530b89f" />


---

## 🚀 Fitur Utama

- **📚 Katalog Lengkap**: Akses ribuan anime, baik yang sedang tayang (*Ongoing*) maupun yang sudah tamat (*Completed*).
- **📥 Download Center**: Unduh anime per episode atau langsung satu paket (*Batch*) dengan berbagai pilihan resolusi.
- **📅 Jadwal Rilis**: Pantau anime favorit yang rilis setiap hari secara *real-time*.
- **🔍 Pencarian Cepat**: Fitur pencarian instan dengan *live suggestion*.
- **🔖 Riwayat & Bookmark**: Simpan progres tontonan dan anime favorit di perangkat lokal (**Local Storage**) tanpa perlu login.
- **🌗 Dark Mode**: Tampilan yang nyaman di mata dengan opsi tema gelap/terang.
- **📱 Responsive Design**: Tampilan optimal di Desktop, Tablet, dan Mobile.

---

## 🛠 Tech Stack

Project ini dibangun menggunakan ekosistem Next.js dan library modern untuk performa maksimal:

### Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Runtime**: React 19

### Styling & UI
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### State Management
- **Local State**: [Zustand](https://github.com/pmndrs/zustand) (History/Bookmark)

---

## 📂 Struktur Halaman (Sitemap)

Aplikasi ini memiliki struktur routing yang rapi menggunakan Next.js App Router:

| Path | Deskripsi |
| :--- | :--- |
| `/` | **Home Page** (Hero, Ongoing, Completed, Announcement) |
| `/anime/[slug]` | **Detail Anime** (Info, Sinopsis, List Episode, Batch Download) |
| `/watch/[slug]/[episodeSlug]` | **Streaming Room** (Player, Server Switcher, Download Link) |
| `/jadwal-anime` | **Jadwal Rilis** (Kalender rilis harian) |
| `/ongoing-anime` | **List Ongoing** (Daftar anime yang sedang tayang) |
| `/completed-anime` | **List Completed** (Daftar anime yang sudah tamat) |
| `/list-anime` | **A-Z Directory** (Indeks anime berdasarkan abjad) |
| `/genre-anime` | **Genre List** (Daftar semua genre) |
| `/genre-anime/[slug]` | **Genre Detail** (Filter anime berdasarkan genre) |
| `/search` | **Pencarian** (Hasil pencarian kata kunci) |
| `/guide/download` | **Panduan Download** (Tutorial cara unduh) |
| `/guide/streaming` | **Panduan Streaming** (Troubleshooting player) |
| `/dmca` | **Legal & DMCA** (Disclaimer hak cipta) |
| `/report` | **Lapor Masalah** (Pusat laporan link rusak/error) |

---

## ⚙ Instalasi & Menjalankan Project

Pastikan Anda sudah menginstal **Node.js (v20+)** dan **pnpm**.

### 1. Clone Repository
```bash
git clone https://github.com/Wakype/mugenime-web.git
cd mugenime-web
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Environment Variables
Buat file `.env.local` di root folder dan tambahkan konfigurasi berikut:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Base URL (Optional)
NEXT_PUBLIC_BASE_URL=YOUR_WEBSITE_BASE_URL_HERE
```

### 4. Jalankan Development Server
```bash
pnpm dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 5. Build untuk Production
```bash
pnpm build
pnpm start
```

---

## ⚠ Catatan Penting (API Rate Limit)

> **Peringatan:** Aplikasi ini menggunakan API pihak ketiga (Sanka Vollerei) yang memiliki batasan ketat.

*   **Rate Limit**: ~70 request / menit.
*   **Strategi**: Aplikasi ini telah dikonfigurasi menggunakan fitur caching bawaan Next.js (`revalidate`) untuk meminimalisir request ke server asli dan menghindari pemblokiran IP (IP Ban).
*   **Saran**: Jangan melakukan spam refresh atau load testing berlebihan pada environment production.

---

## 🤝 Kredit

*   **Data Anime**: Diambil dari API publik **Sanka Vollerei**.

---

## 📄 Lisensi

Project ini dibuat untuk tujuan pembelajaran dan edukasi. Hak cipta konten anime (gambar, video, sinopsis) sepenuhnya milik pemegang hak cipta asli dan produsen anime terkait.

<br />

<div align="center">
  Made with ❤️ and 🧅
</div>
