import type { Phase } from "./taxonomy";

/** Màu viền node theo giai đoạn MTQT */
export const PHASE_NODE_STYLE: Record<
  Phase,
  { border: string; bg: string; text: string; line: string }
> = {
  "Intake & Qualify": {
    border: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    text: "#bae6fd",
    line: "#0ea5e9",
  },
  Discovery: {
    border: "#818cf8",
    bg: "rgba(99,102,241,0.15)",
    text: "#c7d2fe",
    line: "#6366f1",
  },
  POC: {
    border: "#f472b6",
    bg: "rgba(236,72,153,0.12)",
    text: "#fbcfe8",
    line: "#ec4899",
  },
  Pilot: {
    border: "#fb923c",
    bg: "rgba(249,115,22,0.12)",
    text: "#fed7aa",
    line: "#f97316",
  },
  "RFP/RFI & Bid": {
    border: "#fbbf24",
    bg: "rgba(245,158,11,0.12)",
    text: "#fde68a",
    line: "#f59e0b",
  },
  "Contract & Handoff": {
    border: "#4ade80",
    bg: "rgba(74,222,128,0.12)",
    text: "#bbf7d0",
    line: "#22c55e",
  },
};

export const ROADMAP_LAYOUT = {
  colWidth: 152,
  colGap: 24,
  padX: 28,
  padY: 32,
  mainNodeW: 140,
  mainNodeH: 48,
  subNodeW: 132,
  subNodeH: 34,
  subGap: 10,
  branchGap: 22,
} as const;

export function columnX(index: number): number {
  const { padX, colWidth, colGap } = ROADMAP_LAYOUT;
  return padX + index * (colWidth + colGap) + colWidth / 2;
}

export function mainNodeY(): number {
  return ROADMAP_LAYOUT.padY + ROADMAP_LAYOUT.mainNodeH / 2;
}

export function subNodeY(subIndex: number): number {
  const { padY, mainNodeH, branchGap, subNodeH, subGap } = ROADMAP_LAYOUT;
  return padY + mainNodeH + branchGap + subIndex * (subNodeH + subGap) + subNodeH / 2;
}

export function canvasHeight(subCount: number): number {
  const { padY, mainNodeH, branchGap, subNodeH, subGap } = ROADMAP_LAYOUT;
  return padY + mainNodeH + branchGap + subCount * (subNodeH + subGap) + padY + 8;
}

export function canvasWidth(colCount: number): number {
  const { padX, colWidth, colGap } = ROADMAP_LAYOUT;
  return padX * 2 + colCount * colWidth + (colCount - 1) * colGap;
}
