# DESAIN LAPOR POSBANKUM!

Dokumen desain tampilan, komponen, dan database untuk website pengaduan Posbankum Kelurahan Mangunsari. Mengacu pada PRD LAPOR POSBANKUM! v0.1 (bagian nomor merujuk ke PRD).

Versi 0.1 (draf) · 15 Oktober 2026

## 1. Stack

| Lapisan | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js (App Router) | Server Components untuk halaman publik, Server Actions untuk form |
| UI | HeroUI v3 (`@heroui/react`, `@heroui/styles`) + Tailwind CSS v4 | HeroUI v3 stabil dan memakai Tailwind v4. Navbar bawaan tidak ada di v3, jadi `SiteHeader` dibuat sendiri |
| Database | PostgreSQL | Skema di bagian 10 |
| ORM | Drizzle ORM (usulan; Prisma juga bisa) | Tipe aman, migrasi SQL sederhana |
| Validasi | Zod | Skema yang sama dipakai di klien dan server |
| Auth admin | Sesi cookie httpOnly + kata sandi argon2id (usulan) | Pembatasan percobaan login; 2FA fase berikutnya |
| File lampiran | Penyimpanan privat (disk server atau S3-compatible), bukan folder publik | Diunduh lewat route yang mengecek hak akses |

Catatan: nama komponen dan props HeroUI mengikuti dokumentasi v3 di heroui.com. Cek dokumentasinya saat implementasi, karena API v3 berbeda dari v2 (`HeroUIProvider` dan Navbar v2 tidak berlaku).

## 2. Prinsip Desain

1. **Tenang dan tepercaya.** Banyak pelapor sedang dalam situasi sulit. Hindari warna mencolok, animasi, dan bahasa yang menekan.
2. **Satu tugas per layar.** Form dibagi tiga langkah, satu hal dibahas setiap kali.
3. **Mobile-first.** Pelapor kebanyakan memakai HP. Satu kolom, tombol besar (tinggi minimal 44 px).
4. **Bahasa sederhana.** Label menyebut apa yang terjadi ("Kirim laporan"), bukan istilah teknis.
5. **Aman secara visual.** Tombol keluar cepat selalu terlihat di alur pelaporan, dan tidak ada isi laporan di URL.
6. **Satu komponen untuk satu fungsi.** Hal yang sama selalu memakai komponen yang sama (bagian 5).

## 3. Warna (diambil dari logo)

Logo memakai hijau perisai `#1F5A4B`, emas `#C9962B`, krem `#F7F3E8`, dan abu-hijau tua `#3C4A45` untuk teks.

### 3.1 Token dasar

| Token | Hex | Pemakaian |
|---|---|---|
| `brand-600` | `#1F5A4B` | Warna utama: tombol utama, judul, tautan, header |
| `gold-500` | `#C9962B` | Aksen: garis, ikon, penanda. **Bukan untuk teks** |
| `cream-100` | `#F7F3E8` | Latar seksi, kartu panduan, teks di atas hijau |
| `ink-700` | `#3C4A45` | Teks isi |
| `white` | `#FFFFFF` | Latar halaman dan kartu |

### 3.2 Skala turunan

| Langkah | Hijau (`brand`) | Emas (`gold`) |
|---|---|---|
| 50 | `#EAF3F0` | `#FBF4E2` |
| 100 | `#CFE3DC` | `#F5E4B8` |
| 200 | `#A2C8BB` | `#EBCF8A` |
| 300 | `#6FA796` | `#E3BD62` |
| 400 | `#3F8470` | `#D6A840` |
| 500 | `#2A6B59` | `#C9962B` |
| 600 | `#1F5A4B` | `#A87A1E` |
| 700 | `#184739` | `#865F17` |
| 800 | `#12352B` | `#644711` |
| 900 | `#0B231C` | `#42300B` |

### 3.3 Warna status laporan

| Status | Latar (Chip) | Teks | Arti |
|---|---|---|---|
| Diterima | `#E8EEF5` | `#2C4A6B` | Baru masuk |
| Diverifikasi | `#FBF4E2` | `#865F17` | Sedang diperiksa |
| Ditindaklanjuti | `#EAF3F0` | `#184739` | Sedang ditangani |
| Selesai | `#1F5A4B` | `#F7F3E8` | Ditutup |
| Dirujuk | `#EEE9F5` | `#4A3A6B` | Diteruskan ke pihak lain |
| Ditolak / di luar kewenangan | `#F6E6E3` | `#8A2E24` | Tidak dapat diproses, dengan alasan |

