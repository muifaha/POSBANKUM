import { db } from "@/lib/db";
import { contentPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Kebijakan Pelindungan Data Pribadi - Posbankum Mangunsari",
  description: "Kebijakan kepatuhan kerahasiaan data sesuai UU PDP No. 27 Tahun 2022.",
};

export default async function KebijakanPrivasiPage() {
  const page = await db.query.contentPages.findFirst({
    where: eq(contentPages.key, "kebijakan_privasi"),
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <SiteHeader />

      <main className="flex-1 py-10 sm:py-16">
        <PageContainer size="md">
          <SectionHeading
            title="Kebijakan Pelindungan Data Pribadi"
            subtitle="Landasan hukum kerahasiaan data warga sesuai Undang-Undang No. 27 Tahun 2022"
          />

          <div className="bg-white rounded-[16px] border border-[#CFE3DC] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 text-[#1F5A4B] font-bold text-lg border-b border-[#CFE3DC] pb-4">
              <ShieldCheck className="w-6 h-6 text-[#C9962B]" />
              <span>Komitmen Kerahasiaan Posbankum Mangunsari</span>
            </div>

            <div className="text-base text-[#3C4A45] leading-relaxed whitespace-pre-line space-y-4">
              {page?.bodyMd}
            </div>

            <div className="pt-6 border-t border-[#CFE3DC] text-xs text-[#3C4A45]/70">
              <p>Terakhir diperbarui: 15 Oktober 2026 · Versi Persetujuan: v1.0-UU-PDP-27-2022</p>
            </div>
          </div>
        </PageContainer>
      </main>

      <SiteFooter />
    </div>
  );
}
