import type { Phase, Product, Vertical } from "./taxonomy";

export type CaseVisibility = "Nội bộ" | "Chia sẻ rộng" | "Hạn chế";

export interface CaseReference {
  id: string;
  title: string;
  url: string;
}

export interface CaseSuccess {
  id: string;
  opportunityCode: string;
  opportunityName: string;
  customerName: string;
  vertical: Vertical;
  products: Product[];
  phase: Phase;
  owner: string;
  visibility: CaseVisibility;
  context: string;
  challenge: string;
  solution: string;
  outcome: string;
  metrics: string[];
  shareableKnowledge: string;
  reusableLessons: string[];
  reuseGuidance: string;
  relatedDocs: CaseReference[];
  references: CaseReference[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type CaseSuccessInput = Omit<CaseSuccess, "id" | "createdAt" | "updatedAt">;
