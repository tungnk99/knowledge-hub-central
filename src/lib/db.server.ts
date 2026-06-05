import { mkdir } from "node:fs/promises";

import type { DocItem } from "./types";
import { migratePhases } from "./mtqt-glossary";
import { enrichDocMeta } from "./doc-meta";
import { SEED_DOCS } from "./seed-data";
import { deleteStoredFile, getUploadPath, UPLOADS_DIR } from "./storage.server";
import { DATA_DIR, ensureDbReady, sqlBatch, sqlQuery } from "./sqlite.server";

export { deleteStoredFile, getUploadPath, UPLOADS_DIR };

async function ensureDirs() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(UPLOADS_DIR, { recursive: true });
}

function rowToDoc(raw: string): DocItem {
  return JSON.parse(raw) as DocItem;
}

function normalizeDocs(docs: DocItem[]): DocItem[] {
  let migrated = docs.map((d) =>
    enrichDocMeta({
      ...d,
      phases: migratePhases(d.phases as string[]),
    } as DocItem & { format?: string }),
  );
  const mtqtSeed = SEED_DOCS.find((d) => d.id === "mtqt");
  if (mtqtSeed) {
    migrated = [mtqtSeed, ...migrated.filter((d) => d.id !== "mtqt")];
  }
  return migrated;
}

async function readDocsFromDb(): Promise<DocItem[]> {
  const rows = await sqlQuery<{ data: string }>(
    "SELECT data FROM docs ORDER BY updated_at DESC",
  );
  return normalizeDocs(rows.map((row) => rowToDoc(row.data)));
}

async function writeDocsToDb(docs: DocItem[]): Promise<void> {
  const statements = [
    { sql: "DELETE FROM docs", args: [] as (string | number | null)[] },
    ...docs.map((doc) => ({
      sql: "INSERT OR REPLACE INTO docs (id, slug, data, updated_at) VALUES (?, ?, ?, ?)",
      args: [doc.id, doc.slug, JSON.stringify(doc), doc.updatedAt],
    })),
  ];
  await sqlBatch(statements);
}

export async function readDocs(): Promise<DocItem[]> {
  await ensureDirs();
  await ensureDbReady();
  return readDocsFromDb();
}

export async function writeDocs(docs: DocItem[]): Promise<void> {
  await ensureDirs();
  await ensureDbReady();
  await writeDocsToDb(docs);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
