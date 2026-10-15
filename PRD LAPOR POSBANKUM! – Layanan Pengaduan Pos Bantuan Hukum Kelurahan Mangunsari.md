# PRD LAPOR POSBANKUM!

**Layanan Pengaduan Pos Bantuan Hukum Kelurahan Mangunsari**

Versi 0.1 (draf) · 15 Oktober 2026 · Disusun berdasarkan dokumen konsep "Konsep Website Pengaduan Posbankum"

## 1. Ringkasan

LAPOR POSBANKUM! adalah website layanan pengaduan dan konsultasi hukum untuk warga Kelurahan Mangunsari. Warga dapat menyampaikan pengaduan kasus hukum atau mengajukan konsultasi hukum secara online melalui form bertahap. Pengurus Posbankum menerima, memverifikasi, dan menindaklanjuti laporan melalui halaman admin.

Domain rencana: `lapor.posbankum.mangunsari.com` (dinyatakan resmi oleh kelurahan).

## 2. Latar Belakang dan Masalah

- Warga yang memerlukan bantuan hukum sering tidak tahu harus ke mana atau enggan datang langsung, terutama untuk kasus sensitif seperti KDRT, kekerasan seksual, atau sengketa keluarga.
- Posbankum belum memiliki kanal digital yang terstruktur untuk menerima dan mencatat laporan.
- Tanpa pencatatan terpusat, tindak lanjut sulit dipantau dan tidak ada data untuk pelaporan ke kelurahan.

## 3. Tujuan dan Non-Tujuan

### Tujuan

1. Menyediakan satu pintu digital bagi warga untuk mengadu dan berkonsultasi hukum.
2. Memastikan setiap laporan tercatat, memiliki status, dan dapat dilacak pelapor.
3. Menjaga kerahasiaan dan keamanan data pelapor, terutama korban kasus sensitif.
4. Memberi pengurus Posbankum alat sederhana untuk mengelola laporan dan membuat rekap.

### Non-Tujuan (versi pertama)

- Bukan pengganti laporan polisi atau layanan darurat.
- Bukan sistem penyelesaian perkara atau pemberian nasihat hukum otomatis.
- Tidak ada integrasi dengan sistem pemerintah lain (misalnya LAPOR! nasional) pada versi pertama.
- Tidak ada aplikasi mobile native; cukup website responsif.

## 4. Pengguna

| Peran | Deskripsi | Kebutuhan utama |
| --- | --- | --- |
| Warga/Pelapor | Warga Kelurahan Mangunsari, bisa awam teknologi, kebanyakan memakai HP | Form mudah, aman, boleh melapor secara anonim, tahu status laporan |
| Admin | Pengurus yang mengelola website dan akun | Kelola pengguna, konten, dan seluruh laporan; membuat akun paralegal dan menentukan divisinya |
| Paralegal/Petugas | Anggota Posbankum yang menindaklanjuti; akun dibuat admin dan divisinya ditentukan admin | Melihat laporan, mengubah status, mencatat tindak lanjut |
| Pemantau (opsional) | Pimpinan kelurahan | Melihat rekap tanpa akses ke isi laporan sensitif |

## 5. Ruang Lingkup Fitur

### 5.1 Prioritas

| Fitur | Prioritas |
| --- | --- |
| Beranda, Tentang, Panduan Pengaduan | Wajib (konten Tentang dan Panduan menyusul) |
| Logo Posbankum dalam format SVG | Wajib (logo belum ada, akan dibuat) |
| Form bertahap: identitas, jenis laporan, selesai | Wajib |
| Dua jenis form: Pengaduan dan Konsultasi | Wajib |
| Lapor anonim atau nama samaran | Wajib (diputuskan kelurahan) |
| Admin membuat akun paralegal dan menentukan divisinya | Wajib (diputuskan kelurahan) |
| Kode tiket dan halaman cek status | Wajib (rekomendasi) |
| Persetujuan pengolahan data | Wajib (rekomendasi) |
| Login admin dan dashboard laporan | Wajib |
| Tombol keluar cepat | Sebaiknya ada (rekomendasi) |
| Peran pemantau | Sebaiknya ada |
| Rekap bulanan dan ekspor | Fase berikutnya |
| Notifikasi WhatsApp/email otomatis | Fase berikutnya |

Catatan: butir bertanda "rekomendasi" berasal dari hasil telaah konsep awal dan belum ditetapkan oleh pemilik produk.

## 6. Kebutuhan Fungsional

### 6.1 Halaman Beranda

