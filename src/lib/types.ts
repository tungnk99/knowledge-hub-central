import type { Vertical, Product, Phase, DocType, DocCategory, FileFormat, DocStatus } from "./taxonomy";

export type AttachmentKind = "file" | "link";

export interface Attachment {
  id: string;
  kind: AttachmentKind;
  fileName: string;
  fileType: string;
  sizeKb?: number;
  /** URL ngoài — dùng khi kind = "link" */
  url?: string;
  /** Khóa lưu trữ nội bộ — dùng khi kind = "file" */
  storageKey?: string;
}

export interface DocItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  type: DocType;
  category: DocCategory;
  fileFormat: FileFormat;
  status: DocStatus;
  verticals: Vertical[];
  products: Product[];
  phases: Phase[];
  owner: string;
  updatedAt: string;
  lastReviewedAt: string | null;
  attachments: Attachment[];
}

export interface DocInput {
  title: string;
  summary: string;
  body: string;
  type: DocType;
  category: DocCategory;
  fileFormat: FileFormat;
  status: DocStatus;
  verticals: Vertical[];
  products: Product[];
  phases: Phase[];
  owner: string;
  attachments: Attachment[];
}
