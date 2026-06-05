import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  createCaseRecord,
  deleteCaseRecord,
  getCaseById,
  readCaseStore,
  updateCaseRecord,
} from "../case-success.server";
import type { CaseSuccessInput } from "../case-success.types";
import { requireAdmin, requireAuth } from "../auth-guard.server";
import { PHASES, PRODUCTS, VERTICALS } from "../taxonomy";

const visibilityValues = ["Nội bộ", "Chia sẻ rộng", "Hạn chế"] as const;

const referenceSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  url: z.string().min(1),
});

const caseInputSchema = z.object({
  opportunityCode: z.string(),
  opportunityName: z.string().min(1),
  customerName: z.string().min(1),
  vertical: z.enum(VERTICALS as [string, ...string[]]),
  products: z.array(z.enum(PRODUCTS as [string, ...string[]])),
  phase: z.enum(PHASES as [string, ...string[]]),
  owner: z.string().min(1),
  visibility: z.enum(visibilityValues),
  context: z.string(),
  challenge: z.string(),
  solution: z.string(),
  outcome: z.string(),
  metrics: z.array(z.string()),
  shareableKnowledge: z.string(),
  reusableLessons: z.array(z.string()),
  reuseGuidance: z.string(),
  relatedDocs: z.array(referenceSchema),
  references: z.array(referenceSchema),
  tags: z.array(z.string()),
});

export const listCaseSuccess = createServerFn({ method: "GET" }).handler(async () => {
  await requireAuth();
  return readCaseStore();
});

export const getCaseSuccessById = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAuth();
    const item = await getCaseById(data.id);
    if (!item) throw new Error("Không tìm thấy success case");
    return item;
  });

export const createCaseSuccess = createServerFn({ method: "POST" })
  .inputValidator(caseInputSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return createCaseRecord(data as CaseSuccessInput);
  });

export const updateCaseSuccess = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), input: caseInputSchema }))
  .handler(async ({ data }) => {
    await requireAdmin();
    return updateCaseRecord(data.id, data.input as CaseSuccessInput);
  });

export const deleteCaseSuccess = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await deleteCaseRecord(data.id);
    return { ok: true };
  });
