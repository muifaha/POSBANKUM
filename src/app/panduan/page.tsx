import { db } from "@/lib/db";
import { contentPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AppButton } from "@/components/ui/AppButton";
import { InfoCallout } from "@/components/ui/InfoCallout";
import { BookOpen, CheckCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Panduan Pengaduan & Bantuan Hukum - Posbankum Mangunsari",
  description: "Alur resmi pengaduan, konsultasi, dan batas wewenang Posbankum Kelurahan Mangunsari.",
};

export default async function PanduanPage() {
  let page: { bodyMd: string } | null | undefined = null;
  try {
    page = await db.query.contentPages.findFirst({
      where: eq(contentPages.key, "panduan"),
    });
  } catch {
    page = null;
  }

  const defaultContent = `Sebelum menyampaikan pengaduan atau konsultasi, harap perhatikan hal-hal berikut:

### Batas Layanan
1. Website ini adalah kanal penerimaan aduan dan permohonan konsultasi Posbankum Kelurahan Mangunsari.
2. **Website ini BUKAN pengganti laporan kepolisian atau nomor gawat darurat.** Jika Anda berada dalam situasi bahaya fisik yang mengancam keselamatan jiwa saat ini, segera hubungi polisi di nomor **110** atau kontak darurat kelurahan.
3. Setiap laporan akan diverifikasi paling lambat dalam **24 jam kerja**.

### Perlindungan Privasi & Opsi Anonim
- Anda diperbolehkan melapor secara **anonim (tanpa identitas)** terutama untuk kasus sensitif.
- Anda akan tetap mendapatkan **Kode Tiket** dan **PIN Rahasia** untuk memantau perkembangan tindak lanjut laporan Anda.`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <SiteHeader />

      <main className="flex-1 py-10 sm:py-16">
        <PageContainer size="md">
          <SectionHeading
            title="Panduan Prosedur Pengaduan"
            subtitle="Petunjuk lengkap pengajuan permohonan bantuan hukum dan konsultasi perkara bagi warga."
          />

          <div className="space-y-6">
            <div className="bg-white rounded-[16px] border border-[#CFE3DC] p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-[#1F5A4B] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C9962B]" />
                <span>Tata Cara & Ketentuan</span>
              </h3>
              <div className="text-base text-[#3C4A45] leading-relaxed whitespace-pre-line space-y-2">
                {page?.bodyMd || defaultContent}
              </div>
            </div>

            <InfoCallout type="warning" title="Penting Diingat">
              Pos Bantuan Hukum Kelurahan Mangunsari memfasilitasi musyawarah mufakat, konsultasi, dan mediasi non-litigasi. Bukan lembaga peradilan formal atau penegak hukum kepolisian.
            </InfoCallout>

            <InfoCallout type="emergency" title="Kontak Darurat Polisi & Rumah Sakit">
              Dalam situasi ancaman kekerasan fisik aktif, segera hubungi Polsek Sidomukti / Call Center <strong>110</strong> atau Ambulans <strong>118/119</strong>.
            </InfoCallout>

            <div className="pt-4 flex justify-end">
              <AppButton href="/lapor" variant="primary" size="lg">
                <span>Mulai Buat Pengaduan Sekarang</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </AppButton>
            </div>
          </div>
        </PageContainer>
      </main>

      <SiteFooter />
    </div>
  );
}
