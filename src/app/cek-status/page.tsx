import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { CheckStatusClient } from "./CheckStatusClient";

export const metadata = {
  title: "Cek Status Laporan - Posbankum Kelurahan Mangunsari",
  description: "Pantau perkembangan dan tindak lanjut laporan Posbankum menggunakan kode tiket dan PIN.",
};

export default function CheckStatusPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <SiteHeader />

      <main className="flex-1 py-10 sm:py-16">
        <PageContainer size="md">
          <SectionHeading
            title="Cek Status & Perkembangan Laporan"
            subtitle="Layanan pelacakan status terbuka 24 jam bagi warga untuk memastikan laporan Anda ditindaklanjuti secara transparan."
          />

          <CheckStatusClient />
        </PageContainer>
      </main>

      <SiteFooter />
    </div>
  );
}