- Menampilkan logo Posbankum Kel. Mangunsari di atas judul. Logo belum ada dan dibuat dalam format SVG.
- Judul: **LAYANAN PENGADUAN POS BANTUAN HUKUM KELURAHAN MANGUNSARI**.
- Tombol utama **Lapor** (Pelaporan) yang mengarah ke alur pengaduan.
- Tampilan satu halaman yang di-scroll ke bawah.
- Bar navigasi: Home (logo web), Tentang, Panduan Pengaduan, Login. Logo web membawa pengguna ke Beranda.

### 6.2 Halaman Tentang

- Berisi maksud dan tujuan website, penjelasan apa itu Posbankum, dan daftar anggota Posbankum.
- Isi teks: menyusul dari pemilik produk.

### 6.3 Halaman Panduan Pengaduan

- Berisi panduan pengaduan yang sama dengan lembar panduan di alur Lapor.
- Disarankan satu sumber konten agar tidak ada dua versi yang berbeda.
- Memuat penjelasan batas layanan: Posbankum memberi bantuan hukum, mediasi, dan rujukan, bukan laporan polisi (rekomendasi).
- Memuat nomor layanan darurat dengan catatan bahwa website ini tidak untuk kondisi darurat (rekomendasi).

### 6.4 Alur Pelaporan

**Langkah 0: Lembar panduan.** Setelah menekan tombol Lapor, pengguna melihat lembar panduan pengaduan. Lembar ini hilang setelah pengguna menekan tombol **Lanjutkan**.

**Indikator tahapan.** Selama pengisian form, ditampilkan indikator tahapan (di bawah form) agar pelapor tahu sudah sampai tahap berapa.

**Langkah 1: Form Identitas.**

- Pilihan **lapor anonim atau nama samaran**; jika dipilih, kolom nama, alamat, WhatsApp, dan email tidak diwajibkan
- Nama pelapor (wajib, kecuali lapor anonim)
- Alamat pelapor (wajib, kecuali lapor anonim)
- Nomor WhatsApp yang dapat dihubungi (wajib, kecuali lapor anonim)
- Email pelapor (wajib, kecuali lapor anonim)
- Tombol **Selanjutnya**

**Langkah 2: Form Pelaporan.** Pelapor memilih klasifikasi laporan:

| Jenis | Deskripsi |
| --- | --- |
| Pengaduan | Form untuk pengaduan kasus hukum |
| Konsultasi | Form untuk konsultasi hukum |

*Form Pengaduan*

- Judul laporan (wajib), contoh: KDRT, kekerasan seksual, perkelahian, pencurian, penipuan, sengketa waris, dll.
- Isi laporan (wajib): deskripsi detail kasus.
- Tanggal kejadian (wajib), dengan date picker.
- Lokasi kejadian (wajib).
- Dokumen pendukung berupa gambar atau file (tidak wajib).

*Form Konsultasi*

- Judul konsultasi (wajib), contoh: konsultasi waris, konsultasi dispensasi nikah, dll.
- Isi konsultasi (wajib): deskripsi konsultasi.
- Pengajuan konsultasi (wajib): pilihan **tatap muka** atau **daring**.

Setelah menekan **Selanjutnya**, pengguna masuk ke Langkah 3.

**Langkah 3: Selesai.**

- Menampilkan informasi bahwa laporan telah diterima dan akan ditindaklanjuti.
- Menampilkan nomor WhatsApp (hotline) pengaduan Posbankum untuk kebutuhan pengaduan atau pelaporan cepat (nomor dipegang pihak kelurahan).
- Menampilkan kode tiket untuk cek status (rekomendasi).

### 6.5 Cek Status Laporan (rekomendasi)

- Pelapor memasukkan kode tiket (dan verifikasi tambahan, misalnya empat digit akhir nomor WhatsApp) untuk melihat status.
- Status yang ditampilkan: Diterima, Diverifikasi, Ditindaklanjuti, Selesai.
- Pelapor hanya melihat status dan catatan yang sengaja dibuat terlihat oleh petugas, bukan seluruh catatan internal.

### 6.6 Halaman Admin

- Login khusus pengurus melalui tombol Login.
- Daftar laporan dengan filter jenis (Pengaduan/Konsultasi), kategori, status, dan tanggal.
- Detail laporan: identitas pelapor, isi, lampiran, riwayat status.
- Ubah status laporan dan tambah catatan tindak lanjut (internal dan yang terlihat pelapor).
- Pengelolaan akun: admin membuat akun paralegal dan menentukan divisinya; peran pemantau opsional.
- Pengelolaan konten Tentang dan Panduan.
- Rekap sederhana jumlah laporan per bulan, jenis, dan status (fase berikutnya untuk ekspor).

### 6.7 Kategori Laporan

