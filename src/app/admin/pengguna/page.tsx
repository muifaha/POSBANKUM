import { db } from "@/lib/db";
import { users, divisions } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { createUserAction, toggleUserStatusAction } from "@/actions/adminActions";
import { AppButton } from "@/components/ui/AppButton";
import { FormField } from "@/components/forms/FormField";
import { TextInputField } from "@/components/forms/TextInputField";
import { eq } from "drizzle-orm";
import { UserPlus, Shield, UserCheck, UserX } from "lucide-react";

export default async function AdminPenggunaPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/admin");

  const userList = await db.query.users.findMany({
    with: {
      division: true,
    },
    orderBy: [users.createdAt],
  });

  const divisionList = await db.query.divisions.findMany({
    where: eq(divisions.isActive, true),
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F5A4B]">
          Kelola Akun Pengurus & Paralegal
        </h1>
        <p className="text-sm text-[#3C4A45]/80 mt-1">
          Admin berwenang mendaftarkan akun paralegal dan menentukan divisi penanganannya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-[#CFE3DC] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#CFE3DC]">
            <h3 className="font-bold text-base text-[#184739]">Daftar Pengguna Sistem</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFAF8] text-[#3C4A45] border-b border-[#CFE3DC] text-xs font-semibold uppercase">
                <tr>
                  <th className="px-5 py-3.5">Nama & Email</th>
                  <th className="px-5 py-3.5">Peran</th>
                  <th className="px-5 py-3.5">Divisi</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CFE3DC]/60">
                {userList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#EAF3F0]/20">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#184739]">{u.name}</p>
                      <p className="text-xs text-[#3C4A45]/70">{u.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-[#EAF3F0] text-[#184739]">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-[#3C4A45]">
                      {u.division?.name || "-"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <form
                        action={async () => {
                          "use server";
                          await toggleUserStatusAction(u.id, u.isActive);
                        }}
                      >
                        <button
                          type="submit"
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                            u.isActive
                              ? "bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800"
                              : "bg-red-100 text-red-800 hover:bg-green-100 hover:text-green-800"
                          }`}
                          title="Klik untuk ubah status aktif/nonaktif"
                        >
                          {u.isActive ? "Aktif" : "Nonaktif"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Buat Akun (1 Col) */}
        <div className="bg-white p-6 rounded-[16px] border border-[#CFE3DC] shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#184739] border-b border-[#CFE3DC] pb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#C9962B]" />
            <span>Buat Akun Petugas Baru</span>
          </h3>

          <form action={createUserAction} className="space-y-4">
            <FormField label="Nama Lengkap Petugas" htmlFor="name" required>
              <TextInputField
                id="name"
                name="name"
                placeholder="Contoh: Rina Anggraeni, S.H."
                required
              />
            </FormField>

            <FormField label="Alamat Email Resmi" htmlFor="email" required>
              <TextInputField
                id="email"
                name="email"
                type="email"
                placeholder="petugas@mangunsari.go.id"
                required
              />
            </FormField>

            <FormField label="Kata Sandi Awal" htmlFor="password" required>
              <TextInputField
                id="password"
                name="password"
                type="password"
                placeholder="Minimal 6 karakter"
                required
              />
            </FormField>

            <FormField label="Peran (Role)" htmlFor="role" required>
              <select
                id="role"
                name="role"
                className="w-full px-3 py-2 text-sm rounded-[8px] border border-[#CFE3DC] bg-white outline-none"
                required
              >
                <option value="paralegal">Paralegal (Divisi Tertentu)</option>
                <option value="admin">Administrator</option>
                <option value="lurah">Lurah Mangunsari (Pimpinan)</option>
                <option value="pemantau">Pemantau (Rekap Statistik Saja)</option>
              </select>
            </FormField>

            <FormField
              label="Divisi Penugasan"
              htmlFor="divisionId"
              hint="Wajib dipilih untuk peran Paralegal"
            >
              <select
                id="divisionId"
                name="divisionId"
                className="w-full px-3 py-2 text-sm rounded-[8px] border border-[#CFE3DC] bg-white outline-none"
              >
                <option value="">-- Bukan Paralegal / Khusus Admin/Lurah --</option>
                {divisionList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </FormField>

            <AppButton type="submit" variant="primary" size="md" fullWidth>
              <span>Daftarkan Akun</span>
            </AppButton>
          </form>
        </div>
      </div>
    </div>
  );
}
