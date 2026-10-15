import { db } from "@/lib/db";
import { reports, reportEvents, accessLogs, divisions } from "@/lib/db/schema";
import { getSession, canViewReport } from "@/lib/auth/session";
import { eq, desc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { DueIndicator } from "@/components/ui/DueIndicator";
import { AppButton } from "@/components/ui/AppButton";
import { FormField } from "@/components/forms/FormField";
import { SelectField } from "@/components/forms/SelectField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { updateReportStatusAction, transferReportDivisionAction } from "@/actions/adminActions";
import {
  FileText,
  User,
  MapPin,
  Calendar,
  Paperclip,
  Clock,
  ArrowLeft,
  Shield,
  Building,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: Props) {
  const user = await getSession();
  if (!user) redirect("/login");

  const { id } = await params;

  const report = await db.query.reports.findFirst({
    where: eq(reports.id, id),
    with: {
      category: true,
      division: true,
      attachments: true,
      events: {
        with: {
          actor: true,
          fromDivision: true,
          toDivision: true,
        },
        orderBy: [desc(reportEvents.createdAt)],
      },
    },
  });

  if (!report) {
    notFound();
  }

  // Check RBAC permission
  if (!canViewReport(user, report)) {
    return (
      <div className="bg-white p-8 rounded-[16px] border border-[#DC2626] max-w-lg mx-auto text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-[#DC2626] mx-auto" />
        <h2 className="text-xl font-bold text-[#991B1B]">Akses Dibatasi</h2>
        <p className="text-sm text-[#3C4A45]">
          Laporan ini berada di luar divisi penanganan Anda. Sebagai paralegal, Anda hanya memiliki hak akses untuk membuka laporan pada divisi Anda sendiri.
        </p>
        <Link
          href="/admin/laporan"
          className="inline-block mt-2 text-sm font-semibold text-[#1F5A4B] underline"
        >
          ← Kembali ke Daftar Laporan Divisi Anda
        </Link>
      </div>
    );
  }

  // Audit Access Log (PRD 8 & 9.1)
  await db.insert(accessLogs).values({
    userId: user.id,
    reportId: report.id,
    action: "lihat_detail_laporan",
  });

  const allDivisions = await db.query.divisions.findMany({
    where: eq(divisions.isActive, true),
  });

  const canTransfer = user.role === "admin" || user.role === "lurah";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/laporan"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F5A4B] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Laporan</span>
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={report.status} />
          <DueIndicator
            dueDate={report.respondDueAt}
            isCompleted={!!report.firstResponseAt}
            type="respons"
          />
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-[16px] border border-[#CFE3DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-2xl text-[#1F5A4B]">
              {report.ticketCode}
            </span>
            <CategoryBadge
              name={report.category?.name || "Umum"}
              isSpecial={report.isSpecial}
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#184739] mt-2">
            {report.title}
          </h1>
          <p className="text-xs text-[#3C4A45]/70 mt-1">
            Diterima pada:{" "}
            {new Date(report.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            WIB
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end text-xs sm:text-sm text-[#3C4A45]/80">
          <div>Divisi Penanganan:</div>
          <div className="font-bold text-[#1F5A4B] text-base mt-0.5">
            {report.division?.name}
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Case Content & Timeline), Right (Reporter & Action Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Uraian Laporan */}
          <div className="bg-white p-6 rounded-[16px] border border-[#CFE3DC] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#184739] border-b border-[#CFE3DC] pb-3">
              Uraian & Kronologi Perkara
            </h3>

            <div className="text-sm sm:text-base text-[#3C4A45] leading-relaxed whitespace-pre-line bg-[#FAFAF8] p-4 rounded-[10px] border border-[#CFE3DC]">
              {report.body}
            </div>

            {/* Extra Pengaduan / Konsultasi info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
              {report.kind === "pengaduan" ? (
                <>
                  <div className="flex items-center gap-2 text-[#3C4A45]">
                    <Calendar className="w-4 h-4 text-[#C9962B]" />
                    <span>
                      Kejadian: <strong>{report.incidentDate || "-"}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#3C4A45]">
                    <MapPin className="w-4 h-4 text-[#C9962B]" />
                    <span>
                      Lokasi: <strong>{report.incidentLocation || "-"}</strong>
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-[#3C4A45] sm:col-span-2">
                  <User className="w-4 h-4 text-[#C9962B]" />
                  <span>
                    Metode Konsultasi:{" "}
                    <strong className="capitalize">
                      {report.consultMode === "tatap_muka"
                        ? "Tatap Muka di Kelurahan"
                        : "Daring (WhatsApp / Online)"}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* Lampiran Berkas */}
            {report.attachments.length > 0 && (
              <div className="pt-4 border-t border-[#CFE3DC]">
                <h4 className="font-semibold text-sm text-[#184739] mb-2 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-[#C9962B]" />
                  <span>Dokumen Pendukung Terlampir ({report.attachments.length})</span>
                </h4>
                <div className="space-y-2">
                  {report.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-3 rounded-[8px] bg-[#EAF3F0] text-sm text-[#184739]"
                    >
                      <div className="truncate max-w-xs">
                        <p className="font-medium truncate">{att.fileName}</p>
                        <p className="text-xs text-[#3C4A45]/60">
                          {(att.sizeBytes / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <a
                        href={`/api/lampiran/${att.id}`}
                        target="_blank"
                        className="text-xs font-bold text-[#1F5A4B] hover:underline bg-white px-3 py-1.5 rounded border border-[#CFE3DC]"
                      >
                        Unduh Berkas
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Riwayat Status & Catatan Petugas */}
          <div className="bg-white p-6 rounded-[16px] border border-[#CFE3DC] shadow-xs space-y-5">
            <h3 className="font-bold text-base text-[#184739] border-b border-[#CFE3DC] pb-3">
              Riwayat Penanganan & Log Perubahan Status
            </h3>

            <div className="relative pl-6 border-l-2 border-[#CFE3DC] space-y-6">
              {report.events.map((evt) => (
                <div key={evt.id} className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#1F5A4B] ring-4 ring-[#EAF3F0]" />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {evt.toStatus && <StatusBadge status={evt.toStatus} />}
                      <span className="text-xs text-[#3C4A45]/70">
                        {new Date(evt.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        WIB
                      </span>
                      {evt.actor && (
                        <span className="text-xs font-semibold text-[#184739] bg-[#EAF3F0] px-2 py-0.5 rounded">
                          Oleh: {evt.actor.name}
                        </span>
                      )}
                      {evt.visibleToReporter && (
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                          Publik
                        </span>
                      )}
                    </div>

                    {evt.note && (
                      <p className="text-sm text-[#3C4A45] bg-[#FAFAF8] p-3 rounded-lg border border-[#CFE3DC]/70 mt-1.5">
                        {evt.note}
                      </p>
                    )}

                    {evt.eventType === "pindah_divisi" && (
                      <p className="text-xs font-semibold text-[#865F17]">
                        Divisi dialihkan: {evt.fromDivision?.name} → {evt.toDivision?.name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Reporter Identity & Action Forms */}
        <div className="space-y-6">
          {/* Identitas Pelapor */}
          <div className="bg-white p-6 rounded-[16px] border border-[#CFE3DC] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#184739] border-b border-[#CFE3DC] pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#C9962B]" />
              <span>Identitas Pelapor</span>
            </h3>

            {report.isAnonymous ? (
              <div className="p-4 rounded-[10px] bg-[#FBF4E2] border border-[#EBCF8A] text-xs sm:text-sm text-[#865F17]">
                <strong>Pelapor Memilih Anonim.</strong>
                <p className="mt-1 text-xs">
                  Nama dan nomor kontak tidak direkam demi keselamatan korban / kerahasiaan. Tindak lanjut dikomunikasikan via halaman Cek Status.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-xs text-[#3C4A45]/60 block">Nama Lengkap:</span>
                  <span className="font-bold text-base text-[#184739]">
                    {report.reporterName}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#3C4A45]/60 block">Nomor WhatsApp:</span>
                  <a
                    href={`https://wa.me/${report.reporterPhone?.replace(/\D/g, "")}`}
                    target="_blank"
                    className="font-semibold text-[#1F5A4B] hover:underline"
                  >
                    {report.reporterPhone}
                  </a>
                </div>
                <div>
                  <span className="text-xs text-[#3C4A45]/60 block">Email:</span>
                  <span className="font-medium text-[#3C4A45]">{report.reporterEmail}</span>
                </div>
                <div>
                  <span className="text-xs text-[#3C4A45]/60 block">Alamat Domisili:</span>
                  <span className="font-medium text-[#3C4A45]">{report.reporterAddress}</span>
                </div>
              </div>
            )}
          </div>

          {/* Form Ubah Status & Tambah Catatan */}
          <div className="bg-white p-6 rounded-[16px] border border-[#CFE3DC] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#1F5A4B] border-b border-[#CFE3DC] pb-3">
              Tindak Lanjut & Status
            </h3>

            <form action={updateReportStatusAction} className="space-y-4">
              <input type="hidden" name="reportId" value={report.id} />

              <FormField label="Ubah Status Menjadi" htmlFor="status" required>
                <select
                  id="status"
                  name="status"
                  defaultValue={report.status}
                  className="w-full px-3 py-2.5 rounded-[10px] border border-[#CFE3DC] text-sm bg-white font-semibold text-[#184739] outline-none"
                >
                  <option value="diterima">Diterima</option>
                  <option value="diverifikasi">Diverifikasi (Sedang diteliti)</option>
                  <option value="ditindaklanjuti">Ditindaklanjuti (Jadwal mediasi/konsultasi)</option>
                  <option value="selesai">Selesai (Kasus ditutup damai/selesai)</option>
                  <option value="dirujuk">Dirujuk (Ke LBH / Kepolisian)</option>
                  <option value="ditolak">Ditolak / Di Luar Wewenang</option>
                </select>
              </FormField>

              <FormField
                label="Catatan Tindak Lanjut"
                htmlFor="note"
                hint="Jadwal mediasi, hasil verifikasi, atau alasan penutupan"
              >
                <TextAreaField
                  id="note"
                  name="note"
                  rows={3}
                  placeholder="Tuliskan catatan proses..."
                />
              </FormField>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="visibleToReporter"
                  name="visibleToReporter"
                  value="true"
                  defaultChecked
                  className="rounded text-[#1F5A4B] focus:ring-[#C9962B]"
                />
                <label
                  htmlFor="visibleToReporter"
                  className="text-xs font-semibold text-[#184739] cursor-pointer"
                >
                  Dapat dilihat pelapor saat Cek Status
                </label>
              </div>

              <AppButton type="submit" variant="primary" size="md" fullWidth>
                <span>Simpan Tindak Lanjut</span>
              </AppButton>
            </form>
          </div>

          {/* Form Pindah Divisi (Hanya Lurah / Admin) */}
          {canTransfer && (
            <div className="bg-[#FAFAF8] p-6 rounded-[16px] border border-[#CFE3DC] space-y-4">
              <h3 className="font-bold text-sm text-[#184739] border-b border-[#CFE3DC] pb-2 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#C9962B]" />
                <span>Alihkan ke Divisi Lain (Pimpinan)</span>
              </h3>

              <form action={transferReportDivisionAction} className="space-y-3">
                <input type="hidden" name="reportId" value={report.id} />

                <div>
                  <label className="text-xs font-semibold text-[#3C4A45] block mb-1">
                    Pilih Divisi Tujuan:
                  </label>
                  <select
                    name="divisionId"
                    defaultValue={report.divisionId}
                    className="w-full px-3 py-2 text-xs rounded-[8px] border border-[#CFE3DC] bg-white outline-none"
                  >
                    {allDivisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  name="note"
                  placeholder="Alasan pemindahan..."
                  className="w-full px-3 py-1.5 text-xs rounded-[8px] border border-[#CFE3DC] outline-none"
                />

                <AppButton type="submit" variant="secondary" size="sm" fullWidth>
                  <span>Pindahkan Divisi</span>
                </AppButton>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
