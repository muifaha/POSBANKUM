import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE_NAME = "posbankum_session";
const SECRET = process.env.SESSION_SECRET || "posbankum-secret-key-32-chars-mangunsari-2026-safe";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "lurah" | "paralegal" | "pemantau";
  divisionId?: string | null;
}

function sign(payload: string): string {
  const b64 = Buffer.from(payload, "utf8").toString("base64url");
  const hmac = createHmac("sha256", SECRET);
  hmac.update(b64);
  return `${b64}.${hmac.digest("hex")}`;
}

function verify(token: string): string | null {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;
  const rawPayload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);

  const hmac = createHmac("sha256", SECRET);
  hmac.update(rawPayload);
  const expectedSignature = hmac.digest("hex");

  try {
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expectedSignature, "hex");
    if (a.length === b.length && timingSafeEqual(a, b)) {
      // Dukungan payload base64url atau raw JSON lama
      if (rawPayload.startsWith("{")) {
        return rawPayload;
      }
      return Buffer.from(rawPayload, "base64url").toString("utf8");
    }
  } catch {
    return null;
  }
  return null;
}

export async function createSession(user: SessionUser) {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  const token = sign(payload);
  const cookieStore = await cookies();

  // Deteksi HANYA apakah browser saat ini benar-benar mengakses via HTTPS
  let isHttps = false;
  try {
    const { headers } = await import("next/headers");
    const headerList = await headers();
    const proto = headerList.get("x-forwarded-proto");
    const referer = headerList.get("referer") || "";

    if (proto === "https" || referer.startsWith("https://")) {
      isHttps = true;
    }
  } catch {
    isHttps = false;
  }

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;

  const payload = verify(sessionCookie.value);
  if (!payload) return null;

  try {
    const data = JSON.parse(payload);
    if (data.exp && Date.now() > data.exp) {
      return null;
    }
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      divisionId: data.divisionId,
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// RBAC Permissions Check (desain.md section 9 & 10)
export function canViewReport(
  user: SessionUser,
  report: { divisionId: string; isSpecial?: boolean }
): boolean {
  if (user.role === "admin" || user.role === "lurah") {
    return true;
  }
  if (user.role === "paralegal") {
    return user.divisionId === report.divisionId;
  }
  return false;
}

export function canManageReport(user: SessionUser, report: { divisionId: string }): boolean {
  if (user.role === "admin" || user.role === "lurah") {
    return true;
  }
  if (user.role === "paralegal") {
    return user.divisionId === report.divisionId;
  }
  return false;
}
