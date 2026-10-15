import { z } from "zod";

const indonesianPhoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;

export const reporterIdentitySchema = z
  .object({
    isAnonymous: z.boolean().default(false),
    reporterName: z.string().optional(),
    reporterAddress: z.string().optional(),
    reporterPhone: z.string().optional(),
    reporterEmail: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isAnonymous) {
      if (!data.reporterName || data.reporterName.trim().length < 3 || data.reporterName.trim().length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reporterName"],
          message: "Nama pelapor wajib diisi (3-100 karakter)",
        });
      }
      if (!data.reporterAddress || data.reporterAddress.trim().length < 5 || data.reporterAddress.trim().length > 255) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reporterAddress"],
          message: "Alamat wajib diisi (minimal 5 karakter)",
        });
      }
      if (!data.reporterPhone || !indonesianPhoneRegex.test(data.reporterPhone.replace(/[\s-]/g, ""))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reporterPhone"],
          message: "Nomor WhatsApp tidak valid (format 08xx atau +62)",
        });
      }
      if (!data.reporterEmail || !z.string().email().safeParse(data.reporterEmail).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reporterEmail"],
          message: "Email pelapor tidak valid",
        });
      }
    }
  });

export const reportDetailsSchema = z
  .object({
    kind: z.enum(["pengaduan", "konsultasi"], {
      required_error: "Silakan pilih jenis laporan",
    }),
    categoryId: z.string().uuid("Kategori harus dipilih"),
    title: z
      .string()
      .min(5, "Judul minimal 5 karakter")
      .max(150, "Judul maksimal 150 karakter"),
    body: z
      .string()
      .min(20, "Deskripsi detail minimal 20 karakter agar petugas dapat memahami permasalahan")
      .max(5000, "Deskripsi maksimal 5000 karakter"),
    incidentDate: z.string().optional(),
    incidentLocation: z.string().optional(),
    consultMode: z.enum(["tatap_muka", "daring"]).optional(),
    consent: z.boolean().refine((val) => val === true, {
      message: "Anda wajib menyetujui pengolahan data untuk melanjutkan",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "pengaduan") {
      if (!data.incidentDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["incidentDate"],
          message: "Tanggal kejadian wajib diisi untuk pengaduan",
        });
      } else {
        const d = new Date(data.incidentDate);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (d > today) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["incidentDate"],
            message: "Tanggal kejadian tidak boleh di masa depan",
          });
        }
      }
      if (!data.incidentLocation || data.incidentLocation.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["incidentLocation"],
          message: "Lokasi kejadian wajib diisi untuk pengaduan",
        });
      }
    } else if (data.kind === "konsultasi") {
      if (!data.consultMode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["consultMode"],
          message: "Pilih metode konsultasi (tatap muka atau daring)",
        });
      }
    }
  });

export const checkStatusSchema = z.object({
  ticketCode: z
    .string()
    .trim()
    .min(5, "Kode tiket minimal 5 karakter")
    .max(20, "Kode tiket tidak valid"),
  pin: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "PIN harus 6 digit angka"),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

export const updateStatusSchema = z.object({
  reportId: z.string().uuid(),
  status: z.enum(["diterima", "diverifikasi", "ditindaklanjuti", "selesai", "dirujuk", "ditolak"]),
  note: z.string().optional(),
  visibleToReporter: z.boolean().default(false),
});

export const transferDivisionSchema = z.object({
  reportId: z.string().uuid(),
  divisionId: z.string().uuid(),
  note: z.string().optional(),
});
