import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { createClient, type Client } from "@libsql/client";

import type { UserAccount } from "./auth.types";
import { SEED_CASES } from "./case-success.seed";
import type { CaseSuccess } from "./case-success.types";
import { hashPassword } from "./password.server";
import type { PhaseOverride, RoadmapOverridesFile, SubStepOverride } from "./roadmap-overrides.types";
import { SEED_DOCS } from "./seed-data";
import type { DocItem } from "./types";

export const DATA_DIR = path.join(process.cwd(), "data");
export const DB_PATH = path.join(DATA_DIR, "hub.db");

const JSON_FILES = {
  users: path.join(DATA_DIR, "users.json"),
  docs: path.join(DATA_DIR, "docs.json"),
  roadmap: path.join(DATA_DIR, "roadmap-overrides.json"),
  cases: path.join(DATA_DIR, "case-success.json"),
} as const;

const BOOTSTRAP_KEY = "bootstrap_v1";

let client: Client | null = null;
let ready = false;
let bootPromise: Promise<void> | null = null;

function getDatabaseUrl(): string {
  if (process.env.TURSO_DATABASE_URL) {
    return process.env.TURSO_DATABASE_URL;
  }
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  return `file:${DB_PATH.replace(/\\/g, "/")}`;
}

export function getSqlClient(): Client {
  if (!client) {
    client = createClient({
      url: getDatabaseUrl(),
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

async function initSchema() {
  const sql = getSqlClient();
  const statements = [
    `CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
      password_hash TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS docs (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS roadmap_phase_overrides (
      slug TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS roadmap_substep_overrides (
      sub_id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS case_success (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
  ];
  for (const statement of statements) {
    await sql.execute(statement);
  }
}

async function setMeta(key: string, value: string) {
  await getSqlClient().execute({
    sql: "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
    args: [key, value],
  });
}

async function getMeta(key: string): Promise<string | undefined> {
  const result = await getSqlClient().execute({
    sql: "SELECT value FROM meta WHERE key = ?",
    args: [key],
  });
  return result.rows[0]?.value as string | undefined;
}

async function insertUser(user: UserAccount) {
  await getSqlClient().execute({
    sql: `INSERT OR REPLACE INTO users (id, email, name, role, password_hash, active, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      user.id,
      user.email,
      user.name,
      user.role,
      user.passwordHash,
      user.active ? 1 : 0,
      user.createdAt,
    ],
  });
}

async function insertDoc(doc: DocItem) {
  await getSqlClient().execute({
    sql: "INSERT OR REPLACE INTO docs (id, slug, data, updated_at) VALUES (?, ?, ?, ?)",
    args: [doc.id, doc.slug, JSON.stringify(doc), doc.updatedAt],
  });
}

async function insertCase(item: CaseSuccess) {
  await getSqlClient().execute({
    sql: "INSERT OR REPLACE INTO case_success (id, data, updated_at) VALUES (?, ?, ?)",
    args: [item.id, JSON.stringify(item), item.updatedAt],
  });
}

async function importRoadmapFromFile(data: RoadmapOverridesFile) {
  const sql = getSqlClient();
  const batch: { sql: string; args: (string | number)[] }[] = [];
  for (const [slug, patch] of Object.entries(data.phases ?? {})) {
    batch.push({
      sql: "INSERT OR REPLACE INTO roadmap_phase_overrides (slug, data) VALUES (?, ?)",
      args: [slug, JSON.stringify(patch)],
    });
  }
  for (const [subId, patch] of Object.entries(data.subSteps ?? {})) {
    batch.push({
      sql: "INSERT OR REPLACE INTO roadmap_substep_overrides (sub_id, data) VALUES (?, ?)",
      args: [subId, JSON.stringify(patch)],
    });
  }
  if (batch.length > 0) {
    await sql.batch(batch, "write");
  }
  if (data.updatedAt) {
    await setMeta("roadmap_updated_at", data.updatedAt);
  }
}

async function seedDefaultUsers(now: string) {
  const users: UserAccount[] = [
    {
      id: "usr_admin",
      email: "admin@fpt.com",
      name: "Admin",
      role: "admin",
      passwordHash: await hashPassword("admin123"),
      active: true,
      createdAt: now,
    },
    {
      id: "usr_user",
      email: "user@fpt.com",
      name: "Consultant",
      role: "user",
      passwordHash: await hashPassword("user123"),
      active: true,
      createdAt: now,
    },
  ];
  for (const user of users) {
    await insertUser(user);
  }
}

async function bootstrapOnce() {
  await initSchema();
  if (await getMeta(BOOTSTRAP_KEY)) return;

  const now = new Date().toISOString().slice(0, 10);

  if (existsSync(JSON_FILES.users)) {
    const users = JSON.parse(readFileSync(JSON_FILES.users, "utf-8")) as UserAccount[];
    for (const user of users) await insertUser(user);
  } else {
    await seedDefaultUsers(now);
  }

  if (existsSync(JSON_FILES.docs)) {
    const docs = JSON.parse(readFileSync(JSON_FILES.docs, "utf-8")) as DocItem[];
    for (const doc of docs) await insertDoc(doc);
  } else {
    for (const doc of SEED_DOCS) await insertDoc(doc);
  }

  if (existsSync(JSON_FILES.roadmap)) {
    await importRoadmapFromFile(
      JSON.parse(readFileSync(JSON_FILES.roadmap, "utf-8")) as RoadmapOverridesFile,
    );
  }

  if (existsSync(JSON_FILES.cases)) {
    const cases = JSON.parse(readFileSync(JSON_FILES.cases, "utf-8")) as CaseSuccess[];
    for (const item of cases) await insertCase(item);
  } else {
    for (const item of SEED_CASES) await insertCase(item);
  }

  await setMeta(BOOTSTRAP_KEY, new Date().toISOString());
}

export async function ensureDbReady(): Promise<void> {
  if (ready) return;
  if (!bootPromise) {
    bootPromise = bootstrapOnce().then(() => {
      ready = true;
    });
  }
  await bootPromise;
}

export function parseRoadmapPatch<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

export async function readRoadmapUpdatedAt(): Promise<string | undefined> {
  return getMeta("roadmap_updated_at");
}

export async function writeRoadmapUpdatedAt(value: string) {
  await setMeta("roadmap_updated_at", value);
}

export async function upsertPhaseOverride(slug: string, patch: PhaseOverride) {
  await getSqlClient().execute({
    sql: "INSERT OR REPLACE INTO roadmap_phase_overrides (slug, data) VALUES (?, ?)",
    args: [slug, JSON.stringify(patch)],
  });
}

export async function upsertSubStepOverride(subId: string, patch: SubStepOverride) {
  await getSqlClient().execute({
    sql: "INSERT OR REPLACE INTO roadmap_substep_overrides (sub_id, data) VALUES (?, ?)",
    args: [subId, JSON.stringify(patch)],
  });
}

export async function readPhaseOverrides(): Promise<Record<string, PhaseOverride>> {
  const result = await getSqlClient().execute("SELECT slug, data FROM roadmap_phase_overrides");
  const out: Record<string, PhaseOverride> = {};
  for (const row of result.rows) {
    out[row.slug as string] = parseRoadmapPatch<PhaseOverride>(row.data as string);
  }
  return out;
}

export async function readSubStepOverrides(): Promise<Record<string, SubStepOverride>> {
  const result = await getSqlClient().execute(
    "SELECT sub_id, data FROM roadmap_substep_overrides",
  );
  const out: Record<string, SubStepOverride> = {};
  for (const row of result.rows) {
    out[row.sub_id as string] = parseRoadmapPatch<SubStepOverride>(row.data as string);
  }
  return out;
}

export async function sqlExecute(
  sql: string,
  args: (string | number | null)[] = [],
): Promise<void> {
  await getSqlClient().execute({ sql, args });
}

export async function sqlQuery<T extends Record<string, unknown>>(
  sql: string,
  args: (string | number | null)[] = [],
): Promise<T[]> {
  const result = await getSqlClient().execute({ sql, args });
  return result.rows as T[];
}

export async function sqlBatch(statements: { sql: string; args: (string | number | null)[] }[]) {
  if (statements.length === 0) return;
  await getSqlClient().batch(statements, "write");
}