Penanda kategori **Khusus** memakai ikon perisai kecil berwarna `gold-600` di samping nama kategori, bukan warna merah, supaya tidak menakutkan pelapor.

### 3.4 Aturan kontras

- Teks isi `#3C4A45` di atas putih dan krem memenuhi kontras WCAG AA.
- Teks putih atau krem hanya di atas `brand-600` atau lebih gelap.
- Emas tidak dipakai untuk teks atau latar tombol dengan teks putih (kontrasnya rendah). Teks di atas emas memakai `#42300B`.
- Fokus keyboard: cincin 2 px `gold-500` dengan offset 2 px, terlihat di semua komponen.

### 3.5 Pengaturan tema (Tailwind v4, CSS-first)

```css
/* app/globals.css */
@import "tailwindcss";
@import "@heroui/styles";

@theme {
  --color-brand-50: #EAF3F0;
  --color-brand-100: #CFE3DC;
  --color-brand-200: #A2C8BB;
  --color-brand-300: #6FA796;
  --color-brand-400: #3F8470;
  --color-brand-500: #2A6B59;
  --color-brand-600: #1F5A4B;
  --color-brand-700: #184739;
  --color-brand-800: #12352B;
  --color-brand-900: #0B231C;

  --color-gold-50: #FBF4E2;
  --color-gold-100: #F5E4B8;
  --color-gold-300: #E3BD62;
  --color-gold-500: #C9962B;
  --color-gold-600: #A87A1E;
  --color-gold-700: #865F17;

  --color-cream-100: #F7F3E8;
  --color-ink-700: #3C4A45;

  --radius-card: 12px;
  --radius-control: 10px;
}

/* Hubungkan warna utama HeroUI ke token brand.
   Nama variabel tema HeroUI v3 (misalnya variabel accent) dicek di dokumentasi tema,
   lalu diarahkan ke brand-600 (utama) dan gold-500 (aksen). */
```

## 4. Tipografi dan Bentuk

- **Font:** Plus Jakarta Sans lewat `next/font/google` (satu keluarga; bobot 400, 500, 700). Cadangan: `system-ui, sans-serif`. Logo memakai font sistem, jadi sebaiknya logo diubah ke outline sebelum dicetak.
- **Skala:** 14 / 16 (isi) / 18 / 20 / 24 / 32 / 40 px. Isi form minimal 16 px agar HP tidak memperbesar otomatis saat mengetik.
- **Judul:** bobot 700, warna `brand-600`. Isi: bobot 400, warna `ink-700`, line-height 1.6.
- **Panjang baris:** maksimal 70 karakter pada teks panduan.
- **Sudut:** kartu 12 px, kontrol 10 px (meniru lengkung perisai pada logo). Tidak memakai bayangan tebal; kartu dibedakan dengan garis `brand-100` setebal 1 px.
- **Jarak:** kelipatan 4 px. Jarak antar bagian halaman 48 px (mobile 32 px).

## 5. Komponen

Semua komponen berada di `src/components/`. Aturannya: bila sebuah pola dipakai di dua tempat atau lebih, harus berupa komponen. Komponen membungkus komponen HeroUI supaya warna, ukuran, dan perilaku konsisten.

### 5.1 Fondasi dan tata letak

| Komponen | Fungsi | Basis HeroUI | Dipakai di |
|---|---|---|---|
| `AppLogo` | Memuat SVG logo (varian lambang saja atau dengan tulisan) | Tidak ada (SVG) | Header, footer, login |
| `SiteHeader` | Bar atas publik: logo, Tentang, Panduan, Login. Menu ringkas di HP | Dibuat sendiri (HTML semantik + Button) | Semua halaman publik |
| `AdminShell` | Sidebar dan topbar admin, menu menurut peran | Dibuat sendiri + Button, Avatar, Dropdown | Semua halaman admin |
| `PageContainer` | Lebar maksimal dan padding halaman | Tidak ada | Semua |
| `SectionHeading` | Judul seksi dengan garis emas pendek | Tidak ada | Beranda, Tentang, Panduan |
| `SiteFooter` | Alamat kelurahan, hotline, tautan privasi | Tidak ada | Publik |

### 5.2 Aksi dan umpan balik

