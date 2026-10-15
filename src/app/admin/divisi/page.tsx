import { db } from "@/lib/db";
import { divisions, reports, users } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { createDivisionAction } from "@/actions/adminActions";
import { AppButton } from "@/components/ui/AppButton";
import { FormField } from "@/components/forms/FormField";
import { TextInputField } from "@/components/forms/TextInputField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { Building2, Plus, Shield } from "lucide-react";

export default async function AdminDivisiPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/admin");

  const divisionList = await db.query.divisions.findMany({
    with: {
      users: true,
      reports: true,
    },
    orderBy: [divisions.createdAt],
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F5A4B]">
          Master Divisi Paralegal
        </h1>
        <p className="text-sm text-[#3C4A45]/80 mt-1">
          Kelola divisi penanganan laporan dan penugasan paralegal Posbankum Kelurahan Mangunsari.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-[#CFE3DC] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#CFE3DC]">
            <h3 className="font-bold text-base text-[#184739]">Daftar Divisi Aktif</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFAF8] text-[#3C4A45] border-b border-[#CFE3DC] text-xs font-semibold uppercase">
                <tr>
                  <th className="px-5 py-3.5">Nama Divisi</th>
                  <th className="px-5 py-3.5">Deskripsi Bidang</th>
                  <th className="px-5 py-3.5 text-center">Petugas</th>
                  <th className="px-5 py-3.5 text-center">Laporan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CFE3DC]/60">
                {divisionList.map((d) => (
                  <tr key={d.id} className="hover:bg-[#EAF3F0]/20">
                    <td className="px-5 py-4 font-bold text-[#184739]">{d.name}</td>
                    <td className="px-5 py-4 text-xs text-[#3C4A45]/80 max-w-xs">
                      {d.description || "-"}
                    </td>
                    <td className="px-5 py-4 text-center font-semibold text-[#1F5A4B]">
                      {d.users.length}
                    </td>
                    <td className="px-5 py-4 text-center font-semibold text-[#865F17]">
                      {d.reports.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Tambah Divisi (1 Col) */}
        <div className="bg-white p-6 rounded-[16px] border border-[#CFE3DC] shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#184739] border-b border-[#CFE3DC] pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#C9962B]" />
            <span>Tambah Divisi Baru</span>
          </h3>

          <form action={createDivisionAction} className="space-y-4">
            <FormField label="Nama Divisi" htmlFor="name" required>
              <TextInputField
                id="name"
                name="name"
                placeholder="Contoh: Perlindungan Konsumen"
                required
              />
            </FormField>

            <FormField label="Deskripsi Wewenang / Bidang" htmlFor="description">
              <TextAreaField
                id="description"
                name="description"
                rows={3}
                placeholder="Tuliskan cakupan perkara divisi ini..."
              />
            </FormField>

            <AppButton type="submit" variant="primary" size="md" fullWidth>
              <span>Simpan Divisi</span>
            </AppButton>
          </form>
        </div>
      </div>
    </div>
  );
}