Pelapor memilih satu kategori lewat dropdown, dan kategori menentukan divisi penerima (6.8). Kategori bertanda **Khusus** mendapat prioritas respons, akses terbatas hanya untuk Lurah dan petugas divisi terkait, serta halaman Selesai menampilkan nomor layanan darurat dan rujukan. Daftar ini usulan awal untuk disahkan kelurahan.

| Kategori | Berlaku untuk | Penanganan khusus |
| --- | --- | --- |
| KDRT | Pengaduan | Khusus |
| Kekerasan seksual | Pengaduan | Khusus |
| Kekerasan atau eksploitasi terhadap anak | Pengaduan | Khusus |
| Perundungan (bullying) | Pengaduan | Khusus |
| Penganiayaan atau perkelahian | Pengaduan | Biasa |
| Pencurian | Pengaduan | Biasa |
| Penipuan atau penggelapan | Pengaduan | Biasa |
| Sengketa tanah atau bangunan | Pengaduan dan Konsultasi | Biasa |
| Sengketa waris | Pengaduan dan Konsultasi | Biasa |
| Utang-piutang atau perjanjian | Pengaduan dan Konsultasi | Biasa |
| Perselisihan antartetangga atau lingkungan | Pengaduan | Biasa |
| Ketenagakerjaan | Pengaduan dan Konsultasi | Biasa |
| Perkawinan, perceraian, dispensasi nikah | Konsultasi | Biasa |
| Dokumen kependudukan dan administrasi | Konsultasi | Biasa |
| Lainnya | Pengaduan dan Konsultasi | Biasa (petugas menetapkan kategori) |

### 6.8 Divisi Paralegal dan Hak Akses

- Admin membuat master divisi lebih dulu, lalu menautkan setiap divisi ke satu atau lebih kategori.
- Laporan otomatis masuk ke divisi sesuai kategori yang dipilih pelapor.
- Paralegal hanya melihat laporan pada divisinya. Admin dan Lurah dapat melihat semua laporan.
- Admin dapat memindahkan laporan ke divisi lain (misalnya kategori Lainnya atau salah pilih); pemindahan tercatat di riwayat status.

Usulan divisi awal:

| Divisi | Kategori yang ditangani |
| --- | --- |
| Perlindungan Perempuan dan Anak | KDRT, kekerasan seksual, kekerasan atau eksploitasi anak, perundungan |
| Pidana Umum | Penganiayaan atau perkelahian, pencurian, penipuan |
| Perdata dan Pertanahan | Sengketa tanah, sengketa waris, utang-piutang |
| Keluarga dan Kependudukan | Perkawinan dan perceraian, dokumen kependudukan |
| Lingkungan dan Ketenagakerjaan | Perselisihan antartetangga, ketenagakerjaan |
| Umum | Lainnya |

## 7. Alur Status Laporan

1. **Diterima**: laporan masuk, tiket dibuat otomatis.
2. **Diverifikasi**: petugas memeriksa kelengkapan dan kewenangan Posbankum.
3. **Ditindaklanjuti**: konsultasi dijadwalkan, mediasi berjalan, atau dirujuk ke pihak lain.
4. **Selesai**: ditutup dengan catatan hasil. Alternatif penutupan: **Dirujuk** atau **Ditolak/di luar kewenangan** dengan alasan.

Respons awal maksimal 24 jam sejak laporan diterima (diputuskan kelurahan). Penyelesaian maksimal 7 hari sejak laporan diterima (diputuskan kelurahan).

## 8. Model Data (garis besar)

| Entitas | Atribut utama |
| --- | --- |
| Laporan | id, kode tiket, jenis (pengaduan/konsultasi), kategori, judul, isi, tanggal kejadian, lokasi kejadian, metode konsultasi (tatap muka/daring), status, waktu dibuat, waktu diubah |
| Pelapor | id, nama, alamat, nomor WhatsApp, email, penanda anonim/nama samaran, persetujuan data (waktu dan versi) |
| Lampiran | id, id laporan, nama file, tipe, ukuran, lokasi penyimpanan privat |
| Riwayat Status | id, id laporan, status, catatan, terlihat pelapor (ya/tidak), oleh pengguna, waktu |
| Pengguna | id, nama, email, peran, status aktif |
| Konten Halaman | kunci halaman (tentang/panduan), isi, waktu diubah |
| Log Akses | siapa membuka laporan apa dan kapan |

## 9. Kebutuhan Non-Fungsional

### 9.1 Privasi dan keamanan

