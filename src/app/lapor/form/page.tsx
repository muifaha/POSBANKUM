import { getActiveCategoriesAction } from "@/actions/reportActions";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { QuickExitButton } from "@/components/ui/QuickExitButton";
import { ReportWizard } from "./ReportWizard";

export const metadata = {
  title: "Formulir Pelaporan & Pengaduan - Posbankum Mangunsari",
  description: "Sampaikan laporan kasus atau permohonan konsultasi hukum secara aman dan terstruktur.",
};

export default async function ReportFormPage() {
  const categories = await getActiveCategoriesAction();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <SiteHeader />
      <QuickExitButton />

      <main className="flex-1 py-8 sm:py-12">
        <PageContainer size="md">
          <ReportWizard categories={categories} />
        </PageContainer>
      </main>

      <SiteFooter />
    </div>
  );
}
