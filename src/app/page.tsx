import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AppButton } from "@/components/ui/AppButton";
import { InfoCallout } from "@/components/ui/InfoCallout";
import {
  FileText,
  KeyRound,
  Search,
  ShieldCheck,
  UserCheck,
  HeartHandshake,
  ArrowRight,
  PhoneCall,
  Clock,
  Lock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-b from-[#EAF3F0]/60 via-[#F7F3E8]/30 to-[#FAFAF8] pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-[#CFE3DC]/60">
          <PageContainer size="md">
            <div className="flex flex-col items-center text-center">
              {/* Logo Besar */}
              <div className="relative w-48 h-20 sm:w-64 sm:h-24 mb-6">
                <Image
                  src="/logo-posbankum-mangunsari.svg"
                  alt="Logo Pos Bantuan Hukum Kelurahan Mangunsari"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Tagline & Judul */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF3F0] text-[#184739] text-xs sm:text-sm font-semibold mb-4 border border-[#CFE3DC]">
                <ShieldCheck className="w-4 h-4 text-[#C9962B]" />
                <span>Kanal Resmi Kelurahan Mangunsari</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1F5A4B] tracking-tight leading-tight max-w-3xl">
                LAYANAN PENGADUAN POS BANTUAN HUKUM KELURAHAN MANGUNSARI
              </h1>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-[#3C4A45] max-w-2xl leading-relaxed">
                Menyediakan satu pintu digital bagi seluruh warga Kelurahan Mangunsari untuk menyampaikan pengaduan kasus hukum, memohon konsultasi, serta memperoleh mediasi secara adil, rahasia, dan gratis.
              </p>

              {/* Tombol Aksi Utama */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <AppButton
                  href="/lapor"
                  variant="primary"
                  size="lg"
                  className="shadow-md"
                >
                  <span>Mulai Buat Laporan / Pengaduan</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </AppButton>

                <AppButton
                  href="/cek-status"
                  variant="secondary"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  <span>Cek Status Laporan</span>
                </AppButton>
              </div>

              {/* Jaminan Privasi Singkat */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#CFE3DC]/80 w-full max-w-xl text-left">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#184739]">
                  <Lock className="w-4 h-4 text-[#C9962B] shrink-0" />
                  <span>Boleh Lapor Anonim</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#184739]">
                  <Clock className="w-4 h-4 text-[#C9962B] shrink-0" />
                  <span>Respons Maks 24 Jam</span>
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-[#184739]">
                  <HeartHandshake className="w-4 h-4 text-[#C9962B] shrink-0" />
                  <span>100% Cuma-Cuma</span>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* CARA KERJA (3 LANGKAH) */}
        <section className="py-14 sm:py-20">
          <PageContainer size="lg">
            <SectionHeading
              title="Cara Kerja Pelaporan"
              subtitle="Tiga langkah mudah untuk memperoleh pendampingan dan kepastian hukum dari Posbankum Kelurahan Mangunsari."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-10">
              {/* Langkah 1 */}
              <div className="bg-white rounded-[12px] p-6 sm:p-7 border border-[#CFE3DC] shadow-xs flex flex-col relative">
                <div className="w-12 h-12 rounded-xl bg-[#EAF3F0] text-[#1F5A4B] flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-lg text-[#184739] mb-2">
                  Isi Formulir Bertahap
                </h3>
                <p className="text-sm text-[#3C4A45]/80 leading-relaxed flex-1">
                  Pilih jenis layanan (Pengaduan atau Permohonan Konsultasi) dan ceritakan kronologi secara jelas. Anda bebas memilih lapor dengan nama samaran (anonim).
                </p>
                <div className="mt-4 pt-4 border-t border-[#EAF3F0] flex items-center gap-2 text-xs text-[#1F5A4B] font-medium">
                  <FileText className="w-4 h-4 text-[#C9962B]" />
                  <span>Dukungan unggah bukti/lampiran</span>
                </div>
              </div>

              {/* Langkah 2 */}
              <div className="bg-white rounded-[12px] p-6 sm:p-7 border border-[#CFE3DC] shadow-xs flex flex-col relative">
                <div className="w-12 h-12 rounded-xl bg-[#FBF4E2] text-[#865F17] flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-lg text-[#184739] mb-2">
                  Simpan Kode Tiket & PIN
                </h3>
                <p className="text-sm text-[#3C4A45]/80 leading-relaxed flex-1">
                  Setelah terkirim, Anda akan langsung menerima Kode Tiket unik dan PIN 6-digit. Simpan keduanya untuk memantau proses tindak lanjut tanpa perlu mendaftar akun.
                </p>
                <div className="mt-4 pt-4 border-t border-[#EAF3F0] flex items-center gap-2 text-xs text-[#1F5A4B] font-medium">
                  <KeyRound className="w-4 h-4 text-[#C9962B]" />
                  <span>Kerahasiaan terjaga 100%</span>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="bg-white rounded-[12px] p-6 sm:p-7 border border-[#CFE3DC] shadow-xs flex flex-col relative">
                <div className="w-12 h-12 rounded-xl bg-[#EAF3F0] text-[#1F5A4B] flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-lg text-[#184739] mb-2">
                  Pantau Tindak Lanjut Petugas
                </h3>
                <p className="text-sm text-[#3C4A45]/80 leading-relaxed flex-1">
                  Paralegal Posbankum memeriksa laporan, menjadwalkan mediasi/konsultasi, atau menerbitkan surat rujukan resmi bila memerlukan advokasi hukum lanjutan.
                </p>
                <div className="mt-4 pt-4 border-t border-[#EAF3F0] flex items-center gap-2 text-xs text-[#1F5A4B] font-medium">
                  <UserCheck className="w-4 h-4 text-[#C9962B]" />
                  <span>Respons resmi maksimal 24 jam</span>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* CALLOUT BATAS LAYANAN & NOMOR DARURAT */}
        <section className="pb-16 sm:pb-24">
          <PageContainer size="md">
            <div className="space-y-4">
              <InfoCallout
                type="warning"
                title="Batas Kewenangan Layanan Posbankum"
              >
                Website ini berfungsi untuk penerimaan konsultasi hukum, bantuan mediasi damai, dan rujukan advokasi bagi warga Kelurahan Mangunsari. <strong>Website ini BUKAN pengganti laporan kepolisian untuk tindak kriminal aktif atau situasi darurat.</strong>
              </InfoCallout>

              <InfoCallout
                type="emergency"
                title="Butuh Bantuan Segera / Kondisi Darurat?"
              >
                Jika Anda atau orang terdekat berada dalam bahaya fisik yang mengancam keselamatan saat ini:
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-semibold">
                  <div>🚨 Polsek Sidomukti / Polisi: <strong>110</strong></div>
                  <div>🚑 Ambulans Darurat: <strong>118 / 119</strong></div>
                  <div>🛡️ Layanan Sahabat Perempuan & Anak: <strong>SAPA 129</strong></div>
                  <div>📞 Hotline Pengaduan Kelurahan: <strong>0812-3456-7890</strong></div>
                </div>
              </InfoCallout>
            </div>
          </PageContainer>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
