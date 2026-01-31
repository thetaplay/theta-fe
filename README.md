# Nawasena

Nawasena adalah aplikasi opsi yang ramah pengguna dan **digamifikasi**. Tujuannya membuat belajar dan mencoba strategi opsi terasa ringan, jelas, dan menyenangkan melalui quest, XP, level, dan streak harian.

## Ringkasan Fitur
- **Pembelajaran Opsi yang Ramah**: materi ringkas, artikel, video, dan kuis agar konsep opsi mudah dipahami.
- **Daily Quests**: tugas harian dengan progres langkah per langkah.
- **XP & Level**: klaim XP dari quest, naik level otomatis, progres tersimpan.
- **Streak Harian**: klaim XP sekali sehari untuk menjaga streak.
- **Market Overview**: ringkasan sentimen pasar dan data harga.
- **Simulasi Trading**: latihan eksekusi trade dengan UI yang familiar.
- **Branding Nawasena**: identitas visual konsisten di seluruh aplikasi.

## Teknologi yang Digunakan
- **Next.js 16 (App Router)**
- **React 19 + TypeScript**
- **Tailwind CSS**
- **Viem / Wagmi**
- **OnchainKit**

## Struktur Utama
- `app/` – halaman utama (Home, Learn, Trade, Event, Profile)
- `components/` – komponen UI dan layout
- `hooks/` – custom hooks (termasuk XP system)
- `lib/` – utilitas, integrasi blockchain, AI helper
- `public/` – aset statis seperti logo

## Cara Menjalankan
1. Install dependencies:
   - `pnpm install`
2. Jalankan mode development:
   - `pnpm dev`
3. Build untuk production:
   - `pnpm build`
4. Jalankan production build:
   - `pnpm start`

## Cara Penggunaan XP (Gamifikasi)
- Selesaikan seluruh langkah quest.
- Setelah semua langkah selesai, tombol **Claim XP** muncul.
- XP masuk ke akun dan level naik otomatis bila melewati batas.
- Streak bertambah jika klaim dilakukan **sekali per hari**.

## Catatan Pengembangan
- Sistem XP tersimpan di `localStorage`.
- Logo ada di `public/logo/Logo-Nawasena.png`.
- Metadata aplikasi ada di `app/layout.tsx`.

## Pembuat
Project ini dibangun sebagai aplikasi opsi yang **ramah dan gamified**, dengan fokus mobile-first, UI modern, dan mekanisme quest untuk meningkatkan engagement pengguna.
