import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  GitBranch,
  History,
  Inbox,
  Lightbulb,
  ListOrdered,
  ShieldCheck,
  Target,
  User,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DocCard } from "@/components/DocCard";
import {
  AdminEditBar,
  ApprovalReviewEditor,
  cleanList,
  EditableList,
  EditableParagraph,
  EditableText,
  resolveApprovalReviewMarkdown,
  useEditableDraft,
} from "@/components/RoadmapEditableFields";
import { TagBadge } from "@/components/TagBadge";
import type { RoadmapStep, RoadmapSubStep } from "@/lib/consulting-roadmap";
import {
  enrichPhase,
  enrichSubStep,
  RACI_COLOR,
  RACI_LABEL,
  type PhaseEnrichment,
  type RoleParticipant,
  type StepEnrichment,
} from "@/lib/roadmap-enrichment";
import type { PhaseOverride, RoadmapOverridesFile, SubStepOverride } from "@/lib/roadmap-overrides.types";
import { useSavePhaseOverride, useSaveSubStepOverride } from "@/lib/queries";
import type { DocItem } from "@/lib/types";
import { getPhaseGlossary } from "@/lib/mtqt-glossary";
import type { Phase } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import { Route as RootRoute } from "@/routes/__root";

type EnrichedSub = RoadmapSubStep & StepEnrichment;
type EnrichedPhase = RoadmapStep & PhaseEnrichment;

interface Props {
  step: RoadmapStep;
  sub: RoadmapSubStep | null | undefined;
  relatedDocs: DocItem[];
  overrides: RoadmapOverridesFile;
  onClose: () => void;
  showClose: boolean;
  onSelectSub?: (subId: string) => void;
}

export function StepDetailPanel({
  step,
  sub,
  relatedDocs,
  overrides,
  onClose,
  showClose,
  onSelectSub,
}: Props) {
  const phaseOverride = overrides.phases[step.slug];
  const subOverride = sub ? overrides.subSteps[sub.id] : undefined;
  const enriched = sub ? enrichSubStep(sub, subOverride) : null;

  return (
    <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
      <div className="max-h-[70vh] overflow-y-auto border-b p-5 lg:border-b-0 lg:border-r">
        <Header step={step} sub={sub} enriched={enriched} onClose={onClose} showClose={showClose} />

        {enriched ? (
          <SubStepDetail enriched={enriched} sub={sub!} subOverride={subOverride} phase={step.phase} />
        ) : (
          <PhaseDetail step={step} phaseOverride={phaseOverride} overrides={overrides} onSelectSub={onSelectSub} />
        )}
      </div>

      <aside className="max-h-[70vh] overflow-y-auto p-5">
        <DocsSidebar step={step} relatedDocs={relatedDocs} />
      </aside>
    </div>
  );
}

