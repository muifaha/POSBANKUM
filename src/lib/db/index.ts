import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL || "postgres://postgres@localhost:5432/posbankum";

// Validasi format connection string
try {
  const parsed = new URL(dbUrl);
  if (!parsed.password && process.env.NODE_ENV === "production") {
    console.warn(
      "⚠️ PERINGATAN: DATABASE_URL tidak memiliki kata sandi. Jika PostgreSQL memerlukan autentikasi SCRAM/MD5, koneksi akan gagal."
    );
  }
} catch {
  // Biarkan node-postgres menangani parsing
}

const pool = new Pool({
  connectionString: dbUrl,
});

export const db = drizzle(pool, { schema });
