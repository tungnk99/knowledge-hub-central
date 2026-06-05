export type Phase =
  | "Intake & Qualify"
  | "Discovery"
  | "POC"
  | "Pilot"
  | "RFP/RFI & Bid"
  | "Contract & Handoff";

export type Vertical = "ENV" | "BFSI" | "GOV" | "Dùng chung";
export type Product = "Voice" | "AI Agent" | "CV";
export type DocType = "Chuẩn" | "Template" | "Kinh nghiệm" | "Playbook";

/** Loại nội dung tài liệu: survey, slide, effort, ... */
export type DocCategory =
  | "Survey"
  | "Slide"
  | "Effort"
  | "Workshop"
  | "RFP"
  | "Proposal"
  | "Report"
  | "Checklist"
  | "SoW"
  | "Discovery"
  | "POC"
  | "Khác";

/** Định dạng file: pdf, docx, xlsx, ... */
export type FileFormat = "PDF" | "DOCX" | "XLSX" | "PPTX" | "CSV" | "ZIP" | "LINK" | "MD" | "Khác";

export type DocStatus = "Nháp" | "Đã review" | "Đã duyệt";

export const VERTICALS: Vertical[] = ["ENV", "BFSI", "GOV", "Dùng chung"];
export const PRODUCTS: Product[] = ["Voice", "AI Agent", "CV"];
export const PHASES: Phase[] = [
  "Intake & Qualify",
  "Discovery",
  "POC",
  "Pilot",
  "RFP/RFI & Bid",
  "Contract & Handoff",
];
export const DOC_TYPES: DocType[] = ["Chuẩn", "Template", "Kinh nghiệm", "Playbook"];
export const DOC_CATEGORIES: DocCategory[] = [
  "Survey",
  "Slide",
  "Effort",
  "Workshop",
  "RFP",
  "Proposal",
  "Report",
  "Checklist",
  "SoW",
  "Discovery",
  "POC",
  "Khác",
];
export const FILE_FORMATS: FileFormat[] = [
  "PDF",
  "DOCX",
  "XLSX",
  "PPTX",
  "CSV",
  "ZIP",
  "LINK",
  "MD",
  "Khác",
];
export const DEFAULT_DOC_CATEGORY: DocCategory = "Khác";
export const DEFAULT_FILE_FORMAT: FileFormat = "Khác";
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
  "Intake & Qualify": "bg-phase-approach text-phase-approach-foreground",
  Discovery: "bg-phase-consult text-phase-consult-foreground",
  POC: "bg-phase-poc text-phase-poc-foreground",
  Pilot: "bg-phase-bid text-phase-bid-foreground",
  "RFP/RFI & Bid": "bg-phase-contract text-phase-contract-foreground",
  "Contract & Handoff": "bg-phase-delivery text-phase-delivery-foreground",
};

export const typeClass: Record<DocType, string> = {
  Chuẩn: "bg-type-standard text-type-standard-foreground",
  Template: "bg-type-template text-type-template-foreground",
  "Kinh nghiệm": "bg-type-lesson text-type-lesson-foreground",
  Playbook: "bg-type-playbook text-type-playbook-foreground",
};

export const categoryClass: Record<DocCategory, string> = {
  Survey: "bg-format-survey text-format-survey-foreground",
  Slide: "bg-format-slide text-format-slide-foreground",
  Effort: "bg-format-checklist text-format-checklist-foreground",
  Workshop: "bg-format-discovery text-format-discovery-foreground",
  RFP: "bg-format-rfp text-format-rfp-foreground",
  Proposal: "bg-format-proposal text-format-proposal-foreground",
  Report: "bg-format-report text-format-report-foreground",
  Checklist: "bg-format-checklist text-format-checklist-foreground",
  SoW: "bg-format-sow text-format-sow-foreground",
  Discovery: "bg-format-discovery text-format-discovery-foreground",
  POC: "bg-format-poc text-format-poc-foreground",
  Khác: "bg-format-other text-format-other-foreground",
};

export const fileFormatClass: Record<FileFormat, string> = {
  PDF: "bg-file-pdf text-file-pdf-foreground",
  DOCX: "bg-file-docx text-file-docx-foreground",
  XLSX: "bg-file-xlsx text-file-xlsx-foreground",
  PPTX: "bg-file-pptx text-file-pptx-foreground",
  CSV: "bg-file-csv text-file-csv-foreground",
  ZIP: "bg-file-zip text-file-zip-foreground",
  LINK: "bg-file-link text-file-link-foreground",
  MD: "bg-file-md text-file-md-foreground",
  Khác: "bg-file-other text-file-other-foreground",
};

export const statusClass: Record<DocStatus, string> = {
  Nháp: "bg-status-draft text-status-draft-foreground",
  "Đã review": "bg-status-reviewed text-status-reviewed-foreground",
  "Đã duyệt": "bg-status-approved text-status-approved-foreground",
};
