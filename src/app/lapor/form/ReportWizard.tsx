"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppButton } from "@/components/ui/AppButton";
import { FormField } from "@/components/forms/FormField";
import { TextInputField } from "@/components/forms/TextInputField";
import { PhoneField } from "@/components/forms/PhoneField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { SelectField } from "@/components/forms/SelectField";
import { DateField } from "@/components/forms/DateField";
import { ChoiceCard } from "@/components/forms/ChoiceCard";
import { AnonymousSwitch } from "@/components/forms/AnonymousSwitch";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { Stepper } from "@/components/forms/Stepper";
import { InfoCallout } from "@/components/ui/InfoCallout";
import { TicketCode } from "@/components/ui/TicketCode";
import { submitReportAction } from "@/actions/reportActions";
import {
  FileText,
  HelpCircle,
  Users,
  Video,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  appliesTo: "pengaduan" | "konsultasi" | "keduanya";
  isSpecial: boolean;
}

export function ReportWizard({ categories }: { categories: CategoryItem[] }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Hasil setelah submit berhasil
  const [resultData, setResultData] = useState<{
    ticketCode: string;
    pin: string;
  } | null>(null);

  // Form State - Step 1: Identitas
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState("");
  const [reporterAddress, setReporterAddress] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  // Form State - Step 2: Laporan
  const [kind, setKind] = useState<"pengaduan" | "konsultasi">("pengaduan");
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [consultMode, setConsultMode] = useState<"tatap_muka" | "daring">("tatap_muka");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  // Filter kategori berdasarkan jenis yang dipilih
  const filteredCategories = categories.filter(
    (c) => c.appliesTo === "keduanya" || c.appliesTo === kind
  );

  // Set default category jika belum dipilih atau tidak cocok
  React.useEffect(() => {
    if (filteredCategories.length > 0 && !filteredCategories.some((c) => c.id === categoryId)) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [kind, filteredCategories, categoryId]);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  // Validasi Step 1
  const handleNextToStep2 = () => {
    const errors: Record<string, string> = {};
    if (!isAnonymous) {
      if (!reporterName.trim() || reporterName.trim().length < 3) {
        errors.reporterName = "Nama lengkap wajib diisi minimal 3 karakter";
      }
      if (!reporterAddress.trim() || reporterAddress.trim().length < 5) {
        errors.reporterAddress = "Alamat domisili wajib diisi minimal 5 karakter";
      }
      if (!reporterPhone.trim() || reporterPhone.trim().length < 9) {
        errors.reporterPhone = "Nomor WhatsApp aktif wajib diisi";
      }
      if (!reporterEmail.trim() || !reporterEmail.includes("@")) {
        errors.reporterEmail = "Alamat email valid wajib diisi";
      }
    }
    setStep1Errors(errors);
    if (Object.keys(errors).length === 0) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Submit Final di Step 2
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!categoryId) {
      errors.categoryId = "Silakan pilih kategori laporan";
    }
    if (!title.trim() || title.trim().length < 5) {
      errors.title = "Judul minimal 5 karakter";
    }
    if (!body.trim() || body.trim().length < 20) {
      errors.body = "Deskripsi detail minimal 20 karakter agar petugas memahami kronologi";
    }
    if (kind === "pengaduan") {
      if (!incidentDate) {
        errors.incidentDate = "Tanggal kejadian wajib diisi";
      }
      if (!incidentLocation.trim()) {
        errors.incidentLocation = "Lokasi kejadian perkara wajib diisi";
      }
    }
    if (!consent) {
      errors.consent = "Anda wajib menyetujui pernyataan pengolahan data pribadi";
    }

    setStep2Errors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append("isAnonymous", isAnonymous ? "true" : "false");
    if (!isAnonymous) {
      formData.append("reporterName", reporterName);
      formData.append("reporterAddress", reporterAddress);
      formData.append("reporterPhone", reporterPhone);
      formData.append("reporterEmail", reporterEmail);
    }
    formData.append("kind", kind);
    formData.append("categoryId", categoryId);
    formData.append("title", title);
    formData.append("body", body);
    if (kind === "pengaduan") {
      formData.append("incidentDate", incidentDate);
      formData.append("incidentLocation", incidentLocation);
    } else {
      formData.append("consultMode", consultMode);
    }
    formData.append("consent", consent ? "true" : "false");
    if (attachment) {
      formData.append("attachments", attachment);
    }

    try {
      const res = await submitReportAction(formData);
      if (res.success && res.ticketCode && res.pin) {
        setResultData({
          ticketCode: res.ticketCode,
          pin: res.pin,
        });
        setStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(res.error || "Gagal mengirimkan laporan. Periksa kembali form.");
      }
    } catch {
      setSubmitError("Terjadi kesalahan jaringan. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#CFE3DC] shadow-xs p-5 sm:p-8">
      {/* STEP 1: IDENTITAS */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F5A4B]">
              Langkah 1: Identitas Pelapor
            </h2>
            <p className="text-sm text-[#3C4A45]/80 mt-1">
              Tentukan apakah Anda ingin melapor dengan nama asli atau secara anonim.
            </p>
          </div>

          <AnonymousSwitch
            checked={isAnonymous}
            onChange={(checked) => {
              setIsAnonymous(checked);
              setStep1Errors({});
            }}
          />

          {!isAnonymous && (
            <div className="space-y-4 pt-2">
              <FormField
                label="Nama Lengkap"
                htmlFor="reporterName"
                required
                error={step1Errors.reporterName}
                hint="Sesuai kartu identitas (KTP) Anda"
              >
                <TextInputField
                  id="reporterName"
                  placeholder="Contoh: Budi Santoso"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  error={!!step1Errors.reporterName}
                />
              </FormField>

              <FormField
                label="Alamat Domisili di Mangunsari"
                htmlFor="reporterAddress"
                required
                error={step1Errors.reporterAddress}
                hint="Nama jalan, RT/RW, atau kelurahan"
              >
                <TextInputField
                  id="reporterAddress"
                  placeholder="Contoh: Jl. Diponegoro RT 02 / RW 04 Kel. Mangunsari"
                  value={reporterAddress}
                  onChange={(e) => setReporterAddress(e.target.value)}
                  error={!!step1Errors.reporterAddress}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Nomor WhatsApp"
                  htmlFor="reporterPhone"
                  required
                  error={step1Errors.reporterPhone}
                  hint="Untuk koordinasi jadwal konsultasi/mediasi"
                >
                  <PhoneField
                    id="reporterPhone"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    error={!!step1Errors.reporterPhone}
                  />
                </FormField>

                <FormField
                  label="Alamat Email"
                  htmlFor="reporterEmail"
                  required
                  error={step1Errors.reporterEmail}
                  hint="Untuk pengiriman tanda terima berkas"
                >
                  <TextInputField
                    id="reporterEmail"
                    type="email"
                    placeholder="nama@email.com"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    error={!!step1Errors.reporterEmail}
                  />
                </FormField>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-[#CFE3DC] flex items-center justify-between">
            <Link
              href="/lapor"
              className="text-sm font-medium text-[#3C4A45] hover:text-[#1F5A4B]"
            >
              ← Kembali ke Panduan
            </Link>

            <AppButton
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNextToStep2}
            >
              <span>Lanjut ke Detail Laporan</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </AppButton>
          </div>
        </div>
      )}

      {/* STEP 2: DETAIL LAPORAN */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F5A4B]">
              Langkah 2: Detail Laporan & Perkara
            </h2>
            <p className="text-sm text-[#3C4A45]/80 mt-1">
              Sampaikan informasi sejelas mungkin agar petugas dapat memberikan bantuan tepat sasaran.
            </p>
          </div>

          {submitError && (
            <InfoCallout type="emergency" title="Gagal Menyimpan">
              {submitError}
            </InfoCallout>
          )}

          {/* Pemilihan Jenis */}
          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-semibold text-[#184739]">
              Pilih Jenis Layanan <span className="text-[#DC2626] font-bold">*</span>
            </label>
            <ChoiceCard
              name="kind"
              value={kind}
              onChange={(v) => {
                setKind(v);
                setStep2Errors({});
              }}
              options={[
                {
                  value: "pengaduan",
                  title: "Pengaduan Perkara",
                  description:
                    "Untuk peristiwa sengketa, tindak pidana, perselisihan, atau tindak kekerasan yang memerlukan penanganan Posbankum.",
                  icon: <FileText className="w-5 h-5 text-[#1F5A4B]" />,
                },
                {
                  value: "konsultasi",
                  title: "Konsultasi Hukum",
                  description:
                    "Untuk permohonan penjelasan/nasihat hukum (waris, perkawinan, dokumen, sertifikat) tanpa adanya sengketa aktif.",
                  icon: <HelpCircle className="w-5 h-5 text-[#C9962B]" />,
                },
              ]}
            />
          </div>

          {/* Kategori */}
          <FormField
            label="Kategori Perkara"
            htmlFor="categoryId"
            required
            error={step2Errors.categoryId}
            hint="Laporan akan diteruskan ke divisi paralegal yang menangani bidang ini"
          >
            <SelectField
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              error={!!step2Errors.categoryId}
            >
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.isSpecial ? `🛡️ ${c.name} (Khusus PPA)` : c.name}
                </option>
              ))}
            </SelectField>
          </FormField>

          {/* Notifikasi Halus Jika Kategori Khusus */}
          {selectedCategory?.isSpecial && (
            <InfoCallout type="info" title="Penanganan Khusus & Prioritas">
              Kategori ini ditangani dengan pengawasan khusus dan kerahasiaan ketat oleh Divisi Perlindungan Perempuan dan Anak serta Bapak/Ibu Lurah Mangunsari.
            </InfoCallout>
          )}

          {/* Judul & Isi */}
          <FormField
            label={kind === "pengaduan" ? "Judul Pengaduan" : "Topik / Judul Konsultasi"}
            htmlFor="title"
            required
            error={step2Errors.title}
            hint="Ringkasan singkat masalah dalam satu kalimat"
          >
            <TextInputField
              id="title"
              placeholder={
                kind === "pengaduan"
                  ? "Contoh: Sengketa batas pagar pekarangan dengan tetangga"
                  : "Contoh: Pertanyaan prosedur pembagian waris keluarga"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!step2Errors.title}
            />
          </FormField>

          <FormField
            label={kind === "pengaduan" ? "Deskripsi Kronologi Kejadian" : "Uraian Pertanyaan Konsultasi"}
            htmlFor="body"
            required
            error={step2Errors.body}
            charCount={{ current: body.length, max: 5000 }}
            hint="Ceritakan kronologi, pihak-pihak yang terlibat, serta bantuan yang Anda harapkan"
          >
            <TextAreaField
              id="body"
              rows={5}
              placeholder="Ceritakan detail persoalan secara runtut..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              error={!!step2Errors.body}
            />
          </FormField>

          {/* Kolom Spesifik Pengaduan */}
          {kind === "pengaduan" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Tanggal Kejadian Perkara"
                htmlFor="incidentDate"
                required
                error={step2Errors.incidentDate}
                hint="Kapan peristiwa tersebut terjadi"
              >
                <DateField
                  id="incidentDate"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  error={!!step2Errors.incidentDate}
                />
              </FormField>

              <FormField
                label="Lokasi Tempat Kejadian"
                htmlFor="incidentLocation"
                required
                error={step2Errors.incidentLocation}
                hint="Alamat atau patokan lokasi di Mangunsari"
              >
                <TextInputField
                  id="incidentLocation"
                  placeholder="Contoh: RT 03 RW 02 Jl. Mangunsari"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  error={!!step2Errors.incidentLocation}
                />
              </FormField>
            </div>
          )}

          {/* Kolom Spesifik Konsultasi */}
          {kind === "konsultasi" && (
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-[#184739]">
                Pilihan Cara Konsultasi <span className="text-[#DC2626] font-bold">*</span>
              </label>
              <ChoiceCard
                name="consultMode"
                value={consultMode}
                onChange={(v) => setConsultMode(v)}
                options={[
                  {
                    value: "tatap_muka",
                    title: "Tatap Muka di Kelurahan",
                    description: "Jadwal temu di ruang mediasi kantor Kelurahan Mangunsari",
                    icon: <Users className="w-5 h-5 text-[#1F5A4B]" />,
                  },
                  {
                    value: "daring",
                    title: "Daring (Online / WhatsApp)",
                    description: "Konsultasi melalui telepon / video call / pesan WhatsApp resmi",
                    icon: <Video className="w-5 h-5 text-[#C9962B]" />,
                  },
                ]}
              />
            </div>
          )}

          {/* Dokumen Lampiran (Opsional) */}
          <div className="space-y-1.5">
            <label className="block text-sm sm:text-base font-semibold text-[#184739]">
              Dokumen Pendukung / Foto Bukti (Opsional)
            </label>
            <div className="border-2 border-dashed border-[#CFE3DC] rounded-[12px] p-5 text-center hover:bg-[#F7F3E8]/30 transition-colors">
              <Upload className="w-8 h-8 text-[#1F5A4B]/60 mx-auto mb-2" />
              <label
                htmlFor="file-upload"
                className="text-sm font-semibold text-[#1F5A4B] cursor-pointer hover:underline"
              >
                Pilih file dokumen atau foto
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert("Ukuran file maksimal 5 MB");
                        return;
                      }
                      setAttachment(file);
                    }
                  }}
                />
              </label>
              <p className="text-xs text-[#3C4A45]/70 mt-1">
                Format didukung: JPG, PNG, PDF (Maksimal 5 MB)
              </p>
              {attachment && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#EAF3F0] text-[#184739] text-xs font-medium rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-[#1F5A4B]" />
                  <span>{attachment.name} ({(attachment.size / 1024).toFixed(1)} KB)</span>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="ml-2 text-[#DC2626] hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <ConsentCheckbox
              checked={consent}
              onChange={(c) => {
                setConsent(c);
                if (c) {
                  setStep2Errors((prev) => {
                    const next = { ...prev };
                    delete next.consent;
                    return next;
                  });
                }
              }}
              error={step2Errors.consent}
            />
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-[#CFE3DC] flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3C4A45] hover:text-[#1F5A4B] tap-target"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Identitas</span>
            </button>

            <AppButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
            >
              <span>Kirim Laporan Resmi</span>
              <CheckCircle2 className="w-5 h-5 ml-2" />
            </AppButton>
          </div>
        </form>
      )}

      {/* STEP 3: SELESAI */}
      {step === 3 && resultData && (
        <div className="space-y-6 text-center py-4 sm:py-6">
          <div className="w-16 h-16 rounded-full bg-[#EAF3F0] text-[#1F5A4B] flex items-center justify-center mx-auto mb-2 ring-8 ring-[#EAF3F0]/60">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F5A4B]">
              Laporan Berhasil Diterima
            </h2>
            <p className="text-sm sm:text-base text-[#3C4A45] max-w-md mx-auto mt-2 leading-relaxed">
              Terima kasih. Laporan Anda telah tercatat secara resmi dalam sistem Posbankum Kelurahan Mangunsari.
            </p>
          </div>

          {/* Box Tiket & PIN */}
          <div className="bg-[#F7F3E8] border-2 border-[#EBCF8A] rounded-[16px] p-6 max-w-lg mx-auto text-left space-y-4 shadow-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#865F17]">
                Kode Tiket Laporan Anda
              </span>
              <div className="mt-1.5">
                <TicketCode code={resultData.ticketCode} className="w-full justify-between" />
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#865F17]">
                PIN Rahasia Pelacak
              </span>
              <div className="mt-1 flex items-center justify-between bg-white border border-[#CFE3DC] px-4 py-2.5 rounded-[10px]">
                <span className="font-mono font-bold text-2xl tracking-widest text-[#1F5A4B]">
                  {resultData.pin}
                </span>
                <span className="text-xs text-[#DC2626] font-medium bg-[#FEE2E2] px-2.5 py-1 rounded-md">
                  Simpan Sekarang
                </span>
              </div>
              <p className="text-xs text-[#865F17] mt-1.5">
                ⚠️ <strong>Perhatian:</strong> PIN ini hanya ditampilkan satu kali demi keamanan kerahasiaan Anda. Catat atau simpan kode tiket beserta PIN ini untuk memeriksa status perkembangan laporan.
              </p>
            </div>
          </div>

          {/* Informasi SLA & Hotline */}
          <div className="max-w-lg mx-auto space-y-3 text-left">
            <div className="flex items-start gap-3 p-3.5 bg-[#EAF3F0] rounded-[10px] text-xs sm:text-sm text-[#184739]">
              <Clock className="w-5 h-5 text-[#1F5A4B] shrink-0 mt-0.5" />
              <div>
                <strong>Batas Waktu Respons:</strong> Petugas akan meneliti dan memberikan tanggapan awal paling lambat dalam <strong>24 jam kerja</strong>. Target penyelesaian maksimal <strong>7 hari kerja</strong>.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-white border border-[#CFE3DC] rounded-[10px] text-xs sm:text-sm text-[#3C4A45]">
              <Phone className="w-5 h-5 text-[#C9962B] shrink-0 mt-0.5" />
              <div>
                <strong>Hotline Layanan Cepat:</strong> Jika memerlukan penanganan segera, Anda dapat menghubungi Hotline Pengaduan Kelurahan di nomor <strong>0812-3456-7890</strong> dengan menyebutkan kode tiket Anda.
              </div>
            </div>
          </div>

          {/* Tombol Navigasi Akhir */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <AppButton
              href="/cek-status"
              variant="primary"
              size="lg"
              fullWidth
            >
              <span>Cek Status Laporan Ini</span>
            </AppButton>

            <AppButton
              href="/"
              variant="secondary"
              size="lg"
              fullWidth
            >
              <span>Kembali ke Beranda</span>
            </AppButton>
          </div>
        </div>
      )}

      {/* Stepper di bagian bawah formulir (sesuai PRD 6.4) */}
      <div className="mt-8 pt-6 border-t border-[#CFE3DC]">
        <Stepper currentStep={step} />
      </div>
    </div>
  );
}
