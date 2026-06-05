export type Vertical = "ENV" | "BFSI" | "GOV" | "Dùng chung";
export type Product = "Voice" | "AI Agent" | "CV";
export type Phase = "Tư vấn" | "PoC" | "Effort Estimation" | "Thầu";
export type DocType = "Chuẩn" | "Template" | "Kinh nghiệm" | "Playbook";
export type DocStatus = "Nháp" | "Đã review" | "Đã duyệt";

export const VERTICALS: Vertical[] = ["ENV", "BFSI", "GOV", "Dùng chung"];
export const PRODUCTS: Product[] = ["Voice", "AI Agent", "CV"];
export const PHASES: Phase[] = ["Tư vấn", "PoC", "Effort Estimation", "Thầu"];
export const DOC_TYPES: DocType[] = ["Chuẩn", "Template", "Kinh nghiệm", "Playbook"];
export const DOC_STATUSES: DocStatus[] = ["Nháp", "Đã review", "Đã duyệt"];

export const verticalClass: Record<Vertical, string> = {
  ENV: "bg-vertical-env text-vertical-env-foreground",
  BFSI: "bg-vertical-bfsi text-vertical-bfsi-foreground",
  GOV: "bg-vertical-gov text-vertical-gov-foreground",
  "Dùng chung": "bg-vertical-common text-vertical-common-foreground",
};

export const productClass: Record<Product, string> = {
  Voice: "bg-product-voice text-product-voice-foreground",
  "AI Agent": "bg-product-agent text-product-agent-foreground",
  CV: "bg-product-cv text-product-cv-foreground",
};

export const phaseClass: Record<Phase, string> = {
  "Tư vấn": "bg-phase-consult text-phase-consult-foreground",
  PoC: "bg-phase-poc text-phase-poc-foreground",
  "Effort Estimation": "bg-phase-effort text-phase-effort-foreground",
  Thầu: "bg-phase-bid text-phase-bid-foreground",
};

export const typeClass: Record<DocType, string> = {
  Chuẩn: "bg-type-standard text-type-standard-foreground",
  Template: "bg-type-template text-type-template-foreground",
  "Kinh nghiệm": "bg-type-lesson text-type-lesson-foreground",
  Playbook: "bg-type-playbook text-type-playbook-foreground",
};

export const statusClass: Record<DocStatus, string> = {
  Nháp: "bg-status-draft text-status-draft-foreground",
  "Đã review": "bg-status-reviewed text-status-reviewed-foreground",
  "Đã duyệt": "bg-status-approved text-status-approved-foreground",
};