| Komponen | Fungsi | Basis HeroUI |
|---|---|---|
| `AppButton` | Varian: `primary` (hijau), `secondary` (garis hijau), `ghost`, `danger`. Ukuran besar sebagai default di HP | Button |
| `QuickExitButton` | Tombol tetap di pojok alur pelaporan; klik atau tekan Esc dua kali membuka situs netral dan mengganti riwayat | Button |
| `InfoCallout` | Kotak informasi: `info` (panduan), `warning` (batas layanan), `emergency` (nomor darurat) | Alert |
| `Toast` | Konfirmasi singkat (disalin, tersimpan) | Toast |
| `ConfirmDialog` | Konfirmasi tindakan (ubah status, hapus, pindah divisi) | Modal |
| `EmptyState` | Tampilan kosong dengan ajakan bertindak | Tidak ada |

### 5.3 Form

| Komponen | Fungsi | Basis HeroUI |
|---|---|---|
| `FormField` | Pembungkus: label, tanda wajib, petunjuk, pesan galat, penghitung karakter | Field/TextField |
| `TextInputField` | Teks satu baris (nama, alamat, judul, lokasi) | Input |
| `PhoneField` | Nomor WhatsApp, format dan validasi 08xx atau +62 | Input |
| `TextAreaField` | Isi laporan atau konsultasi, dengan penghitung karakter | Textarea |
| `SelectField` | Kategori, divisi, peran, status | Select |
| `DateField` | Tanggal kejadian (tidak boleh masa depan) | DatePicker |
| `ChoiceCard` | Kartu pilihan besar untuk jenis laporan (Pengaduan/Konsultasi) dan metode (tatap muka/daring) | RadioGroup |
| `AnonymousSwitch` | Mengaktifkan lapor anonim; menyembunyikan kolom identitas | Switch |
| `FileDropzone` | Unggah lampiran dengan daftar file, batas ukuran dan jenis | Dibuat sendiri + Button, Progress |
| `ConsentCheckbox` | Persetujuan pengolahan data dengan tautan kebijakan privasi | Checkbox |
| `Stepper` | Indikator tahap 1 sampai 3 di bawah form | Dibuat sendiri |
| `FormActions` | Baris tombol Kembali dan Selanjutnya/Kirim | AppButton |

### 5.4 Data laporan

| Komponen | Fungsi | Basis HeroUI |
|---|---|---|
| `StatusBadge` | Menampilkan status dengan warna di 3.3 | Chip |
| `CategoryBadge` | Nama kategori, dengan ikon perisai bila **Khusus** | Chip |
| `TicketCode` | Kode tiket dalam huruf monospace dengan tombol salin | Button, Tooltip |
| `ReportSummaryCard` | Ringkasan laporan (judul, kategori, status, tanggal) | Card |
| `StatusTimeline` | Riwayat status. Mode pelapor hanya menampilkan catatan yang terlihat | Dibuat sendiri |
| `DataTable` | Tabel admin: urut, filter, halaman, baris dapat diklik | Table, Pagination |
| `FilterBar` | Filter jenis, kategori, status, divisi, tanggal, pencarian kode tiket | Select, Input, DatePicker |
| `StatCard` | Angka ringkas di dashboard | Card |
| `DueIndicator` | Penanda sisa waktu respons 24 jam dan penyelesaian 7 hari (normal, hampir lewat, lewat) | Chip |
| `AttachmentList` | Daftar lampiran dengan unduhan terjaga | Card/Link |
| `RoleBadge` | Peran pengguna | Chip |

Aturan pemakaian: status selalu `StatusBadge`, kategori selalu `CategoryBadge`, kode tiket selalu `TicketCode`, kotak informasi selalu `InfoCallout`, dan tombol selalu `AppButton`. Tidak ada gaya status atau tombol buatan di halaman.

## 6. Halaman Publik

### 6.1 Beranda `/`

```
+--------------------------------------------------+
| [Logo]                    Tentang  Panduan  Login |  SiteHeader
+--------------------------------------------------+
|                                                  |
|        [Logo besar]                              |
|   LAYANAN PENGADUAN                              |
|   POS BANTUAN HUKUM KELURAHAN MANGUNSARI         |
|   Kalimat singkat: apa yang bisa dilakukan       |
|                                                  |
|        [ Lapor ]    [ Cek status laporan ]       |  AppButton primary + secondary
|                                                  |
+--------------------------------------------------+
|  Cara kerja (3 langkah)                          |  SectionHeading + kartu
|  1 Isi form   2 Dapat kode tiket   3 Pantau      |
+--------------------------------------------------+
|  [InfoCallout warning] Batas layanan             |
|  [InfoCallout emergency] Nomor darurat           |
+--------------------------------------------------+
|  Footer + hotline WhatsApp                       |
+--------------------------------------------------+
```

