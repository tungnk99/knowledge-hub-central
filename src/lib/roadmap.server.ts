import type {
  PhaseOverride,
  RoadmapOverridesFile,
  SubStepOverride,
} from "./roadmap-overrides.types";
import { emptyRoadmapOverrides } from "./roadmap-overrides.types";
import { todayISO } from "./db.server";
import {
  ensureDbReady,
  readPhaseOverrides,
  readRoadmapUpdatedAt,
  readSubStepOverrides,
  upsertPhaseOverride,
  upsertSubStepOverride,
  writeRoadmapUpdatedAt,
} from "./sqlite.server";

export async function readRoadmapOverrides(): Promise<RoadmapOverridesFile> {
  await ensureDbReady();
  return {
    phases: await readPhaseOverrides(),
    subSteps: await readSubStepOverrides(),
    updatedAt: await readRoadmapUpdatedAt(),
  };
}

export async function savePhaseOverride(
  slug: string,
  patch: PhaseOverride,
): Promise<RoadmapOverridesFile> {
  await ensureDbReady();
  const phases = await readPhaseOverrides();
  const merged = { ...phases[slug], ...patch };
  await upsertPhaseOverride(slug, merged);
  await writeRoadmapUpdatedAt(todayISO());
  return readRoadmapOverrides();
}

export async function saveSubStepOverride(
  subId: string,
  patch: SubStepOverride,
): Promise<RoadmapOverridesFile> {
  await ensureDbReady();
  const subSteps = await readSubStepOverrides();
  const merged = { ...subSteps[subId], ...patch };
  await upsertSubStepOverride(subId, merged);
  await writeRoadmapUpdatedAt(todayISO());
  return readRoadmapOverrides();
}

export { emptyRoadmapOverrides };
