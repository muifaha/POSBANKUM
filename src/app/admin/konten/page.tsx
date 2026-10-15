import { db } from "@/lib/db";
import { contentPages, siteSettings } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { updateContentPageAction } from "@/actions/adminActions";
import { AppButton } from "@/components/ui/AppButton";
import { FormField } from "@/components/forms/FormField";
import { TextInputField } from "@/components/forms/TextInputField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { FileEdit, Settings, Save } from "lucide-react";

export default async function AdminKontenPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/admin");

  const pages = await db.query.contentPages.findMany();
  const settings = await db.query.siteSettings.findMany();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F5A4B]">
          Edit Konten & Informasi Layanan
        </h1>
        <p className="text-sm text-[#3C4A45]/80 mt-1">
          Sesuaikan teks halaman publik Tentang, Panduan Pengaduan, Kebijakan Privasi, dan nomor hotline.
        </p>
      </div>

      {/* Pages Editor */}
      <div className="space-y-6">
        {pages.map((p) => (
          <div
            key={p.key}
            className="bg-white p-6 rounded-[16px] border border-[#CFE3DC] shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#CFE3DC] pb-3">
              <h3 className="font-bold text-base text-[#184739] capitalize flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-[#C9962B]" />
                <span>Halaman: {p.key.replace("_", " ")}</span>
              </h3>
              <span className="text-xs text-[#3C4A45]/60">
                Terakhir diubah: {new Date(p.updatedAt).toLocaleDateString("id-ID")}
              </span>
            </div>

            <form action={updateContentPageAction} className="space-y-4">
              <input type="hidden" name="key" value={p.key} />

              <FormField label="Judul Halaman" htmlFor={`title-${p.key}`} required>
                <TextInputField
                  id={`title-${p.key}`}
                  name="title"
                  defaultValue={p.title}
                  required
                />
              </FormField>

              <FormField
                label="Isi Konten Teks"
                htmlFor={`bodyMd-${p.key}`}
                required
                hint="Gunakan teks paragraf terstruktur."
              >
                <TextAreaField
                  id={`bodyMd-${p.key}`}
                  name="bodyMd"
                  defaultValue={p.bodyMd}
                  rows={6}
                  required
                />
              </FormField>

              <div className="flex justify-end">
                <AppButton type="submit" variant="primary" size="sm">
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Simpan Perubahan</span>
                </AppButton>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
