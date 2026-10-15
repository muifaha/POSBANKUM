import React from "react";
import Link from "next/link";

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  className?: string;
}

export function ConsentCheckbox({
  checked,
  onChange,
  error,
  className = "",
}: ConsentCheckboxProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-[#CFE3DC] text-[#1F5A4B] focus:ring-[#C9962B] cursor-pointer"
        />
        <span className="text-sm text-[#3C4A45] leading-relaxed">
          Saya menyatakan data yang saya sampaikan adalah benar dan menyetujui pengolahan data saya oleh petugas Posbankum Kelurahan Mangunsari sesuai{" "}
          <Link
            href="/kebijakan-privasi"
            target="_blank"
            className="text-[#1F5A4B] font-semibold underline underline-offset-2 hover:text-[#184739]"
          >
            Kebijakan Pelindungan Data Pribadi
          </Link>
          . <span className="text-[#DC2626] font-bold">*</span>
        </span>
      </label>

      {error && (
        <p role="alert" className="text-xs sm:text-sm font-medium text-[#DC2626] pl-8">
          {error}
        </p>
      )}
    </div>
  );
}
