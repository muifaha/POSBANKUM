import React from "react";
import Link from "next/link";
import { AppLogo } from "./AppLogo";
import { MapPin, Phone, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#12352B] text-[#F7F3E8] border-t-4 border-[#C9962B] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {/* Kolom 1: Profil */}
          <div className="space-y-4">
            <div className="bg-white/95 rounded-lg p-2.5 inline-block">
              <AppLogo href="/" size="sm" />
            </div>
            <p className="text-sm leading-relaxed text-[#CFE3DC]">
              Layanan resmi Pos Bantuan Hukum (Posbankum) Pemerintah Kelurahan Mangunsari.
              Memberikan pendampingan hukum awal, konsultasi, dan mediasi damai bagi warga.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#EBCF8A]">
              <ShieldCheck className="w-4 h-4 text-[#C9962B]" />
              <span>Sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi</span>
            </div>
          </div>

          {/* Kolom 2: Kontak & Kantor */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base text-[#F7F3E8] tracking-wide border-b border-[#184739] pb-2">
              Sekretariat Posbankum
            </h4>
            <div className="flex items-start gap-3 text-sm text-[#CFE3DC]">
              <MapPin className="w-5 h-5 text-[#C9962B] shrink-0 mt-0.5" />
              <span>
                Kantor Kelurahan Mangunsari
                <br />
                Kecamatan Sidomukti, Kota Salatiga, Jawa Tengah
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#CFE3DC]">
              <Phone className="w-5 h-5 text-[#C9962B] shrink-0" />
              <span>Hotline Pengaduan WA: 0812-3456-7890</span>
            </div>
          </div>

          {/* Kolom 3: Tautan Terkait */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base text-[#F7F3E8] tracking-wide border-b border-[#184739] pb-2">
              Informasi & Kebijakan
            </h4>
            <ul className="space-y-2 text-sm text-[#CFE3DC]">
              <li>
                <Link href="/panduan" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                  Panduan Prosedur Pengaduan
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                  Tentang Posbankum & Paralegal
                </Link>
              </li>
              <li>
                <Link href="/cek-status" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                  Cek Status Laporan / Tiket
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                  Kebijakan Pelindungan Data Pribadi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#184739] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A2C8BB] gap-3">
          <p>© {new Date().getFullYear()} Pos Bantuan Hukum Kelurahan Mangunsari. Hak Cipta Dilindungi.</p>
          <p className="text-center sm:text-right">
            Website Layanan Pengaduan Resmi · Non-Darurat
          </p>
        </div>
      </div>
    </footer>
  );
}