function Header({
  step,
  sub,
  enriched,
  onClose,
  showClose,
}: {
  step: RoadmapStep;
  sub: RoadmapSubStep | null | undefined;
  enriched: EnrichedSub | null;
  onClose: () => void;
  showClose: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <TagBadge kind="phase" value={step.phase} />
          {sub ? (
            <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">Bước {sub.code}</span>
          ) : (
            <span className="text-xs text-muted-foreground">Tổng quan giai đoạn {step.order}/6</span>
          )}
        </div>
        <h2 className="mt-2 text-lg font-bold">{sub ? sub.title : step.title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{sub ? sub.description : step.description}</p>
        {enriched && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
            <User className="h-3.5 w-3.5" />
            PIC: {enriched.pic}
          </p>
        )}
      </div>
      {showClose && (
        <button type="button" onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent" title="Về tổng quan giai đoạn">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function SubStepDetail({
  enriched,
  sub,
  subOverride,
  phase,
}: {
  enriched: EnrichedSub;
  sub: RoadmapSubStep;
  subOverride?: SubStepOverride;
  phase: Phase;
}) {
  const { role } = RootRoute.useRouteContext();
  const isAdmin = role === "admin";
  const saveMut = useSaveSubStepOverride();
  const [editing, setEditing] = useState(false);

  const autoReviewItems = useMemo(() => getSubApprovalReviewItems(enriched), [enriched]);

  const source = useMemo(
    () => ({
      approvalReviewMarkdown: resolveApprovalReviewMarkdown(
        subOverride?.approvalReviewMarkdown,
        autoReviewItems,
      ),
      meaning: enriched.meaning ?? enriched.description,
      inputs: enriched.inputs ?? [],
      coordination: enriched.coordination,
      taskSteps: enriched.taskSteps,
      lessons: enriched.lessons,
      exitCriteria: enriched.exitCriteria ?? [],
      decisionOwner: enriched.decisionOwner ?? "",
      risks: enriched.risks ?? [],
      customerExperiencePrompt: enriched.customerExperiencePrompt ?? [],
      pic: enriched.pic,
      sla: enriched.sla ?? "",
      approver: enriched.approver ?? "",
    }),
    [enriched, subOverride?.approvalReviewMarkdown, autoReviewItems],
  );

  const [draft, setDraft] = useEditableDraft(source, editing);

  const handleSave = async () => {
    try {
      await saveMut.mutateAsync({
        subId: sub.id,
        patch: {
          ...subOverride,
          approvalReviewMarkdown: draft.approvalReviewMarkdown.trim(),
          meaning: draft.meaning.trim(),
          inputs: cleanList(draft.inputs),
          coordination: draft.coordination.trim(),
          taskSteps: cleanList(draft.taskSteps),
          lessons: cleanList(draft.lessons),
          exitCriteria: cleanList(draft.exitCriteria),
          decisionOwner: draft.decisionOwner.trim(),
          risks: cleanList(draft.risks),
          customerExperiencePrompt: cleanList(draft.customerExperiencePrompt),
          pic: draft.pic.trim(),
          sla: draft.sla.trim() || undefined,
          approver: draft.approver.trim() || undefined,
        },
      });
      toast.success("Đã lưu nội dung bước chi tiết.");
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể lưu.");
    }
  };

  return (
    <div className="mt-5 space-y-5">
      {isAdmin && (
        <AdminEditBar
          editing={editing}
          saving={saveMut.isPending}
          onToggle={() => setEditing(true)}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}

      <ApprovalReviewEditor
        markdown={draft.approvalReviewMarkdown}
        editing={editing && isAdmin}
        onChange={(v) => setDraft({ ...draft, approvalReviewMarkdown: v })}
      />

      <Section icon={Target} title="Ý nghĩa trong tư vấn">
        <EditableParagraph
          editing={editing}
          value={draft.meaning}
          onChange={(v) => setDraft({ ...draft, meaning: v })}
        />
      </Section>

      <Section icon={Inbox} title="Đầu vào cần có">
        <EditableList
          editing={editing}
          items={draft.inputs}
          onChange={(items) => setDraft({ ...draft, inputs: items })}
        />
      </Section>

      <Section icon={Users} title="Vai trò & phối hợp (RACI)">
        {editing ? (
          <EditableText
            editing
            value={draft.pic}
            onChange={(v) => setDraft({ ...draft, pic: v })}
            className="mb-2"
          />
        ) : (
          <div className="space-y-2">
            {enriched.participants.map((p) => (
              <ParticipantCard key={`${p.unit}-${p.raci}`} p={p} />
            ))}
          </div>
        )}
      </Section>

      <Section icon={GitBranch} title="Cách phối hợp làm việc">
        <EditableParagraph
          editing={editing}
          value={draft.coordination}
          onChange={(v) => setDraft({ ...draft, coordination: v })}
        />
      </Section>

      <Section icon={ListOrdered} title="Các bước hoàn thành nhiệm vụ">
        <EditableList
          editing={editing}
          items={draft.taskSteps}
          onChange={(items) => setDraft({ ...draft, taskSteps: items })}
          ordered
        />
      </Section>

      {enriched.deliverables && enriched.deliverables.length > 0 && (
        <Section icon={CheckCircle2} title="Sản phẩm đầu ra">
          <ul className="flex flex-wrap gap-1.5">
            {enriched.deliverables.map((d) => (
              <li key={d} className="rounded-md border bg-background px-2.5 py-1 text-xs font-medium">
                {d}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {editing ? (
        <div className="flex flex-wrap gap-3">
          <div className="min-w-[140px] flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">SLA</label>
            <EditableText editing value={draft.sla} onChange={(v) => setDraft({ ...draft, sla: v })} />
          </div>
          <div className="min-w-[140px] flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Phê duyệt</label>
            <EditableText
              editing
              value={draft.approver}
              onChange={(v) => setDraft({ ...draft, approver: v })}
            />
          </div>
        </div>
      ) : (
        <MetaRow sla={enriched.sla} approver={enriched.approver} />
      )}

      <Section icon={ShieldCheck} title="Tiêu chí hoàn thành / Exit criteria">
        <EditableList
          editing={editing}
          items={draft.exitCriteria}
          onChange={(items) => setDraft({ ...draft, exitCriteria: items })}
        />
      </Section>

      {editing ? (
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Người chốt / Decision owner
          </label>
          <EditableText
            editing
            value={draft.decisionOwner}
            onChange={(v) => setDraft({ ...draft, decisionOwner: v })}
          />
        </div>
      ) : (
        <DecisionOwner value={draft.decisionOwner} />
      )}

      <Section icon={Lightbulb} title="Kinh nghiệm đi trước">
        {editing ? (
          <EditableList
            editing
            items={draft.lessons}
            onChange={(items) => setDraft({ ...draft, lessons: items })}
          />
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {draft.lessons.map((tip) => (
              <li
                key={tip}
                className="rounded-lg border border-status-reviewed/30 bg-status-reviewed/10 px-3 py-2.5 text-sm"
              >
                {tip}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={History} title="Kinh nghiệm theo từng KH cần lưu lại">
        <EditableList
          editing={editing}
          items={draft.customerExperiencePrompt}
          onChange={(items) => setDraft({ ...draft, customerExperiencePrompt: items })}
        />
      </Section>

      <Section icon={AlertTriangle} title="Rủi ro & checkpoint cần cảnh giác">
        {editing ? (
          <EditableList
            editing
            items={draft.risks}
            onChange={(items) => setDraft({ ...draft, risks: items })}
          />
        ) : (
          <RiskSection risks={draft.risks} />
        )}
      </Section>

      <PhaseGlossary phase={phase} />
    </div>
  );
}

function PhaseDetail({
  step,
  phaseOverride,
  overrides,
  onSelectSub,
}: {
  step: RoadmapStep;
  phaseOverride?: PhaseOverride;
  overrides: RoadmapOverridesFile;
  onSelectSub?: (subId: string) => void;
}) {
  const { role } = RootRoute.useRouteContext();
  const isAdmin = role === "admin";
  const saveMut = useSavePhaseOverride();
  const [editing, setEditing] = useState(false);
  const enriched = enrichPhase(step, phaseOverride);

  const autoReviewItems = useMemo(() => getPhaseApprovalReviewItems(enriched), [enriched]);

  const source = useMemo(
    () => ({
      approvalReviewMarkdown: resolveApprovalReviewMarkdown(
        phaseOverride?.approvalReviewMarkdown,
        autoReviewItems,
      ),
      raciAccountable: enriched.raciAccountable,
      raciResponsible: enriched.raciResponsible,
      raciConsulted: enriched.raciConsulted,
      meaning: enriched.meaning,
      objectives: enriched.objectives,
      inputs: enriched.inputs,
      outputs: enriched.outputs,
      outputsMeaning: enriched.outputsMeaning,
      standardSteps: enriched.standardSteps,
      collaboration: enriched.collaboration,
      generalLessons: enriched.generalLessons,
      customerExperiencePrompt: enriched.customerExperiencePrompt,
      exitCriteria: enriched.exitCriteria,
      decisionOwner: enriched.decisionOwner,
      risks: enriched.risks,
    }),
    [enriched, phaseOverride?.approvalReviewMarkdown, autoReviewItems],
  );

  const [draft, setDraft] = useEditableDraft(source, editing);

  const handleSave = async () => {
    try {
      await saveMut.mutateAsync({
        slug: step.slug,
        patch: {
          ...phaseOverride,
          approvalReviewMarkdown: draft.approvalReviewMarkdown.trim(),
          raciAccountable: draft.raciAccountable.trim(),
          raciResponsible: draft.raciResponsible.trim(),
          raciConsulted: draft.raciConsulted.trim(),
          meaning: draft.meaning.trim(),
          objectives: cleanList(draft.objectives),
          inputs: cleanList(draft.inputs),
          outputs: cleanList(draft.outputs),
          outputsMeaning: cleanList(draft.outputsMeaning),
          standardSteps: cleanList(draft.standardSteps),
          collaboration: draft.collaboration.trim(),
          generalLessons: cleanList(draft.generalLessons),
          customerExperiencePrompt: cleanList(draft.customerExperiencePrompt),
          exitCriteria: cleanList(draft.exitCriteria),
          decisionOwner: draft.decisionOwner.trim(),
          risks: cleanList(draft.risks),
        },
      });
      toast.success("Đã lưu nội dung giai đoạn.");
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể lưu.");
    }
  };

  return (
    <div className="mt-5 space-y-5">
      {isAdmin && (
        <AdminEditBar
          editing={editing}
          saving={saveMut.isPending}
          onToggle={() => setEditing(true)}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}

      <ApprovalReviewEditor
        markdown={draft.approvalReviewMarkdown}
        editing={editing && isAdmin}
        onChange={(v) => setDraft({ ...draft, approvalReviewMarkdown: v })}
      />

      <div className="grid gap-2 sm:grid-cols-3">
        <EditableRaciBox
          editing={editing}
          label="Accountable (A)"
          value={draft.raciAccountable}
          onChange={(v) => setDraft({ ...draft, raciAccountable: v })}
        />
        <EditableRaciBox
          editing={editing}
          label="Responsible (R)"
          value={draft.raciResponsible}
          onChange={(v) => setDraft({ ...draft, raciResponsible: v })}
        />
        <EditableRaciBox
          editing={editing}
          label="Consulted (C)"
          value={draft.raciConsulted}
          onChange={(v) => setDraft({ ...draft, raciConsulted: v })}
        />
      </div>

      <Section icon={Target} title="Ý nghĩa giai đoạn trong tư vấn">
        <EditableParagraph
          editing={editing}
          value={draft.meaning}
          onChange={(v) => setDraft({ ...draft, meaning: v })}
        />
      </Section>

      <Section icon={Target} title="Mục tiêu giai đoạn">
        {editing ? (
          <EditableList
            editing
            items={draft.objectives}
            onChange={(items) => setDraft({ ...draft, objectives: items })}
          />
        ) : (
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {draft.objectives.map((obj) => (
              <li key={obj} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-approved-foreground" />
                {obj}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={Inbox} title="Đầu vào cần có">
        <EditableList
          editing={editing}
          items={draft.inputs}
          onChange={(items) => setDraft({ ...draft, inputs: items })}
        />
      </Section>

      <Section icon={CheckCircle2} title="Đầu ra giai đoạn">
        {editing ? (
          <div className="space-y-3">
            <EditableList
              editing
              items={draft.outputs}
              onChange={(items) => setDraft({ ...draft, outputs: items })}
            />
            <p className="text-xs font-medium text-muted-foreground">Giải thích đầu ra</p>
            <EditableList
              editing
              items={draft.outputsMeaning}
              onChange={(items) => setDraft({ ...draft, outputsMeaning: items })}
            />
          </div>
        ) : (
          <ul className="space-y-1.5">
            {draft.outputs.map((o, index) => (
              <li key={`${o}-${index}`} className="rounded-md border bg-muted/50 px-3 py-2 text-sm">
                <span className="font-medium">{o}</span>
                {draft.outputsMeaning[index] && (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {draft.outputsMeaning[index]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={ListOrdered} title="Các bước chuẩn phải làm trong giai đoạn">
        <EditableList
          editing={editing}
          items={draft.standardSteps}
          onChange={(items) => setDraft({ ...draft, standardSteps: items })}
          ordered
        />
      </Section>

      <Section icon={GitBranch} title="Ai join & phối hợp như thế nào">
        <EditableParagraph
          editing={editing}
          value={draft.collaboration}
          onChange={(v) => setDraft({ ...draft, collaboration: v })}
        />
      </Section>

      <Section icon={ListOrdered} title="Các bước chi tiết — bấm để xem PIC & phối hợp">
        <ul className="space-y-1.5">
          {step.subSteps.map((s) => {
            const e = enrichSubStep(s, overrides.subSteps[s.id]);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelectSub?.(s.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-accent/50"
                >
                  <span>
                    <span className="font-medium text-primary">{s.code}</span>
                    {" · "}
                    {s.title}
                    {needsApprovalReview(e) && (
                      <span className="ml-2 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:border-amber-500/50 dark:bg-amber-950/30 dark:text-amber-100">
                        Cần duyệt/review
                      </span>
                    )}
                  </span>
                  <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">PIC: {e.pic}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section icon={Lightbulb} title="Kinh nghiệm chung khi làm giai đoạn này">
        <EditableList
          editing={editing}
          items={draft.generalLessons}
          onChange={(items) => setDraft({ ...draft, generalLessons: items })}
        />
      </Section>

      <Section icon={History} title="Kinh nghiệm theo từng KH cần lưu lại">
        <EditableList
          editing={editing}
          items={draft.customerExperiencePrompt}
          onChange={(items) => setDraft({ ...draft, customerExperiencePrompt: items })}
        />
      </Section>

      <Section icon={ShieldCheck} title="Tiêu chí hoàn thành / Exit criteria">
        <EditableList
          editing={editing}
          items={draft.exitCriteria}
          onChange={(items) => setDraft({ ...draft, exitCriteria: items })}
        />
      </Section>

      {editing ? (
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Người chốt / Decision owner
          </label>
          <EditableText
            editing
            value={draft.decisionOwner}
            onChange={(v) => setDraft({ ...draft, decisionOwner: v })}
          />
        </div>
      ) : (
        <DecisionOwner value={draft.decisionOwner} />
      )}

      <Section icon={AlertTriangle} title="Rủi ro & checkpoint cần cảnh giác">
        {editing ? (
          <EditableList
            editing
            items={draft.risks}
            onChange={(items) => setDraft({ ...draft, risks: items })}
          />
        ) : (
          <RiskSection risks={draft.risks} />
        )}
      </Section>

      <PhaseGlossary phase={step.phase} />
    </div>
  );
}

function ParticipantCard({ p }: { p: RoleParticipant }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-sm">{p.unit}</span>
        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold uppercase", RACI_COLOR[p.raci])}>
          {RACI_LABEL[p.raci]}
        </span>
      </div>
      <ul className="mt-2 space-y-0.5">
        {p.duties.map((d) => (
          <li key={d} className="text-xs text-foreground">• {d}</li>
        ))}
      </ul>
      {p.support && (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium">Hỗ trợ:</span> {p.support}
        </p>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </h4>
      {children}
    </section>
  );
}

function PhaseGlossary({ phase }: { phase: Phase }) {
  const [open, setOpen] = useState(false);
  const items = getPhaseGlossary(phase);
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex min-w-0 items-center gap-2">
          <BookOpen className="h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">Thuật ngữ giai đoạn</p>
            <p className="text-xs text-muted-foreground">
              {items.length} thuật ngữ · {phase}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="grid gap-2 border-t px-4 py-3 sm:grid-cols-2">
          {items.map((g) => (
            <div key={g.term} className="rounded-lg border bg-background p-3">
              <span className="text-sm font-semibold text-primary">{g.term}</span>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{g.definition}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChecklistSection({
  icon,
  title,
  items,
  ordered = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  if (items.length === 0) return null;
  const ListTag = ordered ? "ol" : "ul";
  return (
    <Section icon={icon} title={title}>
      <ListTag className="space-y-1.5">
        {items.map((item, index) => (
          <li key={item} className="flex gap-2.5 text-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {ordered ? index + 1 : "•"}
            </span>
            <span className="pt-0.5">{item}</span>
          </li>
        ))}
      </ListTag>
    </Section>
  );
}

const REVIEW_KEYWORDS = [
  "review",
  "phê duyệt",
  "duyệt",
  "approve",
  "approval",
  "sign-off",
  "ký",
  "xác nhận",
  "chốt",
  "go/no-go",
  "bid/no-bid",
];

function getPhaseApprovalReviewItems(phase: EnrichedPhase): string[] {
  return uniqueItems([
    `Người chốt giai đoạn: ${phase.decisionOwner}`,
    `Trước khi chuyển giai đoạn, PIC cần xác nhận đủ exit criteria: ${phase.exitCriteria.slice(0, 2).join("; ")}`,
    ...extractReviewLines(phase.standardSteps, "Bước cần review/xác nhận"),
    ...extractReviewLines(phase.collaboration, "Phối hợp cần lưu ý"),
    ...extractReviewLines(phase.risks, "Checkpoint rủi ro"),
  ]).slice(0, 6);
}

function getSubApprovalReviewItems(sub: EnrichedSub): string[] {
  const approvers = sub.participants
    .filter((p) => p.raci === "A")
    .map((p) => `Accountable/phê duyệt: ${p.unit} - ${p.duties.join("; ")}`);

  return uniqueItems([
    sub.approver ? `Cần phê duyệt: ${sub.approver}` : undefined,
    sub.decisionOwner ? `Người chốt bước này: ${sub.decisionOwner}` : undefined,
    `PIC cần xác nhận trước khi đi tiếp: ${sub.pic}`,
    sub.exitCriteria?.length ? `Exit criteria tối thiểu: ${sub.exitCriteria.slice(0, 2).join("; ")}` : undefined,
    ...approvers,
    ...extractReviewLines(sub.taskSteps, "Bước cần review/xác nhận"),
    ...extractReviewLines(sub.coordination, "Phối hợp cần lưu ý"),
    ...extractReviewLines(sub.risks ?? [], "Checkpoint rủi ro"),
  ]).slice(0, 6);
}

function needsApprovalReview(sub: EnrichedSub): boolean {
  return getSubApprovalReviewItems(sub).length > 0;
}

function extractReviewLines(source: string | string[], prefix: string): string[] {
  const lines = Array.isArray(source) ? source : [source];
  return lines
    .filter((line) => REVIEW_KEYWORDS.some((keyword) => line.toLowerCase().includes(keyword)))
    .map((line) => `${prefix}: ${line}`);
}

function uniqueItems(items: Array<string | undefined>): string[] {
  return Array.from(new Set(items.filter(Boolean) as string[]));
}

function DecisionOwner({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-sm">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Người chốt / Decision owner
      </span>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function RiskSection({ risks }: { risks: string[] }) {
  if (risks.length === 0) return null;
  return (
    <div className="rounded-lg border border-status-reviewed/40 bg-status-reviewed/15 p-3">
      <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-status-reviewed-foreground">
        <AlertTriangle className="h-3.5 w-3.5" />
        Rủi ro & checkpoint cần cảnh giác
      </h4>
      <ul className="space-y-1">
        {risks.map((risk) => (
          <li key={risk} className="text-sm text-status-reviewed-foreground">
            • {risk}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EditableRaciBox({
  editing,
  label,
  value,
  onChange,
}: {
  editing: boolean;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-lg border bg-background px-3 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="mt-0.5">
        <EditableText editing={editing} value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function RaciBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background px-3 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function MetaRow({ sla, approver }: { sla?: string; approver?: string }) {
  if (!sla && !approver) return null;
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      {sla && (
        <span className="flex items-center gap-1.5 rounded-md border px-2.5 py-1">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          SLA: <strong>{sla}</strong>
        </span>
      )}
      {approver && (
        <span className="flex items-center gap-1.5 rounded-md border px-2.5 py-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
          Phê duyệt: <strong>{approver}</strong>
        </span>
      )}
    </div>
  );
}

function DocsSidebar({ step, relatedDocs }: { step: RoadmapStep; relatedDocs: DocItem[] }) {
  return (
    <>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <BookOpen className="h-4 w-4" />
        Tài liệu liên quan
      </h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Ưu tiên: Kinh nghiệm → Playbook → Chuẩn → Template
      </p>
      <div className="mt-3 space-y-2">
        {relatedDocs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
            Chưa có tài liệu.
            <Link
              to="/soan/$id"
              params={{ id: "new" }}
              className="mt-1 block text-primary hover:underline"
            >
              Soạn mới →
            </Link>
          </div>
        ) : (
          <>
            {relatedDocs.slice(0, 4).map((doc) => (
              <DocCard key={doc.id} doc={doc} />
            ))}
            {relatedDocs.length > 4 && (
              <Link
                to="/thu-vien"
                search={{ phase: step.phase as Phase }}
                className="flex items-center justify-center gap-1 py-2 text-xs font-medium text-primary hover:underline"
              >
                +{relatedDocs.length - 4} tài liệu khác
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </>
        )}
      </div>
    </>
  );
}

export function filterRelatedDocs(
  docs: DocItem[],
  phase: Phase,
  sub?: RoadmapSubStep | null,
  subOverride?: SubStepOverride,
): DocItem[] {
  const enriched = sub ? enrichSubStep(sub, subOverride) : null;
  const prioritySlugs = enriched?.docSlugs ?? [];

  const typeOrder = { "Kinh nghiệm": 0, Playbook: 1, Chuẩn: 2, Template: 3 };

  return docs
    .filter((d) => d.status !== "Nháp")
    .filter((d) => d.phases.includes(phase) || prioritySlugs.includes(d.slug))
    .sort((a, b) => {
      const aPri = prioritySlugs.indexOf(a.slug);
      const bPri = prioritySlugs.indexOf(b.slug);
      if (aPri !== -1 || bPri !== -1) {
        if (aPri === -1) return 1;
        if (bPri === -1) return -1;
        return aPri - bPri;
      }
      const ta = typeOrder[a.type as keyof typeof typeOrder] ?? 9;
      const tb = typeOrder[b.type as keyof typeof typeOrder] ?? 9;
      if (ta !== tb) return ta - tb;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}
