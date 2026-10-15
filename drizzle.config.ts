import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "drizzle-kit";

// Muat .env secara eksplisit
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error(
    `❌ [drizzle.config.ts] DATABASE_URL tidak ditemukan di file .env!\n` +
    `Lokasi dicari: ${path.resolve(process.cwd(), ".env")}`
  );
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl || "postgres://posbankum_user:password@127.0.0.1:5432/posbankum",
  },
});
