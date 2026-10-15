"use client";

import React, { useState } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { FormField } from "@/components/forms/FormField";
import { TextInputField } from "@/components/forms/TextInputField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { DueIndicator } from "@/components/ui/DueIndicator";
import { InfoCallout } from "@/components/ui/InfoCallout";
import { checkStatusAction, CheckStatusResult } from "@/actions/reportActions";
import { Search, ShieldCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function CheckStatusClient() {
  const [ticketCode, setTicketCode] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckStatusResult["data"] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!ticketCode.trim() || !pin.trim()) {
      setError("Silakan masukkan Kode Tiket dan PIN Anda");
      return;
    }

    setIsLoading(true);
    try {
      const res = await checkStatusAction(ticketCode.trim(), pin.trim());
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.error || "Kode tiket atau PIN tidak cocok.");
      }
    } catch {
      setError("Terjadi gangguan koneksi saat memeriksa tiket.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Form Card */}
      <div className="bg-white rounded-[16px] border border-[#CFE3DC] shadow-xs p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F5A4B]">
            Lacak Perkembangan Laporan
          </h2>
          <p className="text-sm text-[#3C4A45]/80 mt-1">
            Masukkan Kode Tiket yang Anda peroleh saat mengirim laporan beserta PIN 6-digit rahasia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Kode Tiket"
              htmlFor="ticketCode"
              required
              hint="Format contoh: LP-7K3M9QXD"
            >
              <TextInputField
                id="ticketCode"
                placeholder="LP-XXXXXXXX"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                autoCapitalize="characters"
                required
              />
            </FormField>

            <FormField
              label="PIN Rahasia (6 Digit)"
              htmlFor="pin"
              required
              hint="Angka PIN yang ditampilkan saat submit"
            >
              <TextInputField
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </FormField>
          </div>

          {error && (
            <InfoCallout type="warning" title="Periksa Kembali">
              {error}
            </InfoCallout>
          )}

          <div className="pt-2 flex justify-end">
            <AppButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full sm:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              <span>Periksa Status Tiket</span>
            </AppButton>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-[16px] border border-[#CFE3DC] shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CFE3DC] pb-5">
            <div>
              <span className="text-xs uppercase font-semibold text-[#865F17] tracking-wider">
                Hasil Pencarian Tiket
              </span>
              <h3 className="font-mono font-bold text-2xl text-[#1F5A4B] mt-0.5">
                {result.ticketCode}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={result.status} />
              <DueIndicator dueDate={result.respondDueAt} type="respons" />
            </div>
          </div>

          {/* Ringkasan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAFAF8] p-4 sm:p-5 rounded-[12px] border border-[#CFE3DC]">
            <div>
              <span className="text-xs text-[#3C4A45]/70 font-medium">Judul Laporan</span>
              <p className="font-semibold text-base text-[#184739] mt-0.5">{result.title}</p>
            </div>
            <div>
              <span className="text-xs text-[#3C4A45]/70 font-medium">Kategori & Jenis</span>
              <div className="mt-1 flex items-center gap-2">
                <CategoryBadge name={result.categoryName} isSpecial={result.isSpecial} />
                <span className="text-xs font-semibold uppercase text-[#3C4A45]/80">
                  ({result.kind})
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-[#3C4A45]/70 font-medium">Waktu Pengiriman</span>
              <p className="text-sm text-[#3C4A45] mt-0.5">
                {new Date(result.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })} WIB
              </p>
            </div>
            <div>
              <span className="text-xs text-[#3C4A45]/70 font-medium">Target Penyelesaian</span>
              <p className="text-sm text-[#3C4A45] mt-0.5">
                Maks. 7 Hari Kerja ({new Date(result.resolveDueAt).toLocaleDateString("id-ID")})
              </p>
            </div>
          </div>

          {/* Timeline Riwayat Status */}
          <div>
            <h4 className="font-bold text-base text-[#184739] mb-4">
              Riwayat Tindak Lanjut Petugas
            </h4>

            {result.events.length === 0 ? (
              <p className="text-sm text-[#3C4A45]/70 italic">
                Belum ada catatan tindak lanjut publik untuk laporan ini.
              </p>
            ) : (
              <div className="relative pl-6 border-l-2 border-[#CFE3DC] space-y-6">
                {result.events.map((evt, idx) => (
                  <div key={idx} className="relative">
                    {/* Bullet */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#1F5A4B] ring-4 ring-[#EAF3F0]" />
                    <div>
                      <div className="flex items-center gap-2">
                        {evt.toStatus && <StatusBadge status={evt.toStatus} />}
                        <span className="text-xs text-[#3C4A45]/70">
                          {new Date(evt.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })} WIB
                        </span>
                      </div>
                      {evt.note && (
                        <p className="text-sm text-[#3C4A45] mt-1.5 bg-[#F7F3E8] p-3 rounded-lg border border-[#EBCF8A]/60 leading-relaxed">
                          {evt.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
