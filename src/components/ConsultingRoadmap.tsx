import { useMemo, useState } from "react";

import { StepDetailPanel, filterRelatedDocs } from "@/components/StepDetailPanel";
import {
  CONSULTING_ROADMAP,
  getSubStep,
  type RoadmapStep,
  type RoadmapSubStep,
} from "@/lib/consulting-roadmap";
import {
  canvasHeight,
  canvasWidth,
  columnX,
  mainNodeY,
  PHASE_NODE_STYLE,
  ROADMAP_LAYOUT,
  subNodeY,
} from "@/lib/roadmap-layout";
import type { DocItem } from "@/lib/types";
import type { RoadmapOverridesFile } from "@/lib/roadmap-overrides.types";
import { cn } from "@/lib/utils";

interface Props {
  docs: DocItem[];
  overrides: RoadmapOverridesFile;
  initialStep?: string;
  initialSub?: string;
  onStepChange?: (stepSlug: string, subId?: string) => void;
}

type NodeKind = "phase" | "sub";

interface SelectedNode {
  kind: NodeKind;
  stepSlug: string;
  subId?: string;
}

export function ConsultingRoadmap({ docs, overrides, initialStep, initialSub, onStepChange }: Props) {
  const defaultStep = initialStep ?? CONSULTING_ROADMAP[0]!.slug;
  const [selected, setSelected] = useState<SelectedNode>(() =>
    initialSub && initialStep
      ? { kind: "sub", stepSlug: initialStep, subId: initialSub }
      : { kind: "phase", stepSlug: defaultStep },
  );

  const activeStep =
    CONSULTING_ROADMAP.find((s) => s.slug === selected.stepSlug) ?? CONSULTING_ROADMAP[0]!;
  const activeSub =
    selected.kind === "sub" && selected.subId
      ? getSubStep(activeStep, selected.subId)
      : null;

  const relatedDocs = useMemo(
    () =>
      filterRelatedDocs(
        docs,
        activeStep.phase,
        activeSub,
        activeSub ? overrides.subSteps[activeSub.id] : undefined,
      ),
    [docs, activeStep.phase, activeSub, overrides],
  );

  const maxSubs = Math.max(...CONSULTING_ROADMAP.map((s) => s.subSteps.length));
  const W = canvasWidth(CONSULTING_ROADMAP.length);
  const H = canvasHeight(maxSubs);

  const selectPhase = (step: RoadmapStep) => {
    setSelected({ kind: "phase", stepSlug: step.slug });
    onStepChange?.(step.slug);
  };

  const selectSub = (step: RoadmapStep, sub: RoadmapSubStep) => {
    setSelected({ kind: "sub", stepSlug: step.slug, subId: sub.id });
    onStepChange?.(step.slug, sub.id);
  };

  const isPhaseActive = (slug: string) =>
    selected.stepSlug === slug && selected.kind === "phase";
  const isSubActive = (subId: string) =>
    selected.kind === "sub" && selected.subId === subId;

  return (
    <div className="space-y-0">
      {/* Graph canvas — roadmap.sh style */}
      <div className="roadmap-canvas overflow-x-auto rounded-t-xl border border-b-0">
        <div className="relative" style={{ width: W, height: H, minWidth: "100%" }}>
          <svg
            className="pointer-events-none absolute inset-0"
            width={W}
            height={H}
            aria-hidden
          >
            {/* Horizontal main flow */}
            {CONSULTING_ROADMAP.slice(0, -1).map((step, i) => {
              const { mainNodeW } = ROADMAP_LAYOUT;
              const x1 = columnX(i) + mainNodeW / 2 + 4;
              const x2 = columnX(i + 1) - mainNodeW / 2 - 4;
              const y = mainNodeY();
              const style = PHASE_NODE_STYLE[step.phase];
              return (
                <g key={`h-${step.slug}`}>
                  <line
                    x1={x1}
                    y1={y}
                    x2={x2}
                    y2={y}
                    stroke={style.line}
                    strokeWidth={2}
                    strokeOpacity={0.6}
                  />
                  <polygon
                    points={`${x2},${y} ${x2 - 8},${y - 4} ${x2 - 8},${y + 4}`}
                    fill={style.line}
                    opacity={0.8}
                  />
                </g>
              );
            })}

            {/* Vertical branches + sub connectors */}
            {CONSULTING_ROADMAP.map((step, colIdx) => {
              const cx = columnX(colIdx);
              const my = mainNodeY();
              const style = PHASE_NODE_STYLE[step.phase];
              const branchStart = my + ROADMAP_LAYOUT.mainNodeH / 2 + 4;
              const branchEnd = subNodeY(0) - ROADMAP_LAYOUT.subNodeH / 2 - 4;

              return (
                <g key={`v-${step.slug}`}>
                  <line
                    x1={cx}
                    y1={branchStart}
                    x2={cx}
                    y2={branchEnd}
                    stroke={style.line}
                    strokeWidth={2}
                    strokeOpacity={0.45}
                  />
                  {step.subSteps.map((sub, subIdx) => {
                    const sy = subNodeY(subIdx);
                    if (subIdx === 0) return null;
                    const prevY = subNodeY(subIdx - 1);
                    return (
                      <line
                        key={sub.id}
                        x1={cx}
                        y1={prevY + ROADMAP_LAYOUT.subNodeH / 2 + 2}
                        x2={cx}
                        y2={sy - ROADMAP_LAYOUT.subNodeH / 2 - 2}
                        stroke={style.line}
                        strokeWidth={1.5}
                        strokeOpacity={0.35}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* Phase nodes */}
          {CONSULTING_ROADMAP.map((step, colIdx) => {
            const cx = columnX(colIdx);
            const cy = mainNodeY();
            const style = PHASE_NODE_STYLE[step.phase];
            const active = isPhaseActive(step.slug);
            const inColumn = selected.stepSlug === step.slug;
            const { mainNodeW, mainNodeH } = ROADMAP_LAYOUT;

            return (
              <RoadmapNodeButton
                key={step.slug}
                label={step.title}
                left={cx - mainNodeW / 2}
                top={cy - mainNodeH / 2}
                width={mainNodeW}
                height={mainNodeH}
                variant="main"
                active={active}
                dimmed={inColumn && !active}
                borderColor={style.border}
                backgroundColor={active ? style.bg : "rgba(30,41,59,0.9)"}
                color={style.text}
                glowColor={style.border}
                onClick={() => selectPhase(step)}
              />
            );
          })}

          {/* Sub nodes */}
          {CONSULTING_ROADMAP.map((step, colIdx) => {
            const cx = columnX(colIdx);
            const style = PHASE_NODE_STYLE[step.phase];
            const { subNodeW, subNodeH } = ROADMAP_LAYOUT;

            return step.subSteps.map((sub, subIdx) => {
              const cy = subNodeY(subIdx);
              const active = isSubActive(sub.id);

              return (
                <RoadmapNodeButton
                  key={sub.id}
                  label={sub.title}
                  left={cx - subNodeW / 2}
                  top={cy - subNodeH / 2}
                  width={subNodeW}
                  height={subNodeH}
                  variant="sub"
                  active={active}
                  borderColor={active ? "#fbbf24" : style.border}
                  backgroundColor={active ? "rgba(251,191,36,0.12)" : "rgba(15,23,42,0.85)"}
                  color={active ? "#fde68a" : "#94a3b8"}
                  glowColor="#fbbf24"
                  onClick={() => selectSub(step, sub)}
                />
              );
            });
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 border-t border-slate-700/60 px-4 py-2.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Giai đoạn
          </span>
          {CONSULTING_ROADMAP.map((s) => (
            <span key={s.slug} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: PHASE_NODE_STYLE[s.phase].border }}
              />
              {s.phase}
            </span>
          ))}
          <span className="ml-auto text-[11px] text-slate-500">
            Bấm node để xem chi tiết ↓
          </span>
        </div>
      </div>

      {/* Detail panel — min-height cố định tránh nhảy layout */}
      <div className="roadmap-detail-panel rounded-b-xl border bg-card">
        <StepDetailPanel
          step={activeStep}
          sub={activeSub}
          relatedDocs={relatedDocs}
          overrides={overrides}
          onClose={() => selectPhase(activeStep)}
          showClose={selected.kind === "sub"}
          onSelectSub={(subId) => {
            const sub = getSubStep(activeStep, subId);
            if (sub) selectSub(activeStep, sub);
          }}
        />
      </div>
    </div>
  );
}

function RoadmapNodeButton({
  label,
  left,
  top,
  width,
  height,
  variant,
  active,
  dimmed,
  borderColor,
  backgroundColor,
  color,
  glowColor,
  onClick,
}: {
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
  variant: "main" | "sub";
  active: boolean;
  dimmed?: boolean;
  borderColor: string;
  backgroundColor: string;
  color: string;
  glowColor: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "roadmap-node absolute flex items-center justify-center text-center",
        variant === "main" ? "roadmap-node-main" : "roadmap-node-sub",
        active && "roadmap-node-active",
        dimmed && "roadmap-node-in-column",
      )}
      style={{
        left,
        top,
        width,
        height,
        borderColor,
        backgroundColor,
        color,
        boxShadow: active
          ? `0 0 0 2px ${glowColor}, 0 0 16px ${glowColor}33`
          : undefined,
      }}
    >
      <span className="line-clamp-2 leading-snug">{label}</span>
    </button>
  );
}