- Persetujuan pengolahan data pribadi (checkbox dan ringkasan kebijakan privasi) sebelum form dikirim, sesuai UU Pelindungan Data Pribadi No. 27 Tahun 2022.
- Seluruh akses melalui HTTPS.
- Data dan lampiran tidak dapat diakses publik; unduhan lampiran hanya untuk pengguna berwenang.
- Pembatasan jenis dan ukuran file unggahan, serta pemeriksaan keamanan file.
- Akses laporan berbasis peran dan tercatat dalam log akses.
- Autentikasi admin yang kuat (kata sandi kuat, pembatasan percobaan login, disarankan verifikasi dua langkah).
- Perlindungan spam: captcha dan pembatasan jumlah kiriman per perangkat/alamat IP.
- Kebijakan retensi: berapa lama data disimpan dan cara penghapusan (ditetapkan pengurus).
- Pencadangan data berkala.

### 9.2 Keselamatan korban

- Tombol keluar cepat yang mengalihkan ke situs netral.
- Email dan WhatsApp otomatis tidak boleh memuat isi laporan, hanya kode tiket dan pesan umum.
- Lapor anonim diizinkan: kontak (nama, alamat, WhatsApp, email) tidak diwajibkan untuk laporan anonim, dan pelapor anonim tetap mendapat kode tiket untuk cek status.

### 9.3 Kegunaan dan performa

- Responsif dan ringan di HP dengan koneksi biasa.
- Bahasa Indonesia sederhana, teks petunjuk jelas, tanda wajib diisi.
- Dapat dibaca dengan baik oleh warga lanjut usia (ukuran huruf dan kontras memadai).
- Validasi form di sisi klien dan server, dengan pesan kesalahan yang jelas.

### 9.4 Ketersediaan

- Target ketersediaan layanan wajar untuk layanan kelurahan; pemeliharaan diumumkan di beranda.

### 9.5 Kebijakan Retensi dan Penghapusan Data

Usulan ini mengikuti prinsip UU Pelindungan Data Pribadi No. 27 Tahun 2022: data hanya disimpan selama diperlukan untuk tujuan pengaduan, lalu dihapus atau dianonimkan, dan pelapor dapat meminta penghapusan datanya. UU tidak menetapkan angka hari atau tahun untuk layanan seperti ini, jadi angka di bawah adalah usulan yang perlu disahkan kelurahan dan disesuaikan dengan jadwal retensi arsip kelurahan atau pemkot.

| Data | Lama simpan | Setelah itu |
| --- | --- | --- |
| Laporan yang masih diproses | Selama diproses | Mengikuti status |
| Laporan selesai (identitas, isi, catatan) | 2 tahun sejak status Selesai | Identitas dihapus; sisanya dianonimkan untuk statistik |
| Lampiran (gambar atau file) | 1 tahun sejak status Selesai | Dihapus permanen |
| Log akses | 1 tahun | Dihapus |
| Cadangan (backup) | Maksimal 30 hari | Ditimpa siklus berikutnya |

- Permintaan penghapusan atau penarikan persetujuan dari pelapor diproses sesuai waktu yang ditetapkan kelurahan, kecuali data masih diperlukan untuk proses hukum yang berjalan.
- Laporan kategori Khusus tetap dibatasi aksesnya sampai dihapus.
- Penghapusan dilakukan otomatis terjadwal dan tercatat di log.

## 10. Rekomendasi Teknis (usulan, belum diputuskan)

Stack belum ditentukan di konsep awal. Pilihan yang masuk akal untuk skala satu kelurahan:

- **Opsi A:** aplikasi web ringan dengan database relasional (misalnya PostgreSQL atau MySQL) dan penyimpanan file privat. Cocok bila ingin kontrol penuh atas peran, log akses, dan status.
- **Opsi B:** CMS (misalnya WordPress) dengan plugin form dan peran pengguna. Lebih cepat, tetapi perlu pengerasan keamanan ekstra karena data sensitif.

Hosting dan pemeliharaan dikelola kelurahan, jadi pilih opsi yang paling mudah dirawat stafnya. Keputusan juga bergantung pada hosting yang tersedia dan kebutuhan keamanan.

## 11. Metrik Keberhasilan

- Jumlah laporan dan konsultasi masuk per bulan.
- Persentase laporan yang mendapat respons awal dalam target waktu.
- Persentase laporan yang berstatus Selesai atau Dirujuk.
- Tingkat penyelesaian form (berapa persen pengguna yang memulai sampai kirim).
- Jumlah insiden keamanan atau kebocoran data (target: nol).
- Umpan balik kepuasan pelapor (opsional, pada fase berikutnya).

