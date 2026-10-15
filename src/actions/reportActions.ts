"use server";

import { db } from "@/lib/db";
import { reports, reportEvents, categories, attachments, siteSettings } from "@/lib/db/schema";
import { generateTicketCode, generatePin, hashPin, verifyPin } from "@/lib/tickets";
import { reporterIdentitySchema, reportDetailsSchema, checkStatusSchema } from "@/lib/validators";
import { eq, desc } from "drizzle-orm";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export interface SubmitReportResult {
  success: boolean;
  error?: string;
  ticketCode?: string;
  pin?: string;
}

export async function submitReportAction(formData: FormData): Promise<SubmitReportResult> {
  try {
    const isAnonymous = formData.get("isAnonymous") === "true";
    const reporterName = formData.get("reporterName")?.toString() || undefined;
    const reporterAddress = formData.get("reporterAddress")?.toString() || undefined;
    const reporterPhone = formData.get("reporterPhone")?.toString() || undefined;
    const reporterEmail = formData.get("reporterEmail")?.toString() || undefined;

    // Validate identity
    const identityResult = reporterIdentitySchema.safeParse({
      isAnonymous,
      reporterName,
      reporterAddress,
      reporterPhone,
      reporterEmail,
    });

    if (!identityResult.success) {
      return {
        success: false,
        error: identityResult.error.errors[0]?.message || "Data identitas tidak valid",
      };
    }

    const kind = formData.get("kind")?.toString() as "pengaduan" | "konsultasi";
    const categoryId = formData.get("categoryId")?.toString() || "";
    const title = formData.get("title")?.toString() || "";
    const body = formData.get("body")?.toString() || "";
    const incidentDate = formData.get("incidentDate")?.toString() || undefined;
    const incidentLocation = formData.get("incidentLocation")?.toString() || undefined;
    const consultMode = formData.get("consultMode")?.toString() as "tatap_muka" | "daring" | undefined;
    const consent = formData.get("consent") === "true";

    // Validate report details
    const detailsResult = reportDetailsSchema.safeParse({
      kind,
      categoryId,
      title,
      body,
      incidentDate,
      incidentLocation,
      consultMode,
      consent,
    });

    if (!detailsResult.success) {
      return {
        success: false,
        error: detailsResult.error.errors[0]?.message || "Data laporan tidak valid",
      };
    }

    // Lookup category to get divisionId and isSpecial
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });

    if (!category) {
      return { success: false, error: "Kategori yang dipilih tidak ditemukan" };
    }

    // Generate Ticket Code & PIN
    const ticketCode = generateTicketCode();
    const pin = generatePin();
    const lookupPinHash = hashPin(pin);

    // Compute SLA due dates
    const now = new Date();
    const respondDueAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    const resolveDueAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Insert Report
    const [insertedReport] = await db
      .insert(reports)
      .values({
        ticketCode,
        lookupPinHash,
        kind,
        categoryId: category.id,
        divisionId: category.divisionId,
        isSpecial: category.isSpecial,
        title,
        body,
        incidentDate: incidentDate || null,
        incidentLocation: incidentLocation || null,
        consultMode: consultMode || null,
        isAnonymous,
        reporterName: isAnonymous ? null : reporterName,
        reporterAddress: isAnonymous ? null : reporterAddress,
        reporterPhone: isAnonymous ? null : reporterPhone,
        reporterEmail: isAnonymous ? null : reporterEmail,
        status: "diterima",
        respondDueAt,
        resolveDueAt,
        consentAt: now,
        consentVersion: "v1.0-UU-PDP-27-2022",
      })
      .returning();

    // Insert initial event: Diterima
    await db.insert(reportEvents).values({
      reportId: insertedReport.id,
      eventType: "status",
      toStatus: "diterima",
      note: "Laporan berhasil diterima oleh sistem Posbankum.",
      visibleToReporter: true,
    });

    // Handle File Attachment (if any)
    const files = formData.getAll("attachments") as File[];
    const uploadDir = path.join(process.cwd(), "storage", "attachments");

    for (const file of files) {
      if (file && file.size > 0 && file.size <= 5 * 1024 * 1024) {
        const fileExt = path.extname(file.name);
        const storageKey = `${randomUUID()}${fileExt}`;
        const filePath = path.join(uploadDir, storageKey);
        const arrayBuffer = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(arrayBuffer));

        await db.insert(attachments).values({
          reportId: insertedReport.id,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          storageKey,
        });
      }
    }

    return {
      success: true,
      ticketCode,
      pin,
    };
  } catch (err) {
    console.error("Gagal submit laporan:", err);
    return {
      success: false,
      error: "Terjadi kesalahan pada server saat memproses laporan Anda. Silakan coba kembali.",
    };
  }
}

export interface CheckStatusResult {
  success: boolean;
  error?: string;
  data?: {
    ticketCode: string;
    kind: "pengaduan" | "konsultasi";
    categoryName: string;
    isSpecial: boolean;
    title: string;
    status: string;
    createdAt: string;
    respondDueAt: string;
    resolveDueAt: string;
    events: {
      toStatus: string | null;
      note: string | null;
      createdAt: string;
    }[];
  };
}

export async function checkStatusAction(
  ticketCodeRaw: string,
  pinRaw: string
): Promise<CheckStatusResult> {
  try {
    const parse = checkStatusSchema.safeParse({
      ticketCode: ticketCodeRaw,
      pin: pinRaw,
    });

    if (!parse.success) {
      return {
        success: false,
        error: "Format kode tiket atau PIN tidak valid",
      };
    }

    const { ticketCode, pin } = parse.data;

    // Cari laporan berdasarkan ticket code
    const report = await db.query.reports.findFirst({
      where: eq(reports.ticketCode, ticketCode.toUpperCase()),
      with: {
        category: true,
        events: {
          where: eq(reportEvents.visibleToReporter, true),
          orderBy: [desc(reportEvents.createdAt)],
        },
      },
    });

    if (!report) {
      // Kalimat umum demi keamanan (anti-bruteforce enum)
      return {
        success: false,
        error: "Kode tiket atau PIN tidak cocok dengan catatan kami",
      };
    }

    const isPinValid = verifyPin(pin, report.lookupPinHash);
    if (!isPinValid) {
      return {
        success: false,
        error: "Kode tiket atau PIN tidak cocok dengan catatan kami",
      };
    }

    return {
      success: true,
      data: {
        ticketCode: report.ticketCode,
        kind: report.kind as "pengaduan" | "konsultasi",
        categoryName: report.category?.name || "Umum",
        isSpecial: report.isSpecial,
        title: report.title,
        status: report.status,
        createdAt: report.createdAt.toISOString(),
        respondDueAt: report.respondDueAt.toISOString(),
        resolveDueAt: report.resolveDueAt.toISOString(),
        events: report.events.map((e) => ({
          toStatus: e.toStatus,
          note: e.note,
          createdAt: e.createdAt.toISOString(),
        })),
      },
    };
  } catch (err) {
    console.error("Gagal cek status:", err);
    return {
      success: false,
      error: "Terjadi gangguan koneksi ke server saat memeriksa status tiket.",
    };
  }
}

export async function getActiveCategoriesAction() {
  try {
    return await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [categories.sortOrder],
    });
  } catch {
    return [];
  }
}

export async function getSiteSettingsAction() {
  try {
    const settings = await db.query.siteSettings.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  } catch {
    return {};
  }
}
