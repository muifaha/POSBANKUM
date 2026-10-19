"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, getSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export interface LoginResult {
  success: boolean;
  error?: string;
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const parse = loginSchema.safeParse({ email, password });
  if (!parse.success) {
    return {
      success: false,
      error: parse.error.errors[0]?.message || "Format email atau kata sandi tidak valid",
    };
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase().trim()),
    });

    if (!user || !user.isActive) {
      return {
        success: false,
        error: "Email atau kata sandi tidak tepat, atau akun telah dinonaktifkan.",
      };
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return {
        success: false,
        error: "Email atau kata sandi tidak tepat.",
      };
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Create session
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "admin" | "lurah" | "paralegal" | "pemantau",
      divisionId: user.divisionId,
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("Login error:", err);
    const errorObj = err as { code?: string; message?: string };

    let errorMessage = "Terjadi kesalahan internal saat memproses autentikasi.";

    if (errorObj?.code === "42P01" || errorObj?.message?.includes("does not exist")) {
      errorMessage =
        "Tabel database belum terbuat di PostgreSQL. Silakan jalankan 'npx drizzle-kit push' dan 'npm run db:seed' di terminal server.";
    } else if (
      errorObj?.code === "ECONNREFUSED" ||
      errorObj?.message?.includes("connect ECONNREFUSED")
    ) {
      errorMessage =
        "Gagal terhubung ke database. Pastikan PostgreSQL sedang berjalan di server.";
    } else if (errorObj?.message?.includes("password")) {
      errorMessage = `Koneksi database ditolak: ${errorObj.message}`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function getCurrentUser() {
  return await getSession();
}
