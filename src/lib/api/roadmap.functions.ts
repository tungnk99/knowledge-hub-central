import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin, requireAuth } from "../auth-guard.server";
import {
  readRoadmapOverrides,
  savePhaseOverride,
  saveSubStepOverride,
} from "../roadmap.server";

const stringList = z.array(z.string());

const phaseOverrideSchema = z.object({
  slug: z.string(),
  patch: z.object({
    raciAccountable: z.string().optional(),
    raciResponsible: z.string().optional(),
    raciConsulted: z.string().optional(),
    objectives: stringList.optional(),
    outputs: stringList.optional(),
    description: z.string().optional(),
    meaning: z.string().optional(),
    inputs: stringList.optional(),
    outputsMeaning: stringList.optional(),
    standardSteps: stringList.optional(),
    collaboration: z.string().optional(),
    generalLessons: stringList.optional(),
    customerExperiencePrompt: stringList.optional(),
    exitCriteria: stringList.optional(),
    decisionOwner: z.string().optional(),
    risks: stringList.optional(),
    approvalReviewMarkdown: z.string().optional(),
  }),
});

const subStepOverrideSchema = z.object({
  subId: z.string(),
  patch: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    deliverables: stringList.optional(),
    responsible: z.string().optional(),
    collaborators: z.string().optional(),
    sla: z.string().optional(),
    approver: z.string().optional(),
    tips: stringList.optional(),
    pic: z.string().optional(),
    meaning: z.string().optional(),
    inputs: stringList.optional(),
    coordination: z.string().optional(),
    taskSteps: stringList.optional(),
    lessons: stringList.optional(),
    exitCriteria: stringList.optional(),
    decisionOwner: z.string().optional(),
    risks: stringList.optional(),
    customerExperiencePrompt: stringList.optional(),
    approvalReviewMarkdown: z.string().optional(),
  }),
});

export const getRoadmapOverrides = createServerFn({ method: "GET" }).handler(async () => {
  await requireAuth();
  return readRoadmapOverrides();
});

export const updatePhaseOverride = createServerFn({ method: "POST" })
  .inputValidator(phaseOverrideSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return savePhaseOverride(data.slug, data.patch);
  });

export const updateSubStepOverride = createServerFn({ method: "POST" })
  .inputValidator(subStepOverrideSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return saveSubStepOverride(data.subId, data.patch);
  });
