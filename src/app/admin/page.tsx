import { db } from "@/lib/db";
import { reports, categories, divisions, accessLogs } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { eq, and, desc, sql } from "drizzle-orm";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { DueIndicator } from "@/components/ui/DueIndicator";
import {
  FileText,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getSession();
  if (!user) return null;

  // Query filter based on role (Paralegal only sees its division)
  const divisionFilter =
    user.role === "paralegal" && user.divisionId
      ? eq(reports.divisionId, user.divisionId)
      : undefined;

  const allReports = await db.query.reports.findMany({
    where: divisionFilter,
    with: {
      category: true,
      division: true,
    },
    orderBy: [desc(reports.createdAt)],
  });

  const totalReports = allReports.length;
  const newReports = allReports.filter((r) => r.status === "diterima").length;
  const inProgressReports = allReports.filter((r) =>
    ["diverifikasi", "ditindaklanjuti"].includes(r.status)
  ).length;
  const completedReports = allReports.filter((r) =>
    ["selesai", "dirujuk"].includes(r.status)
  ).length;
  const specialReports = allReports.filter((r) => r.isSpecial).length;

  const dueSoonReports = allReports.filter(
    (r) =>
      r.status === "diterima" &&
      new Date(r.respondDueAt).getTime() - Date.now() < 12 * 60 * 60 * 1000
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1F5A4B] to-[#184739] text-[#F7F3E8] p-6 sm:p-8 rounded-[16px] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#EBCF8A] font-semibold">
            Panel Kerja Pos Bantuan Hukum
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Selamat Datang, {user.name}
          </h1>
          <p className="text-sm text-[#CFE3DC] mt-1">
            Pantau dan kelola pengaduan serta permohonan konsultasi warga Kelurahan Mangunsari.
          </p>
        </div>
        <div>
          <Link
            href="/admin/laporan"
            className="inline-flex items-center gap-2 bg-[#C9962B] text-[#0B231C] font-bold px-4 py-2.5 rounded-[10px] text-sm hover:bg-[#A87A1E] transition-colors shadow-sm"
          >
            <span>Buka Semua Laporan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-[12px] border border-[#CFE3DC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#3C4A45]/70 uppercase">
              Total Laporan
            </span>
            <FileText className="w-5 h-5 text-[#1F5A4B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1F5A4B] mt-2">
            {totalReports}
          </p>
          <span className="text-xs text-[#3C4A45]/60 mt-1 block">Semua laporan terdata</span>
        </div>

        <div className="bg-white p-5 rounded-[12px] border border-[#CFE3DC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#865F17] uppercase">
              Perlu Respons
            </span>
            <Clock className="w-5 h-5 text-[#C9962B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#865F17] mt-2">
            {newReports}
          </p>
          <span className="text-xs text-[#865F17]/80 mt-1 block">Status 'Diterima'</span>
        </div>

        <div className="bg-white p-5 rounded-[12px] border border-[#CFE3DC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#184739] uppercase">
              Sedang Diproses
            </span>
            <TrendingUp className="w-5 h-5 text-[#2A6B59]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#184739] mt-2">
            {inProgressReports}
          </p>
          <span className="text-xs text-[#184739]/80 mt-1 block">Verifikasi / Tindak Lanjut</span>
        </div>

        <div className="bg-white p-5 rounded-[12px] border border-[#CFE3DC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A87A1E] uppercase">
              Khusus (PPA)
            </span>
            <ShieldAlert className="w-5 h-5 text-[#C9962B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#A87A1E] mt-2">
            {specialReports}
          </p>
          <span className="text-xs text-[#A87A1E]/80 mt-1 block">Sensitif & Prioritas</span>
        </div>
      </div>

      {/* DUE SOON WARNING (IF ANY) */}
      {dueSoonReports.length > 0 && (
        <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] p-5 rounded-[12px] space-y-3">
          <div className="flex items-center gap-2 text-[#92400E] font-bold text-base">
            <Clock className="w-5 h-5" />
            <span>Peringatan SLA: {dueSoonReports.length} Laporan Mendekati Batas 24 Jam</span>
          </div>
          <div className="space-y-2">
            {dueSoonReports.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-white/80 p-3 rounded-lg text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#1F5A4B]">{r.ticketCode}</span>
                  <span className="font-medium text-[#3C4A45]">{r.title}</span>
                </div>
                <Link
                  href={`/admin/laporan/${r.id}`}
                  className="text-xs font-bold text-[#92400E] hover:underline"
                >
                  Tindak Lanjuti →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LAPORAN TERBARU TABLE */}
      <div className="bg-white rounded-[16px] border border-[#CFE3DC] shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#CFE3DC] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-[#1F5A4B]">Laporan Terbaru Masuk</h3>
            <p className="text-xs text-[#3C4A45]/70">Daftar laporan teratas yang memerlukan tindakan</p>
          </div>
          <Link
            href="/admin/laporan"
            className="text-sm font-semibold text-[#1F5A4B] hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFAF8] text-[#3C4A45] border-b border-[#CFE3DC] font-semibold text-xs uppercase">
              <tr>
                <th className="px-5 py-3.5">Kode Tiket</th>
                <th className="px-5 py-3.5">Judul & Kategori</th>
                <th className="px-5 py-3.5">Pelapor</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">SLA Respons</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CFE3DC]/60">
              {allReports.slice(0, 7).map((r) => (
                <tr key={r.id} className="hover:bg-[#EAF3F0]/30 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-[#1F5A4B]">
                    {r.ticketCode}
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="font-semibold text-[#184739] truncate">{r.title}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <CategoryBadge
                        name={r.category?.name || "Umum"}
                        isSpecial={r.isSpecial}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {r.isAnonymous ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                        Anonim
                      </span>
                    ) : (
                      <div>
                        <p className="font-medium text-[#3C4A45]">{r.reporterName}</p>
                        <p className="text-xs text-[#3C4A45]/60">{r.reporterPhone}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-4">
                    <DueIndicator
                      dueDate={r.respondDueAt}
                      isCompleted={!!r.firstResponseAt}
                      type="respons"
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/laporan/${r.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-[8px] text-xs font-semibold bg-[#1F5A4B] text-[#F7F3E8] hover:bg-[#184739] transition-colors"
                    >
                      Buka Detail
                    </Link>
                  </td>
                </tr>
              ))}
              {allReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#3C4A45]/60">
                    Belum ada data laporan yang masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
