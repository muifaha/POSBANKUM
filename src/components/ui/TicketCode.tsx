"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export function TicketCode({ code, className = "" }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 bg-[#F7F3E8] border border-[#EBCF8A] px-3.5 py-1.5 rounded-[10px] ${className}`}
    >
      <span className="font-mono font-bold tracking-wider text-base sm:text-lg text-[#1F5A4B]">
        {code}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        title="Salin Kode Tiket"
        aria-label="Salin Kode Tiket"
        className="p-1.5 text-[#3C4A45] hover:text-[#1F5A4B] hover:bg-[#EAF3F0] rounded-md transition-colors tap-target flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#C9962B]"
      >
        {copied ? (
          <Check className="w-4 h-4 text-[#1F5A4B]" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
