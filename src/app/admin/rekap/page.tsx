import { db } from "@/lib/db";
import { reports, divisions, categories } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { eq, desc } from "drizzle-orm";
import { BarChart3, TrendingUp, CheckCircle, ShieldCheck } from "lucide-react";

export default async function AdminRekapPage() {
  const user = await getSession();
  if (!user) return null;

  const allReports = await db.query.reports.findMany({
    with: {
      category: true,
      division: true,
    },
  });

  const allDivisions = await db.query.divisions.findMany({
    where: eq(divisions.isActive, true),
  });

  // Aggregates
  const total = allReports.length;
  const pengaduanCount = allReports.filter((r) => r.kind === "pengaduan").length;
  const konsultasiCount = allReports.filter((r) => r.kind === "konsultasi").length;
  const anonymousCount = allReports.filter((r) => r.isAnonymous).length;
  const specialCount = allReports.filter((r) => r.isSpecial).length;

  const statusCounts = {
    diterima: allReports.filter((r) => r.status === "diterima").length,
    diverifikasi: allReports.filter((r) => r.status === "diverifikasi").length,
    ditindaklanjuti: allReports.filter((r) => r.status === "ditindaklanjuti").length,
    selesai: allReports.filter((r) => r.status === "selesai").length,
    dirujuk: allReports.filter((r) => r.status === "dirujuk").length,
    ditolak: allReports.filter((r) => r.status === "ditolak").length,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F5A4B]">
          Rekapitulasi & Statistik Posbankum
        </h1>
        <p className="text-sm text-[#3C4A45]/80 mt-1">
          Laporan agregat penanganan perkara hukum warga Kelurahan Mangunsari.
        </p>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[12px] border border-[#CFE3DC]">
          <span className="text-xs uppercase font-semibold text-[#3C4A45]/70">
            Total Laporan Masuk
          </span>
          <p className="text-3xl font-extrabold text-[#1F5A4B] mt-1">{total}</p>
        </div>

        <div className="bg-white p-5 rounded-[12px] border border-[#CFE3DC]">
          <span className="text-xs uppercase font-semibold text-[#184739]">
            Pengaduan Perkara
          </span>
          <p className="text-3xl font-extrabold text-[#184739] mt-1">{pengaduanCount}</p>
        </div>

        <div className="bg-white p-5 rounded-[12px] border border-[#CFE3DC]">
          <span className="text-xs uppercase font-semibold text-[#865F17]">
            Konsultasi Hukum
          </span>
          <p className="text-3xl font-extrabold text-[#865F17] mt-1">{konsultasiCount}</p>
        </div>

        <div className="bg-white p-5 rounded-[12px] border border-[#CFE3DC]">
          <span className="text-xs uppercase font-semibold text-[#A87A1E]">
            Laporan Khusus PPA
          </span>
          <p className="text-3xl font-extrabold text-[#A87A1E] mt-1">{specialCount}</p>
        </div>
      </div>

      {/* Distribution by Status */}
      <div className="bg-white rounded-[16px] border border-[#CFE3DC] p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#184739]">Sebaran Status Penanganan</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-[#E8EEF5] rounded-[10px] text-center border border-[#BFD3E6]">
            <span className="text-xs font-semibold text-[#2C4A6B]">Diterima</span>
            <p className="text-xl font-bold text-[#2C4A6B] mt-1">{statusCounts.diterima}</p>
          </div>
          <div className="p-3.5 bg-[#FBF4E2] rounded-[10px] text-center border border-[#F5E4B8]">
            <span className="text-xs font-semibold text-[#865F17]">Diverifikasi</span>
            <p className="text-xl font-bold text-[#865F17] mt-1">{statusCounts.diverifikasi}</p>
          </div>
          <div className="p-3.5 bg-[#EAF3F0] rounded-[10px] text-center border border-[#CFE3DC]">
            <span className="text-xs font-semibold text-[#184739]">Ditindaklanjuti</span>
            <p className="text-xl font-bold text-[#184739] mt-1">{statusCounts.ditindaklanjuti}</p>
          </div>
          <div className="p-3.5 bg-[#1F5A4B] text-white rounded-[10px] text-center">
            <span className="text-xs font-semibold text-[#F7F3E8]">Selesai</span>
            <p className="text-xl font-bold text-[#F7F3E8] mt-1">{statusCounts.selesai}</p>
          </div>
          <div className="p-3.5 bg-[#EEE9F5] rounded-[10px] text-center border border-[#D7C9EC]">
            <span className="text-xs font-semibold text-[#4A3A6B]">Dirujuk</span>
            <p className="text-xl font-bold text-[#4A3A6B] mt-1">{statusCounts.dirujuk}</p>
          </div>
          <div className="p-3.5 bg-[#F6E6E3] rounded-[10px] text-center border border-[#ECC4BD]">
            <span className="text-xs font-semibold text-[#8A2E24]">Ditolak</span>
            <p className="text-xl font-bold text-[#8A2E24] mt-1">{statusCounts.ditolak}</p>
          </div>
        </div>
      </div>

      {/* Distribution by Division Table */}
      <div className="bg-white rounded-[16px] border border-[#CFE3DC] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#CFE3DC]">
          <h3 className="font-bold text-base text-[#184739]">
            Rekapitulasi Berdasarkan Divisi Paralegal
          </h3>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAFAF8] text-[#3C4A45] border-b border-[#CFE3DC] text-xs font-semibold uppercase">
            <tr>
              <th className="px-5 py-3.5">Nama Divisi</th>
              <th className="px-5 py-3.5 text-center">Total Laporan</th>
              <th className="px-5 py-3.5 text-center">Sedang Proses</th>
              <th className="px-5 py-3.5 text-center">Selesai / Dirujuk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CFE3DC]/60">
            {allDivisions.map((d) => {
              const divReports = allReports.filter((r) => r.divisionId === d.id);
              const divProcessing = divReports.filter((r) =>
                ["diterima", "diverifikasi", "ditindaklanjuti"].includes(r.status)
              ).length;
              const divDone = divReports.filter((r) =>
                ["selesai", "dirujuk"].includes(r.status)
              ).length;

              return (
                <tr key={d.id} className="hover:bg-[#EAF3F0]/20">
                  <td className="px-5 py-3.5 font-bold text-[#184739]">{d.name}</td>
                  <td className="px-5 py-3.5 text-center font-bold text-[#1F5A4B]">
                    {divReports.length}
                  </td>
                  <td className="px-5 py-3.5 text-center font-medium text-[#865F17]">
                    {divProcessing}
                  </td>
                  <td className="px-5 py-3.5 text-center font-medium text-[#184739]">
                    {divDone}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
