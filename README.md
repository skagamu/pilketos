# Kiosk E-Voting OSIS Skagamu 🗳️

Single-Page Application (SPA) berbasis Kiosk untuk sistem pemilihan Ketua dan Wakil OSIS, dirancang khusus untuk layar sentuh atau laptop di bilik suara.

Aplikasi ini menggunakan teknologi real-time dengan keamanan level-kiosk (operator unlock) dan tampilan *Dashboard* hasil suara yang bergerak otomatis secara langsung.

## 🚀 Fitur Utama

- **Kiosk-Mode Lock System:** Layar terkunci secara default. Hanya operator yang mengetahui PIN yang bisa membuka layar untuk pemilih berikutnya.
- **One-Person-One-Vote Enforcement:** Kiosk otomatis terkunci kembali dalam 3 detik setelah pemilih mencoblos.
- **Real-Time Dashboard (/hasil):** Layar proyektor akan memperbarui grafik batang perolehan suara secara *real-time* (animasi halus) tanpa perlu *refresh* halaman.
- **Master PIN Protection:** Halaman Dashboard dilindungi oleh PIN Master untuk mencegah siswa mengintip perolehan suara sementara.
- **Fully Synchronized:** 100% tahan banting terhadap *desync*. Layar selalu selaras dengan isi *database* Supabase.

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v4
- **Backend & Database:** Supabase (PostgreSQL + Realtime Subscriptions)

## 📦 Panduan Menjalankan Secara Lokal

1. **Clone repository ini**
   ```bash
   git clone https://github.com/skagamu/pilketos.git
   cd pilketos
   ```

2. **Install dependensi**
   ```bash
   npm install
   ```

3. **Atur Environment Variables**
   Buat file bernama `.env.local` di *root folder*, lalu masukkan kunci API Supabase-mu:
   ```env
   VITE_SUPABASE_URL=https://<id-proyek>.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_<kunci-anon-kamu>
   ```

4. **Jalankan Server Lokal (Bisa diakses HP via LAN/Tailscale)**
   ```bash
   npm run dev -- --host
   ```
   *Buka `http://localhost:5173/` di browsermu.*

## 🔒 Konfigurasi Keamanan (Hardcoded)

Karena ini adalah sistem khusus sekolah (tanpa sistem akun rumit), keamanan disematkan di level aplikasi:
- **PIN Operator Bilik Suara:** `1234` (Digunakan di halaman utama `/` untuk membuka gembok bilik).
- **PIN Master Dashboard:** `9999` (Digunakan di halaman `/hasil` untuk melihat grafik).

*Catatan: PIN ini hardcoded di dalam `Kiosk.jsx` dan `Dashboard.jsx`. Ubah kode tersebut jika ingin mengganti PIN.*

## 📊 Manajemen Data (Supabase)

Aplikasi ini membaca dua tabel dari Supabase:
1. `candidates`: Berisi daftar nama, nomor urut, visi-misi, dan nama file foto paslon (misal: `paslon-1.jpeg`).
2. `votes`: Berisi ID dari paslon yang dicoblos beserta stempel waktu (`created_at`).

**Pengaturan RLS (Row Level Security):**
- Publik **diberi izin INSERT** ke tabel `votes` agar Kiosk bisa mengirim suara tanpa *login*.
- Publik **diberi izin SELECT** ke tabel `votes` agar layar Dashboard bisa menghitung total. Akses di level aplikasi sudah diblokir oleh "PIN Master", sehingga siswa tetap tidak bisa melihat hasilnya.

## 📷 Foto Paslon
Foto untuk masing-masing kandidat disimpan di dalam folder `public/assets/`. Pastikan nama file cocok dengan yang terdaftar di *database* Supabase (misal: `paslon-1.jpeg`).
