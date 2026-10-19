"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppLogo } from "@/components/layout/AppLogo";
import { AppButton } from "@/components/ui/AppButton";
import { FormField } from "@/components/forms/FormField";
import { TextInputField } from "@/components/forms/TextInputField";
import { InfoCallout } from "@/components/ui/InfoCallout";
import { loginAction } from "@/actions/authActions";
import { Lock, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await loginAction(formData);
      if (res.success) {
        window.location.replace("/admin");
        return;
      } else {
        setError(res.error || "Gagal masuk.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FAFAF8] px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header / Logo */}
        <div className="text-center space-y-2">
          <AppLogo href="/" size="md" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F5A4B] mt-4">
            Masuk Pengurus & Petugas
          </h1>
          <p className="text-xs sm:text-sm text-[#3C4A45]/80">
            Akses internal khusus Administrator, Lurah, dan Paralegal Posbankum Kelurahan Mangunsari.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-[16px] border border-[#CFE3DC] shadow-sm p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email Akun Petugas" htmlFor="email" required>
              <TextInputField
                id="email"
                type="email"
                placeholder="nama@mangunsari.go.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </FormField>

            <FormField label="Kata Sandi" htmlFor="password" required>
              <TextInputField
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </FormField>

            {error && (
              <InfoCallout type="warning" title="Autentikasi Gagal">
                {error}
              </InfoCallout>
            )}

            <div className="pt-2">
              <AppButton
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span>Masuk ke Dashboard</span>
              </AppButton>
            </div>
          </form>

          <div className="pt-4 border-t border-[#CFE3DC] text-center text-xs text-[#3C4A45]/70 space-y-2">
            <p className="flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#C9962B]" />
              <span>Pendaftaran akun baru hanya dilakukan oleh Administrator.</span>
            </p>
            <div>
              <Link href="/" className="inline-flex items-center text-[#1F5A4B] font-semibold hover:underline mt-2">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Kembali ke Halaman Beranda Warga</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