- Judul memakai teks dari konsep awal: LAYANAN PENGADUAN POS BANTUAN HUKUM KELURAHAN MANGUNSARI.
- Halaman satu kolom yang di-scroll ke bawah, sesuai konsep awal.
- Tombol **Lapor** membuka lembar panduan (6.2).

### 6.2 Lembar Panduan `/lapor` (sebelum form)

- `InfoCallout` berisi isi panduan pengaduan (teks dari halaman Panduan, satu sumber).
- Memuat batas layanan, nomor darurat, dan penjelasan lapor anonim.
- Tombol **Lanjutkan** membuka form. Lembar ini tidak muncul lagi di sesi yang sama setelah dilewati.

### 6.3 Form Pelaporan `/lapor/form`

`QuickExitButton` tampil di pojok. `Stepper` berada di bawah form (sesuai konsep awal). Data tiap langkah disimpan di memori sesi dan tidak dikirim sebelum langkah 2 selesai.

**Langkah 1 — Identitas**

```
Pilih cara melapor
[ ] Lapor anonim (tanpa nama dan kontak)         AnonymousSwitch
--------------------------------------------------
Nama *            [__________________]            TextInputField
Alamat *          [__________________]            TextInputField
No. WhatsApp *    [__________________]            PhoneField
Email *           [__________________]            TextInputField
                                    [ Selanjutnya ]
Stepper:  (1)---( 2 )---( 3 )
```

Jika anonim aktif, empat kolom identitas disembunyikan dan tidak wajib. Ada keterangan: "Anda tetap mendapat kode tiket dan PIN untuk mengecek status."

**Langkah 2 — Laporan**

```
Jenis laporan *       [ Pengaduan ]  [ Konsultasi ]      ChoiceCard
Kategori *            [ pilih kategori v ]               SelectField
-- Pengaduan --
Judul *               [__________________]
Isi laporan *         [__________________]  0/2000
Tanggal kejadian *    [ dd/mm/yyyy ]                      DateField
Lokasi kejadian *     [__________________]
Lampiran (opsional)   [ tarik file atau pilih ]           FileDropzone
-- Konsultasi --
Judul konsultasi *    [__________________]
Isi konsultasi *      [__________________]
Metode *              [ Tatap muka ]  [ Daring ]          ChoiceCard
--------------------------------------------------
[x] Saya menyetujui pengolahan data saya...  *            ConsentCheckbox
                         [ Kembali ]  [ Kirim laporan ]
```

- Daftar kategori mengikuti jenis yang dipilih (lihat 6.7 PRD). Memilih kategori **Khusus** menampilkan `InfoCallout` lembut berisi nomor rujukan.
- Kolom wajib ditandai `*`. Galat tampil di bawah kolom dengan teks yang menjelaskan cara memperbaiki.

**Langkah 3 — Selesai**

```
 Laporan Anda sudah kami terima
 Kode tiket   [ LP-7K3M9QXD ]  [Salin]                    TicketCode
 PIN          [ 482 915 ]  (hanya ditampilkan sekali)
 Simpan kode tiket dan PIN untuk mengecek status.
 Kami merespons maksimal 24 jam. Penyelesaian maksimal 7 hari.
 Butuh cepat? Hubungi hotline WhatsApp: 0812-3456-7890
                     [ Cek status ]  [ Kembali ke beranda ]
```

Kode tiket dan PIN tidak dikirim lewat email atau WhatsApp otomatis dengan isi laporan (PRD 9.2).

### 6.4 Cek Status `/cek-status`

- Form: kode tiket dan PIN (`FormField` + `AppButton`).
- Hasil: `StatusBadge`, ringkasan singkat (judul dan kategori), `StatusTimeline` hanya dengan catatan terlihat pelapor, dan sisa waktu.
- Galat memakai kalimat umum ("Kode tiket atau PIN tidak cocok") agar tiket tidak dapat ditebak.
- Pembatasan percobaan per perangkat dan IP.

### 6.5 Tentang `/tentang` dan Panduan `/panduan`

- Isi diambil dari tabel `content_pages` (bagian 10) sehingga dapat diedit admin.
- `SectionHeading` + teks berformat, daftar anggota Posbankum memakai `Card`.
- Halaman Panduan dan lembar panduan 6.2 memakai sumber isi yang sama.

### 6.6 Login `/login`

- Kartu di tengah: `AppLogo`, email, kata sandi, tombol Masuk.
- Tidak ada tautan pendaftaran. Akun dibuat admin.

## 7. Halaman Admin

