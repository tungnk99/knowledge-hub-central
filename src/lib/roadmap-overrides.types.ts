import type { RoleParticipant } from "./roadmap-enrichment";

export interface PhaseOverride {
  raciAccountable?: string;
  raciResponsible?: string;
  raciConsulted?: string;
  objectives?: string[];
  outputs?: string[];
  description?: string;
  meaning?: string;
  inputs?: string[];
  outputsMeaning?: string[];
  standardSteps?: string[];
  collaboration?: string;
  generalLessons?: string[];
  customerExperiencePrompt?: string[];
  exitCriteria?: string[];
  decisionOwner?: string;
  risks?: string[];
  /** Nội dung cảnh báo review/phê duyệt — Markdown */
  approvalReviewMarkdown?: string;
}

export interface SubStepOverride {
  title?: string;
  description?: string;
  deliverables?: string[];
  responsible?: string;
  collaborators?: string;
  sla?: string;
  approver?: string;
  tips?: string[];
  pic?: string;
  meaning?: string;
  inputs?: string[];
  coordination?: string;
  taskSteps?: string[];
  lessons?: string[];
  exitCriteria?: string[];
  decisionOwner?: string;
  risks?: string[];
  customerExperiencePrompt?: string[];
  participants?: RoleParticipant[];
  /** Nội dung cảnh báo review/phê duyệt — Markdown */
  approvalReviewMarkdown?: string;
}

export interface RoadmapOverridesFile {
  phases: Record<string, PhaseOverride>;
  subSteps: Record<string, SubStepOverride>;
  updatedAt?: string;
}

export const emptyRoadmapOverrides = (): RoadmapOverridesFile => ({
  phases: {},
  subSteps: {},
});
