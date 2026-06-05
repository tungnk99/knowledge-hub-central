import {
  DEFAULT_DOC_CATEGORY,
  DEFAULT_FILE_FORMAT,
  DOC_CATEGORIES,
  FILE_FORMATS,
  type DocCategory,
  type FileFormat,
} from "./taxonomy";
import type { Attachment, DocItem } from "./types";

const LEGACY_FORMAT_MAP: Record<string, DocCategory> = {
  "Slide workshop": "Slide",
  RFP: "RFP",
  Survey: "Survey",
  Proposal: "Proposal",
  Report: "Report",
  Checklist: "Checklist",
  SoW: "SoW",
  "Discovery note": "Discovery",
  "POC report": "POC",
  Khác: "Khác",
};

export function normalizeDocCategory(value: string | undefined): DocCategory {
  if (value && DOC_CATEGORIES.includes(value as DocCategory)) {
    return value as DocCategory;
  }
  if (value && LEGACY_FORMAT_MAP[value]) {
    return LEGACY_FORMAT_MAP[value];
  }
  return DEFAULT_DOC_CATEGORY;
}

export function normalizeFileFormat(value: string | undefined): FileFormat {
  if (value && FILE_FORMATS.includes(value as FileFormat)) {
    return value as FileFormat;
  }
  return DEFAULT_FILE_FORMAT;
}

export function inferFileFormatFromAttachment(attachment?: Attachment): FileFormat | null {
  if (!attachment) return null;
  if (attachment.kind === "link") return "LINK";

  const ext = attachment.fileType.toLowerCase();
  const name = attachment.fileName.toLowerCase();
  const source = `${ext} ${name}`;

  if (source.includes("pdf")) return "PDF";
  if (source.includes("docx") || source.includes(".doc")) return "DOCX";
  if (source.includes("xlsx") || source.includes("xls")) return "XLSX";
  if (source.includes("pptx") || source.includes("ppt")) return "PPTX";
  if (source.includes("csv")) return "CSV";
  if (source.includes("md") || source.includes("markdown")) return "MD";
  if (source.includes("zip")) return "ZIP";
  return null;
}

export function inferFileFormat(
  doc: Pick<DocItem, "attachments" | "fileFormat">,
): FileFormat {
  if (doc.fileFormat) return normalizeFileFormat(doc.fileFormat);
  return inferFileFormatFromAttachment(doc.attachments[0]) ?? DEFAULT_FILE_FORMAT;
}

export function inferDocCategory(
  doc: Pick<DocItem, "title" | "summary" | "type" | "category" | "format">,
): DocCategory {
  const stored = doc.category ?? doc.format;
  if (stored) return normalizeDocCategory(stored);

  const text = `${doc.title} ${doc.summary}`.toLowerCase();
  if (text.includes("effort") || text.includes("man-day") || text.includes("bóc tách")) {
    return "Effort";
  }
  if (text.includes("rfp") || text.includes("thầu") || text.includes("thau")) return "RFP";
  if (text.includes("survey") || text.includes("khảo sát") || text.includes("khao sat")) {
    return "Survey";
  }
  if (text.includes("workshop")) return "Workshop";
  if (text.includes("slide") || text.includes("ppt") || text.includes("đề xuất")) return "Slide";
  if (text.includes("checklist")) return "Checklist";
  if (text.includes("sow")) return "SoW";
  if (text.includes("proposal")) return "Proposal";
  if (text.includes("discovery")) return "Discovery";
  if (text.includes("poc")) return "POC";
  if (doc.type === "Template") return "Effort";
  if (doc.type === "Playbook") return "Workshop";
  if (doc.type === "Chuẩn" || doc.type === "Kinh nghiệm") return "Report";
  return DEFAULT_DOC_CATEGORY;
}

export function enrichDocMeta<T extends DocItem & { format?: string }>(doc: T): DocItem {
  const { format: _legacy, ...rest } = doc;
  return {
    ...rest,
    category: inferDocCategory(doc),
    fileFormat: inferFileFormat(doc),
  };
}