Semua di bawah `/admin`, menu menyesuaikan peran. Tampilan memakai `AdminShell` dengan sidebar hijau tua (`brand-800`) dan teks krem.

| Halaman | Isi | Komponen utama | Peran |
|---|---|---|---|
| `/admin` Dashboard | Jumlah laporan baru, hampir lewat waktu, per status, per kategori | StatCard, DueIndicator, DataTable ringkas | Semua (isi menurut hak akses) |
| `/admin/laporan` | Daftar laporan dengan filter | FilterBar, DataTable, StatusBadge, CategoryBadge, DueIndicator | Admin, Lurah, Paralegal |
| `/admin/laporan/[id]` | Detail, lampiran, riwayat, ubah status, catatan, pindah divisi | ReportSummaryCard, AttachmentList, StatusTimeline, SelectField, TextAreaField, ConfirmDialog | Admin, Lurah, Paralegal |
| `/admin/kategori` | Master kategori: nama, jenis, Khusus, divisi tujuan | DataTable, FormField, SelectField | Admin |
| `/admin/divisi` | Master divisi dan kategori yang ditautkan | DataTable, FormField | Admin |
| `/admin/pengguna` | Akun paralegal dan divisinya, aktif atau nonaktif | DataTable, RoleBadge, ConfirmDialog | Admin |
| `/admin/konten` | Edit Tentang, Panduan, Kebijakan Privasi, hotline | TextAreaField, AppButton | Admin |
| `/admin/rekap` | Rekap bulanan per kategori dan status (ekspor menyusul) | StatCard, DataTable | Admin, Lurah, Pemantau |

Halaman detail laporan:

```
+------------------------------------------------------+
| LP-7K3M9QXD   [StatusBadge]  [CategoryBadge Khusus]  |
| Diterima 15 Okt 2026 · Sisa respons 18 jam [Due]     |
+-------------------------------+----------------------+
| Judul dan isi laporan         | Pelapor (atau        |
| Tanggal dan lokasi kejadian   | "Anonim")            |
| Lampiran [AttachmentList]     | Divisi: [SelectField]|
|                               | Ubah status [Select] |
| Riwayat [StatusTimeline]      | Catatan [TextArea]   |
|                               | [x] Terlihat pelapor |
|                               | [ Simpan ]           |
+-------------------------------+----------------------+
```

Setiap pembukaan detail laporan dicatat di `access_logs`.

## 8. Perilaku dan Validasi

| Hal | Aturan |
|---|---|
| Nama | Wajib (non-anonim), 3 sampai 100 karakter |
| Alamat | Wajib (non-anonim), 5 sampai 255 karakter |
| WhatsApp | Wajib (non-anonim), format Indonesia (08xx atau +62), 9 sampai 15 digit |
| Email | Wajib (non-anonim), format email valid |
| Judul | Wajib, 5 sampai 150 karakter |
| Isi | Wajib, 20 sampai 5000 karakter |
| Tanggal kejadian | Wajib untuk pengaduan, tidak boleh masa depan |
| Lokasi | Wajib untuk pengaduan, sampai 255 karakter |
| Metode konsultasi | Wajib untuk konsultasi |
| Lampiran | Maksimal 5 file, masing-masing 5 MB; JPG, PNG, PDF; dipindai tipe sebenarnya (bukan hanya ekstensi) |
| Persetujuan | Wajib dicentang, versi dan waktu disimpan |
| Spam | Captcha dan pembatasan 5 kiriman per jam per IP |

Angka di atas usulan awal dan dapat diubah kelurahan.

## 9. Struktur Proyek Next.js

```
src/
  app/
    (publik)/
      page.tsx                 # Beranda
      lapor/page.tsx           # Lembar panduan
      lapor/form/page.tsx      # Form 3 langkah
      cek-status/page.tsx
      tentang/page.tsx
      panduan/page.tsx
      kebijakan-privasi/page.tsx
    (auth)/login/page.tsx
    admin/
      layout.tsx               # AdminShell + cek sesi dan peran
      page.tsx
      laporan/page.tsx
      laporan/[id]/page.tsx
      kategori/page.tsx
      divisi/page.tsx
      pengguna/page.tsx
      konten/page.tsx
      rekap/page.tsx
    api/lampiran/[id]/route.ts # Unduh lampiran dengan cek hak akses
    globals.css
    layout.tsx
  components/
    ui/        # AppButton, InfoCallout, ConfirmDialog, EmptyState, Toast
    layout/    # AppLogo, SiteHeader, SiteFooter, AdminShell, PageContainer, SectionHeading
    forms/     # FormField, TextInputField, PhoneField, TextAreaField, SelectField,
               # DateField, ChoiceCard, AnonymousSwitch, FileDropzone, ConsentCheckbox,
               # Stepper, FormActions, QuickExitButton
    report/    # StatusBadge, CategoryBadge, TicketCode, ReportSummaryCard,
               # StatusTimeline, AttachmentList, DueIndicator
    admin/     # DataTable, FilterBar, StatCard, RoleBadge
  lib/
    db/        # koneksi, skema Drizzle, migrasi
    auth/      # sesi, hash kata sandi, cek peran
    validators/# skema Zod
    tickets.ts # pembuatan kode tiket dan PIN
    retention.ts # penghapusan terjadwal
  actions/     # Server Actions: kirimLaporan, ubahStatus, pindahDivisi, kelolaAkun, ...
public/
  logo-posbankum-mangunsari.svg
```

