"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppLogo } from "./AppLogo";
import { Menu, X, Shield, Lock } from "lucide-react";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Panduan Pengaduan", href: "/panduan" },
    { label: "Tentang", href: "/tentang" },
    { label: "Cek Status", href: "/cek-status" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#CFE3DC] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <AppLogo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-[8px] text-sm lg:text-base font-medium transition-colors tap-target flex items-center ${
                    isActive
                      ? "text-[#1F5A4B] bg-[#EAF3F0] font-semibold"
                      : "text-[#3C4A45] hover:text-[#1F5A4B] hover:bg-[#F7F3E8]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="h-6 w-px bg-[#CFE3DC] mx-2" />

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-sm font-medium text-[#184739] hover:bg-[#EAF3F0] transition-colors border border-[#CFE3DC]"
            >
              <Lock className="w-4 h-4 text-[#C9962B]" />
              <span>Login Petugas</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg text-[#3C4A45] hover:text-[#1F5A4B] hover:bg-[#EAF3F0] tap-target focus-visible:ring-2 focus-visible:ring-[#C9962B]"
              aria-label="Buka menu navigasi"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-[#CFE3DC] bg-white px-4 pt-2 pb-5 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3.5 py-3 rounded-lg text-base font-medium ${
                  isActive
                    ? "bg-[#EAF3F0] text-[#1F5A4B] font-semibold"
                    : "text-[#3C4A45] hover:bg-[#F7F3E8]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#CFE3DC]">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3.5 py-3 rounded-lg text-base font-medium text-[#184739] bg-[#EAF3F0]"
            >
              <Lock className="w-4 h-4 text-[#C9962B]" />
              <span>Login Petugas Posbankum</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
