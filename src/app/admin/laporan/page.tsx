import { db } from "@/lib/db";
import { reports, divisions, categories } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { eq, and, desc, like, or } from "drizzle-orm";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { DueIndicator } from "@/components/ui/DueIndicator";
import { Search, Filter, ShieldAlert } from "lucide-react";

interface SearchParamsProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    kind?: string;
    divisionId?: string;
  }>;
}

export default async function AdminLaporanPage({ searchParams }: SearchParamsProps) {
  const user = await getSession();
  if (!user) return null;

  const sp = await searchParams;
  const q = sp.q || "";
  const filterStatus = sp.status || "";
  const filterKind = sp.kind || "";
  const filterDivisionId = sp.divisionId || "";

  // Base role division filter
  const isParalegal = user.role === "paralegal";
  const userDivisionId = isParalegal ? user.divisionId : undefined;

  const allDivisions = await db.query.divisions.findMany({
    where: eq(divisions.isActive, true),
  });

  const queryReports = await db.query.reports.findMany({
    with: {
      category: true,
      division: true,
    },
    orderBy: [desc(reports.createdAt)],
  });

  // Client-safe filtering
  const filteredReports = queryReports.filter((r) => {
    // Role division constraint
    if (userDivisionId && r.divisionId !== userDivisionId) return false;
    // Division filter dropdown
    if (filterDivisionId && r.divisionId !== filterDivisionId) return false;
    // Status filter
    if (filterStatus && r.status !== filterStatus) return false;
    // Kind filter
    if (filterKind && r.kind !== filterKind) return false;
    // Search query
    if (q) {
      const matchTicket = r.ticketCode.toLowerCase().includes(q.toLowerCase());
      const matchTitle = r.title.toLowerCase().includes(q.toLowerCase());
      const matchName = r.reporterName?.toLowerCase().includes(q.toLowerCase());
      if (!matchTicket && !matchTitle && !matchName) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F5A4B]">
            Daftar Seluruh Laporan
          </h1>
          <p className="text-sm text-[#3C4A45]/80 mt-1">
            {isParalegal
              ? `Menampilkan laporan khusus untuk Divisi Anda (${user.divisionId ? "Aktif" : ""})`
              : "Menampilkan seluruh laporan pengaduan & konsultasi warga Kelurahan Mangunsari."}
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <form
        method="GET"
        className="bg-white p-4 sm:p-5 rounded-[12px] border border-[#CFE3DC] shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
      >
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari nomor tiket, judul, pelapor..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-[8px] border border-[#CFE3DC] focus:ring-2 focus:ring-[#C9962B] outline-none"
          />
          <Search className="w-4 h-4 text-[#3C4A45]/50 absolute left-3 top-2.5" />
        </div>

        {/* Filter Status */}
        <div>
          <select
            name="status"
            defaultValue={filterStatus}
            className="w-full px-3 py-2 text-sm rounded-[8px] border border-[#CFE3DC] bg-white focus:ring-2 focus:ring-[#C9962B] outline-none cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="diterima">Diterima</option>
            <option value="diverifikasi">Diverifikasi</option>
            <option value="ditindaklanjuti">Ditindaklanjuti</option>
            <option value="selesai">Selesai</option>
            <option value="dirujuk">Dirujuk</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>

        {/* Filter Jenis */}
        <div>
          <select
            name="kind"
            defaultValue={filterKind}
            className="w-full px-3 py-2 text-sm rounded-[8px] border border-[#CFE3DC] bg-white focus:ring-2 focus:ring-[#C9962B] outline-none cursor-pointer"
          >
            <option value="">Semua Jenis</option>
            <option value="pengaduan">Pengaduan Perkara</option>
            <option value="konsultasi">Konsultasi Hukum</option>
          </select>
        </div>

        {/* Filter Divisi (hanya jika bukan paralegal spesifik) */}
        {!isParalegal ? (
          <div>
            <select
              name="divisionId"
              defaultValue={filterDivisionId}
              className="w-full px-3 py-2 text-sm rounded-[8px] border border-[#CFE3DC] bg-white focus:ring-2 focus:ring-[#C9962B] outline-none cursor-pointer"
            >
              <option value="">Semua Divisi</option>
              {allDivisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <button
              type="submit"
              className="w-full bg-[#1F5A4B] text-white py-2 text-sm font-semibold rounded-[8px] hover:bg-[#184739]"
            >
              Terapkan Filter
            </button>
          </div>
        )}

        {!isParalegal && (
          <div className="lg:col-span-5 flex justify-end gap-2 pt-1">
            <Link
              href="/admin/laporan"
              className="text-xs text-[#3C4A45]/70 hover:underline py-1"
            >
              Reset Filter
            </Link>
            <button
              type="submit"
              className="bg-[#1F5A4B] text-white px-4 py-1.5 text-xs font-semibold rounded-[8px] hover:bg-[#184739]"
            >
              Terapkan Filter
            </button>
          </div>
        )}
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-[16px] border border-[#CFE3DC] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#CFE3DC] flex items-center justify-between text-xs sm:text-sm text-[#3C4A45]">
          <span>Ditemukan <strong>{filteredReports.length}</strong> laporan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFAF8] text-[#3C4A45] border-b border-[#CFE3DC] font-semibold text-xs uppercase">
              <tr>
                <th className="px-5 py-3.5">Kode Tiket</th>
                <th className="px-5 py-3.5">Judul & Kategori</th>
                <th className="px-5 py-3.5">Divisi Tujuan</th>
                <th className="px-5 py-3.5">Pelapor</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">SLA</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CFE3DC]/60">
              {filteredReports.map((r) => (
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
                      <span className="text-[10px] font-semibold uppercase text-gray-500">
                        {r.kind}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-[#3C4A45]">
                    {r.division?.name}
                  </td>
                  <td className="px-5 py-4">
                    {r.isAnonymous ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                        Anonim
                      </span>
                    ) : (
                      <div>
                        <p className="font-medium text-[#3C4A45] text-xs sm:text-sm">
                          {r.reporterName}
                        </p>
                        <p className="text-[11px] text-[#3C4A45]/60">{r.reporterPhone}</p>
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
                      Buka
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#3C4A45]/60">
                    Tidak ada laporan yang cocok dengan kriteria pencarian.
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
