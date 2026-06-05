import type { CaseSuccess } from "./case-success.types";
import type { Vertical } from "./taxonomy";

export type OppType = "gov" | "ent" | "bank" | "common";

export const OPP_TYPES: OppType[] = ["gov", "ent", "bank", "common"];

export const OPP_TYPE_LABELS: Record<OppType, string> = {
  gov: "Gov",
  ent: "Enterprise",
  bank: "Bank",
  common: "Dùng chung",
};

export const VERTICAL_TO_OPP_TYPE: Record<Vertical, OppType> = {
  GOV: "gov",
  ENV: "ent",
  BFSI: "bank",
  "Dùng chung": "common",
};

export function getCaseOppType(item: CaseSuccess): OppType {
  return VERTICAL_TO_OPP_TYPE[item.vertical];
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function caseHaystack(item: CaseSuccess): string {
  const oppType = getCaseOppType(item);
  return normalizeSearchText(
    [
      item.opportunityCode,
      item.opportunityName,
      item.customerName,
      item.vertical,
      item.phase,
      item.owner,
      item.visibility,
      item.context,
      item.challenge,
      item.solution,
      item.outcome,
      item.shareableKnowledge,
      item.reuseGuidance,
      oppType,
      OPP_TYPE_LABELS[oppType],
      ...item.products,
      ...item.metrics,
      ...item.reusableLessons,
      ...item.tags,
      ...item.relatedDocs.map((d) => `${d.title} ${d.url}`),
      ...item.references.map((d) => `${d.title} ${d.url}`),
    ].join(" "),
  );
}

export interface CaseSuccessFilterState {
  query: string;
  oppType: OppType | "all";
  vertical: Vertical | "all";
}

export function filterCaseSuccessList(
  cases: CaseSuccess[],
  filters: CaseSuccessFilterState,
): CaseSuccess[] {
  const q = normalizeSearchText(filters.query.trim());

  return cases.filter((item) => {
    if (filters.oppType !== "all" && getCaseOppType(item) !== filters.oppType) {
      return false;
    }
    if (filters.vertical !== "all" && item.vertical !== filters.vertical) {
      return false;
    }
    if (!q) return true;

    const haystack = caseHaystack(item);
    const tokens = q.split(/\s+/).filter(Boolean);
    return tokens.every((token) => haystack.includes(token));
  });
}
