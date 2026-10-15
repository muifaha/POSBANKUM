"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppLogo } from "./AppLogo";
import { logoutAction } from "@/actions/authActions";
import { SessionUser } from "@/lib/auth/session";
import {
  LayoutDashboard,
  FileSpreadsheet,
  FolderTree,
  Building2,
  Users2,
  FileEdit,
  BarChart3,
  LogOut,
  Menu,
  X,
  Shield,
  User,
} from "lucide-react";

interface AdminShellProps {
  user: SessionUser;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ["admin", "lurah", "paralegal", "pemantau"],
    },
    {
      label: "Daftar Laporan",
      href: "/admin/laporan",
      icon: <FileSpreadsheet className="w-5 h-5" />,
      roles: ["admin", "lurah", "paralegal"],
    },
    {
      label: "Rekapitulasi",
      href: "/admin/rekap",
      icon: <BarChart3 className="w-5 h-5" />,
      roles: ["admin", "lurah", "pemantau", "paralegal"],
    },
    {
      label: "Master Divisi",
      href: "/admin/divisi",
      icon: <Building2 className="w-5 h-5" />,
      roles: ["admin"],
    },
    {
      label: "Master Kategori",
      href: "/admin/kategori",
      icon: <FolderTree className="w-5 h-5" />,
      roles: ["admin"],
    },
    {
      label: "Kelola Pengguna",
      href: "/admin/pengguna",
      icon: <Users2 className="w-5 h-5" />,
      roles: ["admin"],
    },
    {
      label: "Edit Konten Halaman",
      href: "/admin/konten",
      icon: <FileEdit className="w-5 h-5" />,
      roles: ["admin"],
    },
  ];

  const allowedMenuItems = menuItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const roleLabels: Record<string, { label: string; color: string }> = {
    admin: { label: "Administrator", color: "bg-[#A87A1E] text-white" },
    lurah: { label: "Lurah Mangunsari", color: "bg-[#1F5A4B] text-white" },
    paralegal: { label: "Paralegal / Petugas", color: "bg-[#2A6B59] text-white" },
    pemantau: { label: "Pemantau Pimpinan", color: "bg-gray-600 text-white" },
  };

  const currentRole = roleLabels[user.role] || { label: user.role, color: "bg-gray-600 text-white" };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR DESKTOP & MOBILE */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#12352B] text-[#F7F3E8] flex flex-col transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#184739] flex items-center justify-between">
          <div className="bg-white/95 rounded-lg p-2">
            <AppLogo href="/admin" size="sm" />
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#CFE3DC] hover:text-white p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Card in Sidebar */}
        <div className="px-4 py-4 border-b border-[#184739] bg-[#0B231C]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1F5A4B] text-[#F7F3E8] flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-[#F7F3E8] truncate">
                {user.name}
              </p>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${currentRole.color}`}
              >
                {currentRole.label}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {allowedMenuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[8px] text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#1F5A4B] text-[#F7F3E8] font-bold border-l-4 border-[#C9962B]"
                    : "text-[#CFE3DC] hover:bg-[#184739] hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-[#184739]">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[8px] text-sm font-medium text-[#FCA5A5] hover:bg-[#991B1B]/30 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Keluar Sesi</span>
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Mobile */}
        <header className="md:hidden bg-white border-b border-[#CFE3DC] px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[#3C4A45] hover:bg-[#EAF3F0]"
            aria-label="Buka navigasi admin"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-sm font-bold text-[#1F5A4B]">Admin Posbankum</div>
          <div className="w-6" />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
