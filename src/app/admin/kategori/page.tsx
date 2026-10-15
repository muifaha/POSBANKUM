import { db } from "@/lib/db";
import { categories, divisions } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { createCategoryAction } from "@/actions/adminActions";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { AppButton } from "@/components/ui/AppButton";
import { FormField } from "@/components/forms/FormField";
import { TextInputField } from "@/components/forms/TextInputField";
import { SelectField } from "@/components/forms/SelectField";
import { eq } from "drizzle-orm";
import { Plus, ShieldAlert } from "lucide-react";

export default async function AdminKategoriPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/admin");

  const categoryList = await db.query.categories.findMany({
    with: {
      division: true,
    },
    orderBy: [categories.sortOrder],
  });

  const divisionList = await db.query.divisions.findMany({
    where: eq(divisions.isActive, true),
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F5A4B]">
          Master Kategori Perkara
        </h1>
        <p className="text-sm text-[#3C4A45]/80 mt-1">
          Kategori menentukan divisi penerima laporan dan penanganan prioritas khusus bagi korban tindak kekerasan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-[#CFE3DC] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#CFE3DC]">
            <h3 className="font-bold text-base text-[#184739]">Daftar Kategori Aktif</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFAF8] text-[#3C4A45] border-b border-[#CFE3DC] text-xs font-semibold uppercase">
                <tr>
                  <th className="px-5 py-3.5">Nama Kategori</th>
                  <th className="px-5 py-3.5">Cakupan</th>
                  <th className="px-5 py-3.5">Divisi Tujuan</th>
                  <th className="px-5 py-3.5 text-center">Khusus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CFE3DC]/60">
                {categoryList.map((c) => (
                  <tr key={c.id} className="hover:bg-[#EAF3F0]/20">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#184739]">{c.name}</p>
                      <p className="text-xs text-[#3C4A45]/50 font-mono">{c.slug}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs uppercase font-semibold text-[#1F5A4B] bg-[#EAF3F0] px-2 py-0.5 rounded">
                        {c.appliesTo}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-[#3C4A45]">
                      {c.division?.name}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {c.isSpecial ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#865F17] bg-[#FBF4E2] border border-[#EBCF8A] px-2 py-0.5 rounded-full">
                          <ShieldAlert className="w-3.5 h-3.5 text-[#C9962B]" />
                          <span>Ya (PPA)</span>
                        </span>
                      ) : (
                        <span className="text-xs text-[#3C4A45]/60">Biasa</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Tambah Kategori (1 Col) */}
        <div className="bg-white p-6 rounded-[16px] border border-[#CFE3DC] shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#184739] border-b border-[#CFE3DC] pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#C9962B]" />
            <span>Tambah Kategori Baru</span>
          </h3>

          <form action={createCategoryAction} className="space-y-4">
            <FormField label="Nama Kategori" htmlFor="name" required>
              <TextInputField
                id="name"
                name="name"
                placeholder="Contoh: Penipuan Online"
                required
              />
            </FormField>

            <FormField label="Slug (URL ID)" htmlFor="slug" required>
              <TextInputField
                id="slug"
                name="slug"
                placeholder="penipuan-online"
                required
              />
            </FormField>

            <FormField label="Berlaku Untuk" htmlFor="appliesTo" required>
              <select
                id="appliesTo"
                name="appliesTo"
                className="w-full px-3 py-2 text-sm rounded-[8px] border border-[#CFE3DC] bg-white outline-none"
              >
                <option value="pengaduan">Pengaduan Saja</option>
                <option value="konsultasi">Konsultasi Saja</option>
                <option value="keduanya">Keduanya (Pengaduan & Konsultasi)</option>
              </select>
            </FormField>

            <FormField label="Divisi Tujuan" htmlFor="divisionId" required>
              <select
                id="divisionId"
                name="divisionId"
                className="w-full px-3 py-2 text-sm rounded-[8px] border border-[#CFE3DC] bg-white outline-none"
                required
              >
                {divisionList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isSpecial"
                name="isSpecial"
                value="true"
                className="rounded text-[#1F5A4B] focus:ring-[#C9962B]"
              />
              <label
                htmlFor="isSpecial"
                className="text-xs font-semibold text-[#865F17] cursor-pointer"
              >
                Kategori Khusus (Prioritas & Perlindungan Korban PPA)
              </label>
            </div>

            <AppButton type="submit" variant="primary" size="md" fullWidth>
              <span>Simpan Kategori</span>
            </AppButton>
          </form>
        </div>
      </div>
    </div>
  );
}
