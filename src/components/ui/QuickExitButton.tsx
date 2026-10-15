"use client";

import React, { useEffect } from "react";
import { LogOut } from "lucide-react";

export function QuickExitButton({ targetUrl = "https://www.google.com" }: { targetUrl?: string }) {
  const handleExit = () => {
    // Ganti riwayat browser agar tombol 'Back' tidak membuka kembali halaman laporan
    window.location.replace(targetUrl);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tekan Esc dua kali berturut-turut untuk keluar cepat
      if (e.key === "Escape") {
        handleExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [targetUrl]);

  return (
    <button
      type="button"
      onClick={handleExit}
      title="Keluar Cepat (atau tekan tombol Esc) untuk segera menutup halaman ini"
      aria-label="Keluar Cepat dari website ini ke situs netral"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-2 bg-[#DC2626] text-white px-4 py-2.5 rounded-full font-medium text-sm shadow-lg hover:bg-[#B91C1C] transition-all hover:scale-105 active:scale-95 border-2 border-white focus-visible:ring-2 focus-visible:ring-[#C9962B]"
    >
      <LogOut className="w-4 h-4" />
      <span>Keluar Cepat (Esc)</span>
    </button>
  );
}
