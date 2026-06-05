/**
 * Kiểm tra / bootstrap SQLite (local file hoặc Turso).
 * Chạy: npm run db:import-json
 * Xóa DB local: npm run db:import-json -- --force
 */
import { existsSync, unlinkSync } from "node:fs";
import path from "node:path";

import { ensureDbReady, getSqlClient, DB_PATH } from "../src/lib/sqlite.server";

async function main() {
  const force = process.argv.includes("--force");

  if (force && !process.env.TURSO_DATABASE_URL && existsSync(DB_PATH)) {
    for (const suffix of ["", "-wal", "-shm"]) {
      const file = `${DB_PATH}${suffix}`;
      if (existsSync(file)) unlinkSync(file);
    }
    console.log("Đã xóa hub.db local — chạy lại app để bootstrap.");
    return;
  }

  await ensureDbReady();
  const db = getSqlClient();

  const [users, docs, phases, substeps, cases] = await Promise.all([
    db.execute("SELECT COUNT(*) AS n FROM users"),
    db.execute("SELECT COUNT(*) AS n FROM docs"),
    db.execute("SELECT COUNT(*) AS n FROM roadmap_phase_overrides"),
    db.execute("SELECT COUNT(*) AS n FROM roadmap_substep_overrides"),
    db.execute("SELECT COUNT(*) AS n FROM case_success"),
  ]);

  console.log(`Database: ${process.env.TURSO_DATABASE_URL ?? path.relative(process.cwd(), DB_PATH)}`);
  console.log({
    users: users.rows[0]?.n,
    docs: docs.rows[0]?.n,
    phases: phases.rows[0]?.n,
    substeps: substeps.rows[0]?.n,
    cases: cases.rows[0]?.n,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