## 12. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Kebocoran data laporan sensitif | Tinggi, membahayakan korban | Akses berbasis peran, penyimpanan privat, log akses, enkripsi, retensi |
| Laporan tidak ditindaklanjuti | Warga kehilangan kepercayaan | Status, target respons, penanggung jawab jelas, dashboard |
| Warga mengira web ini layanan darurat atau kepolisian | Penanganan terlambat | Batas layanan dan nomor darurat di panduan dan halaman selesai |
| Syarat identitas terlalu berat | Korban enggan melapor | Opsi anonim, kurangi kolom wajib bila memungkinkan |
| Spam atau laporan palsu | Beban petugas | Captcha, pembatasan kiriman, tahap verifikasi |
| Warga ragu terhadap keaslian domain | Rendahnya kepercayaan | Domain dinyatakan resmi oleh kelurahan; umumkan lewat kanal resmi kelurahan |
| Konten Tentang dan Panduan terlambat | Peluncuran tertunda | Siapkan draf konten sejak awal |

## 13. Rencana Rilis

Target peluncuran: 19 Oktober 2026. Jadwal ini sangat ketat, sehingga bagian yang belum siap (konten Tentang dan Panduan, nomor hotline resmi) boleh memakai isi sementara dan disempurnakan setelah rilis.

**Fase 1 (MVP)**

- Beranda, navigasi, Tentang dan Panduan (konten sementara), logo SVG
- Alur 3 langkah dengan form Pengaduan dan Konsultasi, termasuk opsi lapor anonim
- Kode tiket dan cek status
- Persetujuan data
- Login admin, pembuatan akun paralegal dan divisinya, daftar laporan, ubah status dan catatan

**Fase 2**

- Peran pemantau
- Tombol keluar cepat (bila belum masuk MVP)
- Rekap bulanan dan ekspor

**Fase 3**

- Notifikasi otomatis (WhatsApp/email) tanpa memuat isi laporan
- Penjadwalan konsultasi
- Survei kepuasan

## 14. Kriteria Penerimaan MVP

- Warga dapat menyelesaikan alur Lapor dari HP sampai halaman Selesai tanpa bantuan.
- Kolom wajib tidak dapat dilewati; kolom opsional (dokumen pendukung) dapat dikosongkan.
- Setiap laporan menghasilkan kode tiket unik dan statusnya dapat dicek.
- Hotline WhatsApp tampil di halaman Selesai.
- Hanya pengguna berwenang yang dapat membuka laporan dan lampiran; akses tercatat.
- Admin dapat mengubah status, menambah catatan tindak lanjut, serta membuat akun paralegal dan menentukan divisinya.
- Pengguna wajib menyetujui pengolahan data sebelum mengirim laporan. Laporan anonim dapat dikirim tanpa mengisi nama, alamat, WhatsApp, dan email.
- Halaman Beranda, Tentang, Panduan, dan Login dapat diakses dari navigasi.

## 15. Keputusan dan Pertanyaan Terbuka

### Sudah diputuskan

| Hal | Keputusan |
| --- | --- |
| Pemilik layanan | Pihak kelurahan |
| Penanggung jawab penerimaan laporan | Lurah (sementara) |
| Domain | `lapor.posbankum.mangunsari.com` dinyatakan resmi |
| Lapor anonim | Diizinkan; kontak tidak diwajibkan untuk laporan anonim |
| Target respons awal | Maksimal 24 jam |
| Target penyelesaian | Maksimal 7 hari sejak laporan diterima |
| Akun petugas dan divisi | Admin membuat master divisi dan akun paralegal; laporan masuk ke divisi sesuai kategori dan hanya terlihat oleh divisinya (6.8) |
| Kategori laporan | Daftar usulan di 6.7, menunggu pengesahan kelurahan |
| Retensi dan penghapusan data | Usulan di 9.5, menunggu pengesahan kelurahan |
| Hotline WhatsApp | Dipegang pihak kelurahan; sementara memakai nomor contoh 0812-3456-7890 |
| Logo | Dibuat dalam format SVG |
| Hosting dan pemeliharaan | Pihak kelurahan |
| Target peluncuran | 19 Oktober 2026 |

### Masih terbuka

1. Nomor hotline WhatsApp resmi untuk menggantikan nomor contoh.
2. Pengesahan kategori (6.7), divisi awal (6.8), dan kebijakan retensi (9.5) oleh kelurahan, termasuk kesesuaian dengan jadwal retensi arsip yang berlaku.
3. Nama Lurah sebagai penanggung jawab sementara, dan siapa penerima laporan setelah masa sementara.
4. Kecukupan waktu: peluncuran 19 Oktober 2026 hanya empat hari dari tanggal draf ini, sehingga cakupan MVP perlu dipastikan.
