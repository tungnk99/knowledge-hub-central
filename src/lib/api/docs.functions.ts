import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  readDocs,
  writeDocs,
  todayISO,
  newId,
} from "../db.server";
import { deleteStoredFile, readStoredFile, storeUploadedFile, UPLOADS_DIR, getStorageMode } from "../storage.server";
import { requireAdmin, requireAuth } from "../auth-guard.server";
import { uniqueSlug } from "../slug";
import type { Attachment, DocInput, DocItem } from "../types";
import {
  DOC_TYPES,
  DOC_CATEGORIES,
  FILE_FORMATS,
  DOC_STATUSES,
  VERTICALS,
  PRODUCTS,
  PHASES,
  type DocStatus,
} from "../taxonomy";

const attachmentSchema = z.object({
  id: z.string(),
  kind: z.enum(["file", "link"]),
  fileName: z.string().min(1),
  fileType: z.string(),
  sizeKb: z.number().optional(),
  url: z.string().optional(),
  storageKey: z.string().optional(),
});

const docInputSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  summary: z.string(),
  body: z.string(),
  type: z.enum(DOC_TYPES as [string, ...string[]]),
  category: z.enum(DOC_CATEGORIES as [string, ...string[]]),
  fileFormat: z.enum(FILE_FORMATS as [string, ...string[]]),
  status: z.enum(DOC_STATUSES as [string, ...string[]]),
  verticals: z.array(z.enum(VERTICALS as [string, ...string[]])),
  products: z.array(z.enum(PRODUCTS as [string, ...string[]])),
  phases: z.array(z.enum(PHASES as [string, ...string[]])),
  owner: z.string().min(1, "Chủ sở hữu không được để trống"),
  attachments: z.array(attachmentSchema),
});

async function cleanupRemovedFiles(prev: Attachment[], next: Attachment[]) {
  const nextKeys = new Set(next.filter((a) => a.kind === "file").map((a) => a.storageKey));
  for (const att of prev) {
    if (att.kind === "file" && att.storageKey && !nextKeys.has(att.storageKey)) {
      await deleteStoredFile(att.storageKey);
    }
  }
}

export const listDocs = createServerFn({ method: "GET" }).handler(async () => {
  await requireAuth();
  return readDocs();
});

export const getDocBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    await requireAuth();
    const docs = await readDocs();
    return docs.find((d) => d.slug === data.slug) ?? null;
  });

export const getDocById = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAuth();
    const docs = await readDocs();
    return docs.find((d) => d.id === data.id) ?? null;
  });

export const createDoc = createServerFn({ method: "POST" })
  .inputValidator(docInputSchema)
  .handler(async ({ data }) => {
    const user = await requireAuth();
    const input = data as DocInput;
    if (user.role === "user" && input.status === "Đã duyệt") {
      throw new Error("Chỉ quản trị viên mới có thể duyệt tài liệu");
    }

    const docs = await readDocs();
    const id = newId("doc");
    const slug = uniqueSlug(
      input.title,
      docs.map((d) => d.slug),
    );
    const doc: DocItem = {
      id,
      slug,
      ...input,
      updatedAt: todayISO(),
      lastReviewedAt: input.status === "Đã duyệt" ? todayISO() : null,
    };
    docs.unshift(doc);
    await writeDocs(docs);
    return doc;
  });

export const updateDoc = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      input: docInputSchema,
    }),
  )
  .handler(async ({ data }) => {
    const user = await requireAuth();
    const docs = await readDocs();
    const idx = docs.findIndex((d) => d.id === data.id);
    if (idx === -1) throw new Error("Không tìm thấy tài liệu");

    const prev = docs[idx];
    const input = data.input as DocInput;

    if (user.role === "user") {
      if (prev.status === "Đã duyệt") {
        throw new Error("Không thể chỉnh sửa tài liệu đã duyệt");
      }
      if (input.status === "Đã duyệt") {
        throw new Error("Chỉ quản trị viên mới có thể duyệt tài liệu");
      }
    }
    await cleanupRemovedFiles(prev.attachments, input.attachments as Attachment[]);

    const slug =
      input.title !== prev.title
        ? uniqueSlug(
            input.title,
            docs.filter((d) => d.id !== data.id).map((d) => d.slug),
          )
        : prev.slug;

    const updated: DocItem = {
      ...prev,
      ...input,
      slug,
      updatedAt: todayISO(),
      lastReviewedAt:
        input.status === "Đã duyệt" && prev.status !== "Đã duyệt"
          ? todayISO()
          : prev.lastReviewedAt,
    };
    docs[idx] = updated;
    await writeDocs(docs);
    return updated;
  });

export const updateDocStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      status: z.enum(DOC_STATUSES as [string, ...string[]]),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const docs = await readDocs();
    const idx = docs.findIndex((d) => d.id === data.id);
    if (idx === -1) throw new Error("Không tìm thấy tài liệu");

    const status = data.status as DocStatus;
    docs[idx] = {
      ...docs[idx],
      status,
      updatedAt: todayISO(),
      lastReviewedAt: status === "Đã duyệt" ? todayISO() : docs[idx].lastReviewedAt,
    };
    await writeDocs(docs);
    return docs[idx];
  });

export const deleteDoc = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const docs = await readDocs();
    const doc = docs.find((d) => d.id === data.id);
    if (!doc) throw new Error("Không tìm thấy tài liệu");

    for (const att of doc.attachments) {
      if (att.kind === "file" && att.storageKey) {
        await deleteStoredFile(att.storageKey);
      }
    }
    await writeDocs(docs.filter((d) => d.id !== data.id));
    return { ok: true };
  });

export const uploadAttachment = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      fileName: z.string().min(1),
      fileType: z.string(),
      base64: z.string().min(1),
      sizeKb: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    await requireAuth();
    const storageKey = `${newId("file")}_${data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const buffer = Buffer.from(data.base64, "base64");
    await storeUploadedFile(storageKey, buffer, data.fileType);

    const attachment: Attachment = {
      id: newId("att"),
      kind: "file",
      fileName: data.fileName,
      fileType: data.fileType,
      sizeKb: data.sizeKb,
      storageKey,
    };
    return attachment;
  });

export const downloadAttachment = createServerFn({ method: "POST" })
  .inputValidator(z.object({ storageKey: z.string() }))
  .handler(async ({ data }) => {
    await requireAuth();
    const buffer = await readStoredFile(data.storageKey);
    return {
      base64: buffer.toString("base64"),
      fileName: data.storageKey.split("_").slice(1).join("_") || "download",
    };
  });

export const getStorageInfo = createServerFn({ method: "GET" }).handler(async () => {
  return { uploadsDir: UPLOADS_DIR, mode: getStorageMode() };
});
