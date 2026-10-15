import { db } from "@/lib/db";
import { contentPages, divisions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ShieldCheck, Users, Scale, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Tentang Posbankum - Kelurahan Mangunsari",
  description: "Profil, visi misi, dan susunan divisi Pos Bantuan Hukum Kelurahan Mangunsari.",
};

export default async function TentangPage() {
  const page = await db.query.contentPages.findFirst({
    where: eq(contentPages.key, "tentang"),
  });

  const divisionList = await db.query.divisions.findMany({
    where: eq(divisions.isActive, true),
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <SiteHeader />

      <main className="flex-1 py-10 sm:py-16">
        <PageContainer size="md">
          <SectionHeading
            title="Tentang Pos Bantuan Hukum (Posbankum)"
            subtitle="Pemerintah Kelurahan Mangunsari, Kecamatan Sidomukti, Kota Salatiga"
          />

          <div className="space-y-8">
            {/* Kartu Profil Utama */}
            <div className="bg-white rounded-[16px] border border-[#CFE3DC] p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-[#1F5A4B] flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#C9962B]" />
                <span>Maksud & Tujuan Pendirian</span>
              </h3>
              <p className="text-base text-[#3C4A45] leading-relaxed whitespace-pre-line">
                {page?.bodyMd ||
                  "Pos Bantuan Hukum (Posbankum) Kelurahan Mangunsari merupakan inisiatif resmi pemerintah Kelurahan Mangunsari untuk memberikan akses keadilan seluas-luasnya bagi seluruh warga kelurahan."}
              </p>
            </div>

            {/* Kartu Divisi Petugas */}
            <div className="bg-white rounded-[16px] border border-[#CFE3DC] p-6 sm:p-8 shadow-xs space-y-5">
              <h3 className="text-xl font-bold text-[#1F5A4B] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C9962B]" />
                <span>Divisi Penanganan Perkara & Paralegal</span>
              </h3>
              <p className="text-sm text-[#3C4A45]/80">
                Pengurus Posbankum terdiri dari paralegal bersertifikat dan tokoh masyarakat yang dibagi ke dalam bidang keahlian:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {divisionList.map((div) => (
                  <div
                    key={div.id}
                    className="p-4 rounded-[12px] bg-[#EAF3F0]/60 border border-[#CFE3DC]"
                  >
                    <h4 className="font-semibold text-base text-[#184739] mb-1">
                      {div.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#3C4A45]/80 leading-normal">
                      {div.description || "Bertanggung jawab atas mediasi dan pendampingan di bidangnya."}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nilai Layanan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#F7F3E8] p-5 rounded-[12px] border border-[#EBCF8A] text-center">
                <ShieldCheck className="w-8 h-8 text-[#1F5A4B] mx-auto mb-2" />
                <h4 className="font-bold text-[#184739]">Kerahasiaan Terjamin</h4>
                <p className="text-xs text-[#3C4A45]/80 mt-1">Identitas dan kronologi perkara dijaga sesuai kode etik paralegal.</p>
              </div>

              <div className="bg-[#F7F3E8] p-5 rounded-[12px] border border-[#EBCF8A] text-center">
                <HeartHandshake className="w-8 h-8 text-[#C9962B] mx-auto mb-2" />
                <h4 className="font-bold text-[#184739]">Non-Diskriminatif</h4>
                <p className="text-xs text-[#3C4A45]/80 mt-1">Melayani seluruh lapisan warga tanpa memandang latar belakang.</p>
              </div>

              <div className="bg-[#F7F3E8] p-5 rounded-[12px] border border-[#EBCF8A] text-center">
                <Scale className="w-8 h-8 text-[#1F5A4B] mx-auto mb-2" />
                <h4 className="font-bold text-[#184739]">Mediasi Musyawarah</h4>
                <p className="text-xs text-[#3C4A45]/80 mt-1">Mengedepankan musyawarah mufakat demi kedamaian lingkungan.</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </main>

      <SiteFooter />
    </div>
  );
}
