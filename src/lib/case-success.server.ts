import type { CaseSuccess, CaseSuccessInput } from "./case-success.types";
import { newId, todayISO } from "./db.server";
import { ensureDbReady, sqlExecute, sqlQuery } from "./sqlite.server";

function rowToCase(raw: string): CaseSuccess {
  const item = JSON.parse(raw) as CaseSuccess;
  return {
    ...item,
    shareableKnowledge: item.shareableKnowledge ?? "",
    relatedDocs: item.relatedDocs ?? [],
  };
}

async function saveCase(item: CaseSuccess) {
  await sqlExecute(
    "INSERT OR REPLACE INTO case_success (id, data, updated_at) VALUES (?, ?, ?)",
    [item.id, JSON.stringify(item), item.updatedAt],
  );
}

export async function readCaseStore(): Promise<CaseSuccess[]> {
  await ensureDbReady();
  const rows = await sqlQuery<{ data: string }>(
    "SELECT data FROM case_success ORDER BY updated_at DESC",
  );
  return rows.map((row) => rowToCase(row.data));
}

export async function getCaseById(id: string): Promise<CaseSuccess | null> {
  await ensureDbReady();
  const rows = await sqlQuery<{ data: string }>(
    "SELECT data FROM case_success WHERE id = ?",
    [id],
  );
  return rows[0] ? rowToCase(rows[0].data) : null;
}

export async function createCaseRecord(input: CaseSuccessInput): Promise<CaseSuccess> {
  await ensureDbReady();
  const now = todayISO();
  const item: CaseSuccess = {
    id: newId("case"),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  await saveCase(item);
  return item;
}

export async function updateCaseRecord(id: string, input: CaseSuccessInput): Promise<CaseSuccess> {
  await ensureDbReady();
  const existing = await getCaseById(id);
  if (!existing) throw new Error("Không tìm thấy success case");
  const updated: CaseSuccess = {
    ...existing,
    ...input,
    updatedAt: todayISO(),
  };
  await saveCase(updated);
  return updated;
}

export async function deleteCaseRecord(id: string): Promise<void> {
  await ensureDbReady();
  await sqlExecute("DELETE FROM case_success WHERE id = ?", [id]);
}
