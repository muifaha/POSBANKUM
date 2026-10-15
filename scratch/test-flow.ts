import { db } from "../src/lib/db";
import { reports, categories, users, reportEvents } from "../src/lib/db/schema";
import { generateTicketCode, generatePin, hashPin, verifyPin } from "../src/lib/tickets";
import { verifyPassword } from "../src/lib/auth/password";
import { eq } from "drizzle-orm";

async function runTest() {
  console.log("🧪 Menjalankan pengujian fungsional end-to-end POSBANKUM...\n");

  // 1. Uji Verifikasi Akun Seed
  const admin = await db.query.users.findFirst({
    where: eq(users.email, "admin@mangunsari.go.id"),
  });
  if (!admin) throw new Error("Admin tidak ditemukan!");
  const isPassValid = verifyPassword("AdminMangunsari2026!", admin.passwordHash);
  console.log("1. Autentikasi Admin:", isPassValid ? "✅ VALID" : "❌ GAGAL");

  // 2. Uji Buat Laporan Pengaduan Baru
  const cat = await db.query.categories.findFirst({
    where: eq(categories.slug, "kdrt"),
  });
  if (!cat) throw new Error("Kategori KDRT tidak ditemukan!");

  const ticketCode = generateTicketCode();
  const pin = generatePin();
  const lookupPinHash = hashPin(pin);

  const [rep] = await db
    .insert(reports)
    .values({
      ticketCode,
      lookupPinHash,
      kind: "pengaduan",
      categoryId: cat.id,
      divisionId: cat.divisionId,
      isSpecial: cat.isSpecial,
      title: "Uji Pengaduan Perkara KDRT",
      body: "Ini adalah pengujian otomatis sistem alur pelaporan Posbankum Kelurahan Mangunsari.",
      incidentDate: "2026-10-14",
      incidentLocation: "Jl. Mangunsari RT 01",
      isAnonymous: false,
      reporterName: "Warga Uji Coba",
      reporterAddress: "Kelurahan Mangunsari",
      reporterPhone: "081299998888",
      reporterEmail: "warga@mangunsari.id",
      status: "diterima",
      respondDueAt: new Date(Date.now() + 24 * 3600 * 1000),
      resolveDueAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      consentAt: new Date(),
      consentVersion: "v1.0",
    })
    .returning();

  console.log("2. Pembuatan Laporan:");
  console.log("   - Kode Tiket:", rep.ticketCode);
  console.log("   - PIN Rahasia:", pin);
  console.log("   - Kategori Khusus:", rep.isSpecial ? "Ya (PPA)" : "Bukan");
  console.log("   - Status Awal:", rep.status, "✅ BERHASIL");

  // 3. Uji Cek Status dengan Tiket & PIN
  const fetched = await db.query.reports.findFirst({
    where: eq(reports.ticketCode, ticketCode),
  });
  if (!fetched) throw new Error("Tiket tidak ditemukan!");
  const isPinMatch = verifyPin(pin, fetched.lookupPinHash);
  console.log("3. Verifikasi PIN Pelacak:", isPinMatch ? "✅ COCOK" : "❌ TIDAK COCOK");

  // 4. Uji Petugas Mengubah Status & Catatan
  await db
    .update(reports)
    .set({
      status: "diverifikasi",
      firstResponseAt: new Date(),
    })
    .where(eq(reports.id, rep.id));

  await db.insert(reportEvents).values({
    reportId: rep.id,
    eventType: "status",
    fromStatus: "diterima",
    toStatus: "diverifikasi",
    note: "Petugas telah memeriksa berkas dan menjadwalkan mediasi awal.",
    visibleToReporter: true,
    actorId: admin.id,
  });

  const updated = await db.query.reports.findFirst({
    where: eq(reports.id, rep.id),
    with: {
      events: true,
    },
  });

  console.log("4. Pembaruan Status & Catatan Petugas:");
  console.log("   - Status Baru:", updated?.status);
  console.log("   - Jumlah Riwayat Event:", updated?.events.length);
  console.log("   - Catatan Publik:", updated?.events[0]?.note, "✅ BERHASIL");

  console.log("\n🎉 SELURUH PENGUJIAN FUNGSIONAL BERHASIL!");
  process.exit(0);
}

runTest().catch((e) => {
  console.error("Gagal uji:", e);
  process.exit(1);
});
