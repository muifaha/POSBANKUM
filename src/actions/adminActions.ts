"use server";

import { db } from "@/lib/db";
import {
  reports,
  reportEvents,
  divisions,
  categories,
  users,
  contentPages,
  siteSettings,
  accessLogs,
} from "@/lib/db/schema";
import { getSession, canManageReport } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. UPDATE REPORT STATUS
export async function updateReportStatusAction(formData: FormData) {
  const user = await getSession();
  if (!user) throw new Error("Akses ditolak. Silakan login kembali.");

  const reportId = formData.get("reportId")?.toString();
  const toStatus = formData.get("status")?.toString() as
    | "diterima"
    | "diverifikasi"
    | "ditindaklanjuti"
    | "selesai"
    | "dirujuk"
    | "ditolak";
  const note = formData.get("note")?.toString() || "";
  const visibleToReporter = formData.get("visibleToReporter") === "true";

  if (!reportId || !toStatus) throw new Error("Data tidak lengkap.");

  const report = await db.query.reports.findFirst({
    where: eq(reports.id, reportId),
  });
  if (!report) throw new Error("Laporan tidak ditemukan.");

  if (!canManageReport(user, report)) {
    throw new Error("Anda tidak memiliki wewenang untuk mengubah laporan di divisi ini.");
  }

  const now = new Date();
  const isClosing = ["selesai", "dirujuk", "ditolak"].includes(toStatus);
  const purgeAfter = isClosing
    ? new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000) // 2 tahun retensi
    : null;

  // Update Report
  await db
    .update(reports)
    .set({
      status: toStatus,
      firstResponseAt: report.firstResponseAt || now,
      closedAt: isClosing ? now : null,
      purgeAfter: purgeAfter || report.purgeAfter,
      updatedAt: now,
    })
    .where(eq(reports.id, reportId));

  // Insert Event
  await db.insert(reportEvents).values({
    reportId,
    eventType: "status",
    fromStatus: report.status,
    toStatus,
    note: note.trim() || `Status diubah menjadi ${toStatus}`,
    visibleToReporter,
    actorId: user.id,
  });

  // Log Access
  await db.insert(accessLogs).values({
    userId: user.id,
    reportId,
    action: `ubah_status_${toStatus}`,
  });

  revalidatePath(`/admin/laporan/${reportId}`);
  revalidatePath("/admin/laporan");
  revalidatePath("/admin");
}

// 2. TRANSFER REPORT DIVISION
export async function transferReportDivisionAction(formData: FormData) {
  const user = await getSession();
  if (!user || (user.role !== "admin" && user.role !== "lurah")) {
    throw new Error("Hanya Administrator atau Lurah yang dapat memindahkan divisi laporan.");
  }

  const reportId = formData.get("reportId")?.toString();
  const toDivisionId = formData.get("divisionId")?.toString();
  const note = formData.get("note")?.toString() || "";

  if (!reportId || !toDivisionId) throw new Error("Data tidak lengkap.");

  const report = await db.query.reports.findFirst({
    where: eq(reports.id, reportId),
  });
  if (!report) throw new Error("Laporan tidak ditemukan.");

  await db
    .update(reports)
    .set({ divisionId: toDivisionId, updatedAt: new Date() })
    .where(eq(reports.id, reportId));

  await db.insert(reportEvents).values({
    reportId,
    eventType: "pindah_divisi",
    fromDivisionId: report.divisionId,
    toDivisionId,
    note: note || "Dipindahkan ke divisi lain oleh pimpinan/admin",
    visibleToReporter: false,
    actorId: user.id,
  });

  await db.insert(accessLogs).values({
    userId: user.id,
    reportId,
    action: `pindah_divisi_${toDivisionId}`,
  });

  revalidatePath(`/admin/laporan/${reportId}`);
  revalidatePath("/admin/laporan");
}

// 3. MASTER DIVISI
export async function createDivisionAction(formData: FormData) {
  const user = await getSession();
  if (!user || user.role !== "admin") throw new Error("Hanya admin yang berwenang.");

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  if (!name) throw new Error("Nama divisi wajib diisi.");

  await db.insert(divisions).values({ name, description });
  revalidatePath("/admin/divisi");
}

// 4. MASTER KATEGORI
export async function createCategoryAction(formData: FormData) {
  const user = await getSession();
  if (!user || user.role !== "admin") throw new Error("Hanya admin yang berwenang.");

  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const appliesTo = formData.get("appliesTo")?.toString() as "pengaduan" | "konsultasi" | "keduanya";
  const isSpecial = formData.get("isSpecial") === "true";
  const divisionId = formData.get("divisionId")?.toString();

  if (!name || !slug || !divisionId) throw new Error("Form tidak lengkap.");

  await db.insert(categories).values({
    name,
    slug,
    appliesTo: appliesTo || "keduanya",
    isSpecial,
    divisionId,
  });
  revalidatePath("/admin/kategori");
}

// 5. KELOLA PENGGUNA
export async function createUserAction(formData: FormData) {
  const user = await getSession();
  if (!user || user.role !== "admin") throw new Error("Hanya admin yang berwenang.");

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString() as "admin" | "lurah" | "paralegal" | "pemantau";
  const divisionId = formData.get("divisionId")?.toString() || null;

  if (!name || !email || !password || !role) throw new Error("Semua kolom wajib diisi.");
  if (role === "paralegal" && !divisionId) {
    throw new Error("Akun paralegal wajib ditentukan divisinya.");
  }

  const passwordHash = hashPassword(password);
  await db.insert(users).values({
    name,
    email,
    passwordHash,
    role,
    divisionId: role === "paralegal" ? divisionId : null,
  });

  revalidatePath("/admin/pengguna");
}

export async function toggleUserStatusAction(userId: string, currentStatus: boolean) {
  const user = await getSession();
  if (!user || user.role !== "admin") throw new Error("Hanya admin yang berwenang.");

  await db
    .update(users)
    .set({ isActive: !currentStatus })
    .where(eq(users.id, userId));

  revalidatePath("/admin/pengguna");
}

// 6. EDIT KONTEN & SETTING
export async function updateContentPageAction(formData: FormData) {
  const user = await getSession();
  if (!user || user.role !== "admin") throw new Error("Hanya admin yang berwenang.");

  const key = formData.get("key")?.toString();
  const title = formData.get("title")?.toString();
  const bodyMd = formData.get("bodyMd")?.toString();

  if (!key || !title || !bodyMd) throw new Error("Kolom tidak lengkap.");

  await db
    .update(contentPages)
    .set({ title, bodyMd, updatedBy: user.id, updatedAt: new Date() })
    .where(eq(contentPages.key, key));

  revalidatePath("/admin/konten");
  revalidatePath(`/${key}`);
}
