/**
 * Đẩy dữ liệu từ hub.db local lên Turso (chạy một lần trước deploy).
 *
 * 1. Copy .env.example → .env và điền TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
 * 2. npm run db:push-turso
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

import { createClient } from "@libsql/client";

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_DB = path.join(DATA_DIR, "hub.db");

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error("Cần TURSO_DATABASE_URL và TURSO_AUTH_TOKEN trong .env");
  }
  if (!existsSync(LOCAL_DB)) {
    throw new Error(`Không tìm thấy ${LOCAL_DB} — chạy app local trước để tạo dữ liệu.`);
  }

  const local = createClient({ url: `file:${LOCAL_DB.replace(/\\/g, "/")}` });
  const remote = createClient({ url, authToken });

  const tables = ["meta", "users", "docs", "roadmap_phase_overrides", "roadmap_substep_overrides", "case_success"] as const;

  for (const table of tables) {
    const result = await local.execute(`SELECT * FROM ${table}`);
    if (result.rows.length === 0) continue;

    const columns = result.columns;
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT OR REPLACE INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;

    const batch = result.rows.map((row) => ({
      sql,
      args: columns.map((col) => row[col] as string | number | null),
    }));

    await remote.batch(batch, "write");
    console.log(`✓ ${table}: ${result.rows.length} rows`);
  }

  console.log("Done — Turso đã có dữ liệu từ hub.db local.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
