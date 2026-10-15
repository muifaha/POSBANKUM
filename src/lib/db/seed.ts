import { db } from "./index";
import { divisions, categories, users, siteSettings, contentPages } from "./schema";
import { hashPassword } from "../auth/password";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Memulai seeding database POSBANKUM...");

  // 1. DIVISI
  const divisionsData = [
    {
      name: "Perlindungan Perempuan dan Anak",
      description: "Menangani kasus kekerasan berbasis gender, KDRT, kekerasan dan eksploitasi anak, serta perundungan.",
    },
    {
      name: "Pidana Umum",
      description: "Menangani delik tindak pidana umum di lingkungan warga seperti pencurian, penganiayaan, dan penipuan.",
    },
    {
      name: "Perdata dan Pertanahan",
      description: "Menangani sengketa kepemilikan tanah, batas lahan, sengketa waris keluarga, serta utang-piutang.",
    },
    {
      name: "Keluarga dan Kependudukan",
      description: "Konsultasi perkawinan, perceraian, dispensasi nikah, serta administrasi kependudukan.",
    },
    {
      name: "Lingkungan dan Ketenagakerjaan",
      description: "Perselisihan antarwarga/tetangga, ketertiban lingkungan, dan masalah ketenagakerjaan.",
    },
    {
      name: "Umum",
      description: "Penanganan kasus umum atau laporan yang belum terklasifikasi secara spesifik.",
    },
  ];

  const divisionMap = new Map<string, string>();

  for (const div of divisionsData) {
    const existing = await db.query.divisions.findFirst({
      where: eq(divisions.name, div.name),
    });

    if (existing) {
      divisionMap.set(div.name, existing.id);
    } else {
      const [inserted] = await db.insert(divisions).values(div).returning();
      divisionMap.set(div.name, inserted.id);
    }
  }

  console.log("✅ Divisi tersimpan:", divisionMap.size);

  // 2. KATEGORI (PRD 6.7)
  const categoriesData = [
    {
      name: "KDRT (Kekerasan Dalam Rumah Tangga)",
      slug: "kdrt",
      appliesTo: "pengaduan" as const,
      isSpecial: true,
      divisionName: "Perlindungan Perempuan dan Anak",
      sortOrder: 1,
    },
    {
      name: "Kekerasan Seksual",
      slug: "kekerasan-seksual",
      appliesTo: "pengaduan" as const,
      isSpecial: true,
      divisionName: "Perlindungan Perempuan dan Anak",
      sortOrder: 2,
    },
    {
      name: "Kekerasan atau Eksploitasi terhadap Anak",
      slug: "kekerasan-anak",
      appliesTo: "pengaduan" as const,
      isSpecial: true,
      divisionName: "Perlindungan Perempuan dan Anak",
      sortOrder: 3,
    },
    {
      name: "Perundungan (Bullying)",
      slug: "perundungan",
      appliesTo: "pengaduan" as const,
      isSpecial: true,
      divisionName: "Perlindungan Perempuan dan Anak",
      sortOrder: 4,
    },
    {
      name: "Penganiayaan atau Perkelahian",
      slug: "penganiayaan-perkelahian",
      appliesTo: "pengaduan" as const,
      isSpecial: false,
      divisionName: "Pidana Umum",
      sortOrder: 5,
    },
    {
      name: "Pencurian",
      slug: "pencurian",
      appliesTo: "pengaduan" as const,
      isSpecial: false,
      divisionName: "Pidana Umum",
      sortOrder: 6,
    },
    {
      name: "Penipuan atau Penggelapan",
      slug: "penipuan-penggelapan",
      appliesTo: "pengaduan" as const,
      isSpecial: false,
      divisionName: "Pidana Umum",
      sortOrder: 7,
    },
    {
      name: "Sengketa Tanah atau Bangunan",
      slug: "sengketa-tanah",
      appliesTo: "keduanya" as const,
      isSpecial: false,
      divisionName: "Perdata dan Pertanahan",
      sortOrder: 8,
    },
    {
      name: "Sengketa Waris",
      slug: "sengketa-waris",
      appliesTo: "keduanya" as const,
      isSpecial: false,
      divisionName: "Perdata dan Pertanahan",
      sortOrder: 9,
    },
    {
      name: "Utang-Piutang atau Perjanjian",
      slug: "utang-piutang",
      appliesTo: "keduanya" as const,
      isSpecial: false,
      divisionName: "Perdata dan Pertanahan",
      sortOrder: 10,
    },
    {
      name: "Perselisihan Antartetangga atau Lingkungan",
      slug: "perselisihan-lingkungan",
      appliesTo: "pengaduan" as const,
      isSpecial: false,
      divisionName: "Lingkungan dan Ketenagakerjaan",
      sortOrder: 11,
    },
    {
      name: "Ketenagakerjaan",
      slug: "ketenagakerjaan",
      appliesTo: "keduanya" as const,
      isSpecial: false,
      divisionName: "Lingkungan dan Ketenagakerjaan",
      sortOrder: 12,
    },
    {
      name: "Perkawinan, Perceraian, Dispensasi Nikah",
      slug: "perkawinan-perceraian",
      appliesTo: "konsultasi" as const,
      isSpecial: false,
      divisionName: "Keluarga dan Kependudukan",
      sortOrder: 13,
    },
    {
      name: "Dokumen Kependudukan dan Administrasi",
      slug: "dokumen-kependudukan",
      appliesTo: "konsultasi" as const,
      isSpecial: false,
      divisionName: "Keluarga dan Kependudukan",
      sortOrder: 14,
    },
    {
      name: "Lainnya",
      slug: "lainnya",
      appliesTo: "keduanya" as const,
      isSpecial: false,
      divisionName: "Umum",
      sortOrder: 15,
    },
  ];

  for (const cat of categoriesData) {
    const divId = divisionMap.get(cat.divisionName);
    if (!divId) continue;

    const existing = await db.query.categories.findFirst({
      where: eq(categories.slug, cat.slug),
    });

    if (!existing) {
      await db.insert(categories).values({
        name: cat.name,
        slug: cat.slug,
        appliesTo: cat.appliesTo,
        isSpecial: cat.isSpecial,
        divisionId: divId,
        sortOrder: cat.sortOrder,
      });
    }
  }

  console.log("✅ 15 Kategori resmi tersimpan");

  // 3. SETTINGS
  await db
    .insert(siteSettings)
    .values([
      { key: "hotline_wa", value: "0812-3456-7890" },
      {
        key: "nomor_darurat",
        value: "Polsek Sidomukti: (0298) 326110 | Layanan Polisi: 110 | SAPA KemenPPPA: 129",
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Site Settings tersimpan");

  // 4. KONTEN HALAMAN
  await db
    .insert(contentPages)
    .values([
      {
        key: "tentang",
        title: "Tentang Pos Bantuan Hukum (Posbankum) Kelurahan Mangunsari",
        bodyMd: `Pos Bantuan Hukum (Posbankum) Kelurahan Mangunsari merupakan inisiatif resmi pemerintah Kelurahan Mangunsari untuk memberikan akses keadilan seluas-luasnya bagi seluruh warga kelurahan.

Layanan ini dirancang untuk:
1. Memberikan konsultasi hukum awal secara cuma-cuma kepada warga.
2. Memfasilitasi mediasi dan musyawarah damai dalam perkara perselisihan lingkungan/keluarga.
3. Memberikan rujukan advokasi dan pendampingan resmi bagi korban tindak kekerasan terhadap perempuan dan anak.

Pengurus dan Paralegal Posbankum bertindak berdasarkan asas kerahasiaan, keadilan, dan tanpa diskriminasi.`,
      },
      {
        key: "panduan",
        title: "Panduan Pengaduan dan Konsultasi Hukum",
        bodyMd: `Sebelum menyampaikan pengaduan atau konsultasi, harap perhatikan hal-hal berikut:

### Batas Layanan
1. Website ini adalah kanal penerimaan aduan dan permohonan konsultasi Posbankum Kelurahan Mangunsari.
2. **Website ini BUKAN pengganti laporan kepolisian atau nomor gawat darurat.** Jika Anda berada dalam situasi bahaya fisik yang mengancam keselamatan jiwa saat ini, segera hubungi polisi di nomor **110** atau kontak darurat kelurahan.
3. Setiap laporan akan diverifikasi paling lambat dalam **24 jam kerja**.

### Perlindungan Privasi & Opsi Anonim
- Anda diperbolehkan melapor secara **anonim (tanpa identitas)** terutama untuk kasus sensitif.
- Anda akan tetap mendapatkan **Kode Tiket** dan **PIN Rahasia** untuk memantau perkembangan tindak lanjut laporan Anda.`,
      },
      {
        key: "kebijakan_privasi",
        title: "Kebijakan Pelindungan Data Pribadi",
        bodyMd: `Sesuai Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi:
1. Data pribadi yang Anda serahkan (nama, kontak, alamat, kronologi perkara) hanya digunakan untuk kepentingan verifikasi dan tindak lanjut bantuan hukum oleh Posbankum Kelurahan Mangunsari.
2. Data sensitif dan identitas pelapor tidak akan dipublikasikan atau dibagikan ke pihak ketiga di luar penegakan hukum yang berwenang.
3. Setelah laporan selesai diproses dan masa retensi berakhir, data pribadi Anda akan dihapus atau dianonimkan untuk keperluan statistik.`,
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Konten halaman tersimpan");

  // 5. PENGGUNA AWAL (ADMIN, LURAH, PARALEGAL)
  const ppaDivisionId = divisionMap.get("Perlindungan Perempuan dan Anak")!;

  const initialUsers = [
    {
      name: "Administrator Posbankum",
      email: "admin@mangunsari.go.id",
      passwordHash: hashPassword("AdminMangunsari2026!"),
      role: "admin" as const,
      divisionId: null,
    },
    {
      name: "Lurah Mangunsari",
      email: "lurah@mangunsari.go.id",
      passwordHash: hashPassword("LurahMangunsari2026!"),
      role: "lurah" as const,
      divisionId: null,
    },
    {
      name: "Paralegal Divisi PPA",
      email: "paralegal.ppa@mangunsari.go.id",
      passwordHash: hashPassword("Petugas2026!"),
      role: "paralegal" as const,
      divisionId: ppaDivisionId,
    },
  ];

  for (const u of initialUsers) {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, u.email),
    });
    if (!existing) {
      await db.insert(users).values(u);
    }
  }

  console.log("✅ Akun awal berhasil dibuat:");
  console.log("   - Admin: admin@mangunsari.go.id (AdminMangunsari2026!)");
  console.log("   - Lurah: lurah@mangunsari.go.id (LurahMangunsari2026!)");
  console.log("   - Paralegal: paralegal.ppa@mangunsari.go.id (Petugas2026!)");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Gagal seeding:", err);
  process.exit(1);
});
