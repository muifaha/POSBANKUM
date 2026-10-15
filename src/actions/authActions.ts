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
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      error: "Terjadi kesalahan internal saat memproses autentikasi.",
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
