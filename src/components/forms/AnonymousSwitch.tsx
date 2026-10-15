import React from "react";
import { UserX, Shield } from "lucide-react";

interface AnonymousSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function AnonymousSwitch({
  checked,
  onChange,
  className = "",
}: AnonymousSwitchProps) {
  return (
    <div
      className={`rounded-[12px] border p-4 sm:p-5 transition-all ${
        checked
          ? "bg-[#FBF4E2] border-[#C9962B]"
          : "bg-white border-[#CFE3DC]"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${
              checked ? "bg-[#C9962B] text-white" : "bg-[#EAF3F0] text-[#1F5A4B]"
            }`}
          >
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <label
              htmlFor="anonymous-switch"
              className="font-bold text-base text-[#184739] cursor-pointer"
            >
              Lapor Secara Anonim (Nama Samaran / Rahasia)
            </label>
            <p className="text-xs sm:text-sm text-[#3C4A45]/80 mt-0.5">
              Identitas Anda (nama, alamat, kontak WhatsApp, email) tidak akan direkam.
            </p>
          </div>
        </div>

        {/* Custom Toggle Switch */}
        <button
          type="button"
          id="anonymous-switch"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-[#C9962B] ${
            checked ? "bg-[#1F5A4B]" : "bg-gray-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {checked && (
        <div className="mt-3.5 pt-3 border-t border-[#EBCF8A] flex items-center gap-2 text-xs sm:text-sm text-[#865F17]">
          <Shield className="w-4 h-4 text-[#C9962B] shrink-0" />
          <span>
            <strong>Penting:</strong> Anda tetap akan menerima <strong>Kode Tiket</strong> dan <strong>PIN</strong> untuk memantau status laporan Anda di halaman Cek Status.
          </span>
        </div>
      )}
    </div>
  );
}