Aturan akses disimpan terpusat di `lib/auth` (fungsi `canViewReport(user, report)`), dipakai semua halaman, Server Action, dan route unduhan.

## 10. Database PostgreSQL

### 10.1 Ringkasan tabel

| Tabel | Isi |
|---|---|
| `divisions` | Master divisi paralegal |
| `categories` | Master kategori, penanda Khusus, divisi tujuan |
| `users` | Akun admin, Lurah, paralegal, pemantau |
| `reports` | Laporan dan konsultasi (identitas pelapor ikut di sini; kosong bila anonim) |
| `attachments` | Lampiran per laporan |
| `report_events` | Riwayat status, catatan, dan pemindahan divisi |
| `content_pages` | Isi halaman Tentang, Panduan, Kebijakan Privasi |
| `site_settings` | Pengaturan seperti nomor hotline dan nomor darurat |
| `access_logs` | Log siapa membuka laporan apa |

### 10.2 Skema (DDL)

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role     AS ENUM ('admin', 'lurah', 'paralegal', 'pemantau');
CREATE TYPE report_kind   AS ENUM ('pengaduan', 'konsultasi');
CREATE TYPE kind_scope    AS ENUM ('pengaduan', 'konsultasi', 'keduanya');
CREATE TYPE consult_mode  AS ENUM ('tatap_muka', 'daring');
CREATE TYPE report_status AS ENUM
  ('diterima', 'diverifikasi', 'ditindaklanjuti', 'selesai', 'dirujuk', 'ditolak');

CREATE TABLE divisions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  description text,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  applies_to  kind_scope NOT NULL DEFAULT 'keduanya',
  is_special  boolean NOT NULL DEFAULT false,   -- penanganan khusus
  division_id uuid NOT NULL REFERENCES divisions(id),
  sort_order  int NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true
);

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role          user_role NOT NULL,
  division_id   uuid REFERENCES divisions(id),   -- wajib untuk paralegal
  is_active     boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT paralegal_needs_division
    CHECK (role <> 'paralegal' OR division_id IS NOT NULL)
);

CREATE TABLE reports (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_code        text NOT NULL UNIQUE,         -- contoh: LP-7K3M9QXD
  lookup_pin_hash    text NOT NULL,                -- PIN cek status, disimpan ter-hash
  kind               report_kind NOT NULL,
  category_id        uuid NOT NULL REFERENCES categories(id),
  division_id        uuid NOT NULL REFERENCES divisions(id),  -- disalin dari kategori, bisa dipindah
  is_special         boolean NOT NULL DEFAULT false,          -- disalin dari kategori
  title              text NOT NULL,
  body               text NOT NULL,
  incident_date      date,
  incident_location  text,
  consult_mode       consult_mode,
  is_anonymous       boolean NOT NULL DEFAULT false,
  reporter_name      text,
  reporter_address   text,
  reporter_phone     text,
  reporter_email     text,
  status             report_status NOT NULL DEFAULT 'diterima',
  first_response_at  timestamptz,
  respond_due_at     timestamptz NOT NULL,         -- dibuat + 24 jam
  resolve_due_at     timestamptz NOT NULL,         -- dibuat + 7 hari
  closed_at          timestamptz,
  purge_after        timestamptz,                  -- closed_at + masa retensi (PRD 9.5)
  consent_at         timestamptz NOT NULL,
  consent_version    text NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT identity_when_not_anonymous CHECK (
    is_anonymous OR (reporter_name IS NOT NULL AND reporter_address IS NOT NULL
                     AND reporter_phone IS NOT NULL AND reporter_email IS NOT NULL)),
  CONSTRAINT pengaduan_fields CHECK (
    kind <> 'pengaduan' OR (incident_date IS NOT NULL AND incident_location IS NOT NULL)),
  CONSTRAINT konsultasi_fields CHECK (
    kind <> 'konsultasi' OR consult_mode IS NOT NULL)
);

