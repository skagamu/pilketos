# 📖 Buku Panduan Resmi: E-Voting OSIS

Panduan ini ditujukan bagi seluruh panitia yang bertugas pada hari pemilihan Ketua dan Wakil OSIS. Mohon dibaca dengan teliti agar acara berjalan dengan lancar, aman, dan tanpa kecurangan.

---

## 👥 Pembagian Peran
Sistem ini membagi pengguna menjadi 3 peran:
1. **Teknisi / IT Support** (Yang menyiapkan laptop & jaringan)
2. **Operator Bilik Suara** (Panitia yang berjaga di setiap laptop pemilih)
3. **Pengawas / Panitia Pusat** (Yang menjaga layar proyektor hasil)

---

## 🛠️ A. Panduan Setup Hari-H (Untuk Teknisi IT)
Lakukan ini **1 jam sebelum** acara pemilu dimulai:
1. **Reset Database:** Pastikan data ujicoba sudah dihapus dari Supabase (`DELETE FROM votes;`) sehingga total suara di web menunjukkan angka 0.
2. **Siapkan Laptop Kiosk (Bilik Suara):**
   - Buka browser (Chrome/Edge disarankan).
   - Buka alamat aplikasi utama (misal: `http://localhost:5173/` atau link web yang sudah di-hosting).
   - Tekan **F11** di keyboard untuk membuat browser menjadi *Layar Penuh (Fullscreen)* agar siswa tidak bisa menekan tombol *Back*, *Refresh*, atau menutup browser.
3. **Siapkan Laptop Proyektor (Dashboard Hasil):**
   - Buka browser.
   - Buka alamat URL dengan tambahan `/hasil` (misal: `http://localhost:5173/hasil`).
   - Tekan **F11** untuk *Fullscreen*.

---

## 💂‍♂️ B. Panduan Operator Bilik Suara (Sangat Penting)
Sebagai panitia yang menjaga laptop di bilik suara, tugasmu adalah memastikan prinsip *Satu Siswa, Satu Suara*.

**Kode PIN Operator: `1234`** *(TOLONG JANGAN DIBERIKAN KE SISWA!)*

**Alur Kerjamu:**
1. Layar laptop di bilik akan menampilkan gembok merah bertuliskan **"Bilik Suara Terkunci"**.
2. Saat pemilih (siswa) datang membawa undangan/kertas registrasi, **kamu (Panitia)** yang mengetikkan PIN `1234` dan menekan tombol **"Buka Bilik Suara"**.
3. Mundur dan biarkan siswa tersebut melihat layar (yang sekarang menampilkan daftar Paslon) untuk memilih.
4. Setelah siswa mencoblos, layar akan berubah menjadi HIJAU ("Terima Kasih!").
5. Dalam 3 detik, layar akan **Otomatis Terkunci Kembali** (kembali ke layar gembok merah).
6. Panggil siswa berikutnya, ketik PIN lagi. Ulangi terus sampai selesai.

⚠️ **Peringatan:** Jika siswa tidak sengaja memencet *Refresh* atau keluar aplikasi, masukkan PIN lagi untuk mereset biliknya.

---

## 👆 C. Panduan Pemilih (Siswa)
Ini adalah instruksi yang bisa kamu sampaikan ke siswa saat mereka masuk ke bilik:
1. Silakan gulir (scroll) ke bawah untuk membaca Visi dan Misi tiap Paslon.
2. Jika sudah yakin, tekan tombol biru besar **"COBLOS PASLON [Nomor]"**.
3. Akan muncul kotak peringatan untuk memastikan pilihan. Jika sudah yakin, tekan **"Yakin, Simpan"**.
4. Jika salah tekan, pilih **"Batal, Kembali"**.
5. Setelah menekan Yakin, tunggu sampai layar berwarna hijau (Terima Kasih). Pilihanmu sudah sah dan masuk ke server pusat! Silakan tinggalkan bilik.

---

## 📊 D. Panduan Pengawas / Panitia Proyektor
Untuk panitia yang menjaga tampilan proyektor di panggung atau ruang panitia pusat.

**Kode PIN Master: `9999`**

1. Pastikan laptop proyektor membuka halaman **Dashboard Hasil** (`/hasil`).
2. Layar akan meminta PIN. Masukkan `9999` lalu klik **"Lihat Hasil"**.
3. Layar akan menampilkan grafik batang yang bergerak secara langsung (*Live/Real-Time*).
4. **TUGASMU:** Hanya duduk manis dan biarkan layarnya terbuka! Kamu **TIDAK PERLU** menekan tombol *Refresh/F5* di keyboard. Setiap kali ada siswa yang nyoblos di bilik mana pun, grafiknya akan langsung memanjang sendiri secara otomatis.

---

## 🚨 E. Solusi Masalah Terduga (Troubleshooting)

| Masalah | Penyebab | Solusi |
| :--- | :--- | :--- |
| Muncul pesan "Gagal Menyimpan Suara" saat siswa nyoblos. | Internet laptop di bilik terputus. | Jangan panik. Minta siswa menunggu. Cek koneksi Wi-Fi/Tethering laptop tersebut. Setelah internet nyala, suruh siswa klik "Yakin, Simpan" lagi. |
| Grafik di Proyektor diam saja, padahal banyak siswa yang nyoblos. | Internet laptop proyektor terputus (atau *sleep*). | Cek koneksi internet laptop proyektor, lalu tekan tombol **Refresh (F5)** sekali untuk menyingkronkan ulang data yang tertinggal. |
| Layar bilik suara nyangkut di "Loading...". | Database sedang sibuk atau internet *lag*. | Tekan tombol *Refresh* (F5) pada laptop tersebut, lalu masukkan PIN `1234` untuk membuka kembali biliknya. Suara yang sudah masuk tidak akan terhapus. |
| Ada siswa yang tahu PIN 1234. | Panitia kurang rapat menutupi keyboard. | Ganti panitia/tegaskan panitia agar memutar laptop ke arahnya saat mengetik PIN, jangan sampai dilihat dari belakang. |

---
*Semoga sukses! Pastikan keadilan dan transparansi selalu terjaga selama masa pemilihan berlangsung.* 🚀
