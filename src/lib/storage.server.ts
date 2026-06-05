import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import { del, head, put } from "@vercel/blob";

import { DATA_DIR } from "./sqlite.server";

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function ensureUploadsDir() {
  if (!useBlobStorage() && !existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function storeUploadedFile(
  storageKey: string,
  buffer: Buffer,
  contentType?: string,
): Promise<void> {
  if (useBlobStorage()) {
    await put(storageKey, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: contentType ?? "application/octet-stream",
    });
    return;
  }
  await ensureUploadsDir();
  await writeFile(path.join(UPLOADS_DIR, storageKey), buffer);
}

export async function readStoredFile(storageKey: string): Promise<Buffer> {
  if (useBlobStorage()) {
    const meta = await head(storageKey);
    const response = await fetch(meta.url);
    if (!response.ok) {
      throw new Error("Không đọc được file đính kèm");
    }
    return Buffer.from(await response.arrayBuffer());
  }
  return readFile(path.join(UPLOADS_DIR, storageKey));
}

export async function deleteStoredFile(storageKey: string): Promise<void> {
  if (useBlobStorage()) {
    try {
      await del(storageKey);
    } catch {
      // File may already be gone
    }
    return;
  }
  const filePath = path.join(UPLOADS_DIR, storageKey);
  if (existsSync(filePath)) {
    await unlink(filePath);
  }
}

export function getUploadPath(storageKey: string): string {
  return path.join(UPLOADS_DIR, storageKey);
}

export function getStorageMode(): "blob" | "local" {
  return useBlobStorage() ? "blob" : "local";
}
