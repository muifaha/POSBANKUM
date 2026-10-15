import dotenv from "dotenv";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Muat file .env secara eksplisit dari root direktori
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const dbUrl = process.env.DATABASE_URL || "postgres://postgres@localhost:5432/posbankum";

// Peringatan jika password kosong di environment Linux / production
try {
  const parsed = new URL(dbUrl);
  if (!parsed.password && process.platform === "linux") {
    console.warn(
      `⚠️ [PERINGATAN DATABASE] DATABASE_URL (${parsed.protocol}//${parsed.username}@${parsed.host}${parsed.pathname}) tidak menyertakan password.\n` +
      `PostgreSQL di Linux (SCRAM-SHA-256) akan menolak koneksi tanpa password.\n` +
      `Pastikan di .env tertulis: DATABASE_URL="postgres://username:password@127.0.0.1:5432/posbankum"`
    );
  }
} catch {
  // Abaikan jika parsing gagal
}

const pool = new Pool({
  connectionString: dbUrl,
});

export const db = drizzle(pool, { schema });
