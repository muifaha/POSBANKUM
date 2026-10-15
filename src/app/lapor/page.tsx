import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AppButton } from "@/components/ui/AppButton";
import { InfoCallout } from "@/components/ui/InfoCallout";
import { QuickExitButton } from "@/components/ui/QuickExitButton";
import { ShieldCheck, ArrowRight, UserX, Clock, PhoneCall } from "lucide-react";

export default function LembarPanduanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <SiteHeader />
      <QuickExitButton />

      <main className="flex-1 py-10 sm:py-16">
        <PageContainer size="md">
          <SectionHeading
            title="Panduan Sebelum Melapor"
            subtitle="Mohon luangkan waktu 1 menit untuk membaca informasi penting berikut demi kenyamanan dan keselamatan proses pengaduan Anda."
          />

          <div className="space-y-6 bg-white p-6 sm:p-8 rounded-[12px] border border-[#CFE3DC] shadow-xs">
            {/* Poin 1: Batas Kewenangan */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#EAF3F0] text-[#1F5A4B] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base sm:text-lg text-[#184739]">
                  Pos Bantuan Hukum (Posbankum) Memberi Mediasi dan Rujukan
                </h3>
                <p className="text-sm text-[#3C4A45]/80 leading-relaxed">
                  Posbankum bertugas membantu warga menyelesaikan perkara secara kekeluargaan/mediasi, konsultasi hukum perdata/pidana awal, atau memberikan surat rujukan ke LBH/Advokat resmi. <strong>Website ini bukan kanal laporan kepolisian resmi (SPKT).</strong>
                </p>
              </div>
            </div>

            {/* Poin 2: Kerahasiaan & Opsi Anonim */}
            <div className="flex items-start gap-3.5 pt-4 border-t border-[#EAF3F0]">
              <div className="p-2.5 rounded-xl bg-[#FBF4E2] text-[#865F17] shrink-0">
                <UserX className="w-6 h-6 text-[#C9962B]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base sm:text-lg text-[#184739]">
                  Kerahasiaan Terjamin & Pilihan Lapor Anonim
                </h3>
                <p className="text-sm text-[#3C4A45]/80 leading-relaxed">
                  Khususnya bagi korban kekerasan rumah tangga (KDRT), kekerasan seksual, atau perselisihan keluarga yang sensitif, Anda diperbolehkan menggunakan nama samaran atau melapor secara anonim tanpa mengisi nama asli, alamat, dan nomor kontak. Anda tetap akan menerima Kode Tiket dan PIN untuk melacak laporan.
                </p>
              </div>
            </div>

            {/* Poin 3: SLA Respons */}
            <div className="flex items-start gap-3.5 pt-4 border-t border-[#EAF3F0]">
              <div className="p-2.5 rounded-xl bg-[#EAF3F0] text-[#1F5A4B] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base sm:text-lg text-[#184739]">
                  Waktu Respons Awal Maksimal 24 Jam
                </h3>
                <p className="text-sm text-[#3C4A45]/80 leading-relaxed">
                  Laporan yang masuk akan diperiksa dan diverifikasi oleh petugas/paralegal sesuai divisi kategori maksimal dalam 24 jam hari kerja.
                </p>
              </div>
            </div>

            {/* Callout Peringatan Darurat */}
            <InfoCallout type="emergency" title="Bukan Untuk Kondisi Bahaya Nyata Saat Ini">
              Apabila Anda saat ini sedang dalam ancaman fisik atau memerlukan pertolongan darurat medis/kepolisian segera, mohon hubungi hotline kepolisian di nomor <strong>110</strong> atau ambulans di <strong>118/119</strong>.
            </InfoCallout>

            {/* Tombol Lanjutkan */}
            <div className="pt-6 border-t border-[#CFE3DC] flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-[#3C4A45] hover:text-[#1F5A4B] order-2 sm:order-1"
              >
                ← Kembali ke Beranda
              </Link>

              <AppButton
                href="/lapor/form"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                <span>Saya Mengerti, Lanjutkan ke Formulir</span>
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