CREATE TABLE attachments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id   uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  file_name   text NOT NULL,
  mime_type   text NOT NULL,
  size_bytes  int NOT NULL CHECK (size_bytes > 0),
  storage_key text NOT NULL UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE report_events (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id            uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  event_type           text NOT NULL,   -- 'status', 'catatan', 'pindah_divisi'
  from_status          report_status,
  to_status            report_status,
  from_division_id     uuid REFERENCES divisions(id),
  to_division_id       uuid REFERENCES divisions(id),
  note                 text,
  visible_to_reporter  boolean NOT NULL DEFAULT false,
  actor_id             uuid REFERENCES users(id),   -- NULL untuk peristiwa sistem
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE content_pages (
  key         text PRIMARY KEY,                    -- 'tentang', 'panduan', 'kebijakan_privasi'
  title       text NOT NULL,
  body_md     text NOT NULL,
  updated_by  uuid REFERENCES users(id),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site_settings (
  key         text PRIMARY KEY,                    -- 'hotline_wa', 'nomor_darurat', ...
  value       text NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE access_logs (
  id          bigserial PRIMARY KEY,
  user_id     uuid REFERENCES users(id),
  report_id   uuid REFERENCES reports(id) ON DELETE SET NULL,
  action      text NOT NULL,                       -- 'lihat', 'unduh_lampiran', 'ubah_status', ...
  ip          inet,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Indeks
CREATE INDEX reports_division_status_idx ON reports (division_id, status);
CREATE INDEX reports_status_idx          ON reports (status);
CREATE INDEX reports_category_idx        ON reports (category_id);
CREATE INDEX reports_created_idx         ON reports (created_at DESC);
CREATE INDEX reports_respond_due_idx     ON reports (respond_due_at) WHERE first_response_at IS NULL;
CREATE INDEX reports_resolve_due_idx     ON reports (resolve_due_at)
  WHERE status NOT IN ('selesai', 'dirujuk', 'ditolak');
CREATE INDEX reports_purge_idx           ON reports (purge_after) WHERE purge_after IS NOT NULL;
CREATE INDEX report_events_report_idx    ON report_events (report_id, created_at);
CREATE INDEX access_logs_report_idx      ON access_logs (report_id, created_at DESC);
```

### 10.3 Aturan data

- **Pembuatan laporan:** `division_id` dan `is_special` disalin dari kategori saat dikirim. `respond_due_at` = waktu kirim + 24 jam, `resolve_due_at` = waktu kirim + 7 hari. Sistem membuat peristiwa awal "Diterima" di `report_events`.
- **Kode tiket dan PIN:** kode acak 8 karakter (tanpa huruf yang mudah tertukar seperti O dan 0), PIN 6 digit. PIN hanya ditampilkan sekali dan disimpan ter-hash (argon2id).
- **Hak akses baca:** paralegal hanya `reports.division_id = users.division_id`. Admin dan Lurah semua laporan. Pemantau tidak membaca `reports`, hanya data agregat (rekap). Aturan ini diterapkan di fungsi akses tunggal, dan dapat diperkuat dengan Row-Level Security PostgreSQL.
- **Laporan Khusus:** `is_special = true` hanya terlihat oleh Lurah, admin, dan paralegal di divisi tujuannya. Tidak muncul di tampilan umum atau rekap yang memuat isi.
- **Retensi:** saat status menjadi `selesai`, `dirujuk`, atau `ditolak`, `closed_at` diisi dan `purge_after` = `closed_at` + 2 tahun (usulan PRD 9.5). Pekerjaan terjadwal harian:
  - menghapus lampiran satu tahun setelah `closed_at`;
  - pada `purge_after`, mengosongkan kolom `reporter_*`, `title`, `body`, `incident_location` dan menyisakan kategori, status, dan tanggal untuk statistik;
  - menghapus `access_logs` lebih dari satu tahun.
- **Anonim:** kolom `reporter_*` NULL. Hanya kode tiket dan PIN yang menjadi penghubung pelapor.
- **Pemindahan divisi:** mengubah `reports.division_id` dan menambah peristiwa `pindah_divisi`.

### 10.4 Data awal (seed)

Kategori dan divisi awal sesuai PRD 6.7 dan 6.8: enam divisi dan lima belas kategori. Isi awal `content_pages` (placeholder) dan `site_settings`: `hotline_wa = 0812-3456-7890` (nomor contoh, ganti dengan nomor resmi kelurahan), `nomor_darurat`.

## 11. Server Actions dan Rute

| Aksi/Rute | Fungsi | Akses |
|---|---|---|
| `kirimLaporan` | Validasi Zod, simpan laporan dan lampiran, buat tiket dan PIN | Publik (dibatasi laju) |
| `cekStatus` | Cocokkan kode tiket dan PIN, kembalikan status dan catatan terlihat | Publik (dibatasi laju) |
| `ubahStatus` | Ubah status dan tambah peristiwa | Admin, Lurah, Paralegal (divisi sendiri) |
| `tambahCatatan` | Catatan internal atau terlihat pelapor | Sama |
| `pindahDivisi` | Pindahkan laporan | Admin, Lurah |
| `kelolaDivisi`, `kelolaKategori` | CRUD master | Admin |
| `kelolaAkun` | Buat akun paralegal, atur divisi, aktif/nonaktif | Admin |
| `simpanKonten` | Edit halaman dan pengaturan | Admin |
| `GET /api/lampiran/[id]` | Unduh lampiran setelah cek hak akses dan catat log | Pengguna berwenang |

## 12. Aksesibilitas dan Performa

- Semua kontrol dapat dioperasikan dengan keyboard, dengan urutan fokus logis dan cincin fokus jelas.
- Setiap kolom punya label tertaut, galat diumumkan ke pembaca layar (`aria-live`).
- Warna tidak menjadi satu-satunya penanda: status selalu disertai teks, kategori Khusus disertai ikon dan teks.
- Ukuran huruf mengikuti pengaturan pengguna; layout tetap utuh sampai pembesaran 200%.
- Halaman publik dirender di server dan ringan; gambar logo berupa SVG. Target waktu muat wajar di koneksi seluler biasa.
- Tidak ada animasi otomatis; transisi hanya untuk respons terhadap tindakan (buka dialog, pindah langkah), dan menghormati `prefers-reduced-motion`.

## 13. Urutan Pengerjaan untuk Rilis 19 Oktober 2026

Urutan dibuat agar bagian terpenting selesai lebih dulu. Bila waktu habis, bagian bawah daftar boleh menyusul setelah rilis.

1. Proyek Next.js, Tailwind v4, HeroUI v3, token warna, font, logo, koneksi PostgreSQL, migrasi dan seed.
2. Komponen fondasi dan form: `AppButton`, `FormField` dan turunannya, `ChoiceCard`, `AnonymousSwitch`, `ConsentCheckbox`, `Stepper`, `InfoCallout`.
3. Alur publik: Beranda, lembar panduan, form 3 langkah, halaman Selesai dengan tiket dan PIN.
4. Cek status.
5. Login admin, daftar laporan, detail laporan, ubah status dan catatan.
6. Master divisi, kategori, dan pembuatan akun paralegal.
7. Persetujuan data, halaman Tentang dan Panduan (isi sementara), tombol keluar cepat.
8. Menyusul setelah rilis bila perlu: lampiran lengkap dengan pemindaian, dashboard dan rekap, penghapusan terjadwal, edit konten dari admin, pemantau.

Catatan: lampiran dan penghapusan terjadwal menyentuh data sensitif. Jika keduanya belum siap pada 19 Oktober, sebaiknya fitur lampiran dinonaktifkan dulu daripada dirilis tanpa penyimpanan privat dan kebijakan retensi yang berjalan.

## 14. Asumsi dan Hal yang Perlu Disahkan

- Pelapor memakai **kode tiket + PIN** untuk cek status. Ini menggantikan usulan awal di PRD (kode tiket + empat digit akhir WhatsApp) karena laporan anonim tidak punya nomor WhatsApp. PRD bagian 6.5 perlu disesuaikan.
- Peran **Lurah** ditambahkan sebagai peran tersendiri (baca semua, ubah status, pindah divisi) karena Lurah menjadi penanggung jawab penerima laporan sementara. Di PRD peran ini baru disebut sebagai pemantau.
- Batas validasi di bagian 8, angka retensi, dan daftar kategori dan divisi adalah usulan yang menunggu pengesahan kelurahan.
- Nomor hotline `0812-3456-7890` adalah nomor contoh.
- Detail API HeroUI v3 diverifikasi saat implementasi. Dokumen ini menetapkan komponen dan tujuannya, bukan sintaks.
