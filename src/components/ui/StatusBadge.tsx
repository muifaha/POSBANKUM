import React from "react";

export type ReportStatusType =
  | "diterima"
  | "diverifikasi"
  | "ditindaklanjuti"
  | "selesai"
  | "dirujuk"
  | "ditolak";

const statusConfig: Record<
  ReportStatusType,
  { label: string; bg: string; text: string; border: string }
> = {
  diterima: {
    label: "Diterima",
    bg: "bg-[#E8EEF5]",
    text: "text-[#2C4A6B]",
    border: "border-[#BFD3E6]",
  },
  diverifikasi: {
    label: "Diverifikasi",
    bg: "bg-[#FBF4E2]",
    text: "text-[#865F17]",
    border: "border-[#F5E4B8]",
  },
  ditindaklanjuti: {
    label: "Ditindaklanjuti",
    bg: "bg-[#EAF3F0]",
    text: "text-[#184739]",
    border: "border-[#CFE3DC]",
  },
  selesai: {
    label: "Selesai",
    bg: "bg-[#1F5A4B]",
    text: "text-[#F7F3E8]",
    border: "border-[#1F5A4B]",
  },
  dirujuk: {
    label: "Dirujuk",
    bg: "bg-[#EEE9F5]",
    text: "text-[#4A3A6B]",
    border: "border-[#D7C9EC]",
  },
  ditolak: {
    label: "Ditolak / Di Luar Wewenang",
    bg: "bg-[#F6E6E3]",
    text: "text-[#8A2E24]",
    border: "border-[#ECC4BD]",
  },
};

export function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const normalized = (status?.toLowerCase() || "diterima") as ReportStatusType;
  const config = statusConfig[normalized] || statusConfig.diterima;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}
