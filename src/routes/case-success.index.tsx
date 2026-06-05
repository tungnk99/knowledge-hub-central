import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { TagBadge } from "@/components/TagBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CaseReference, CaseSuccess, CaseSuccessInput, CaseVisibility } from "@/lib/case-success.types";
import {
  filterCaseSuccessList,
  OPP_TYPE_LABELS,
  OPP_TYPES,
  type OppType,
} from "@/lib/case-success-filters";
import {
  useCaseSuccessList,
  useCreateCaseSuccess,
  useDeleteCaseSuccess,
  useUpdateCaseSuccess,
} from "@/lib/queries";
import { PHASES, PRODUCTS, VERTICALS, type Phase, type Product, type Vertical } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import { canManageCaseSuccess } from "@/lib/permissions";
import { Route as RootRoute } from "@/routes/__root";

export const Route = createFileRoute("/case-success/")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Success Case — Kho tri thức Consultant AI" },
      {
        name: "description",
        content:
          "Quản lý success case theo từng Opportunity để lưu kinh nghiệm, kết quả và nguồn tham chiếu tái sử dụng.",
      },
    ],
  }),
  component: CaseSuccessListPage,
});

function CaseSuccessListPage() {
  return <CaseSuccessManager />;
}

const emptyForm: CaseSuccessInput = {
  opportunityCode: "",
  opportunityName: "",
  customerName: "",
  vertical: "Dùng chung",
  products: ["AI Agent"],
  phase: "POC",
  owner: "",
  visibility: "Nội bộ",
  context: "",
  challenge: "",
  solution: "",
  outcome: "",
  metrics: [],
  shareableKnowledge: "",
  reusableLessons: [],
  reuseGuidance: "",
  relatedDocs: [],
  references: [],
  tags: [],
};

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const textareaClass =
  "w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function CaseSuccessManager() {
  const navigate = useNavigate();
  const { role } = RootRoute.useRouteContext();
  const canManage = canManageCaseSuccess(role);
  const { edit } = Route.useSearch();
  const { data: cases = [], isLoading } = useCaseSuccessList();
  const createMut = useCreateCaseSuccess();
  const updateMut = useUpdateCaseSuccess();
  const deleteMut = useDeleteCaseSuccess();
  const [query, setQuery] = useState("");
  const [oppTypeFilter, setOppTypeFilter] = useState<OppType | "all">("all");
  const [verticalFilter, setVerticalFilter] = useState<Vertical | "all">("all");
  const [editing, setEditing] = useState<CaseSuccess | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!edit || !canManage) return;
    const item = cases.find((c) => c.id === edit);
    if (item) {
      setEditing(item);
      setFormOpen(true);
    }
  }, [edit, cases]);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    if (edit) {
      navigate({ to: "/case-success", search: {}, replace: true });
    }
  };

  const filtered = useMemo(
    () =>
      filterCaseSuccessList(cases, {
        query,
        oppType: oppTypeFilter,
        vertical: verticalFilter,
      }),
    [cases, query, oppTypeFilter, verticalFilter],
  );

  const hasActiveFilters =
    query.trim().length > 0 || oppTypeFilter !== "all" || verticalFilter !== "all";

  const clearFilters = () => {
    setQuery("");
    setOppTypeFilter("all");
    setVerticalFilter("all");
  };

  const startNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const startEdit = (item: CaseSuccess) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleSave = async (input: CaseSuccessInput) => {
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, input });
        toast.success("Đã cập nhật success case.");
      } else {
        await createMut.mutateAsync(input);
        toast.success("Đã lưu success case.");
      }
      setFormOpen(false);
      setEditing(null);
      if (edit) {
        navigate({ to: "/case-success", search: {}, replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể lưu success case.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa success case này?")) return;
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Đã xóa success case.");
    } catch {
      toast.error("Không thể xóa success case.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:py-8">
      {formOpen ? (
        <>
          <button
            type="button"
            onClick={closeForm}
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Về danh sách success case
          </button>
          <CaseForm
            mode={editing ? "edit" : "create"}
            initial={editing ?? emptyForm}
            saving={createMut.isPending || updateMut.isPending}
            onCancel={closeForm}
            onSave={handleSave}
          />
        </>
      ) : (
        <>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Success Case theo Opportunity</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Lưu lại bối cảnh, cách xử lý, kết quả, bài học tái sử dụng và nguồn tham chiếu uy tín
            để consultant khác kế thừa khi gặp opportunity tương tự.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Thêm success case
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-card p-2">
          <Search className="ml-1 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo Opp, khách hàng, ngành, bài học, tag..."
            className="flex-1 bg-transparent px-1 py-1.5 text-sm outline-none"
          />
          <span className="pr-2 text-xs text-muted-foreground">{filtered.length} case</span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:w-[420px]">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Type Opp
            </span>
            <select
              value={oppTypeFilter}
              onChange={(e) => setOppTypeFilter(e.target.value as OppType | "all")}
              className={inputClass}
            >
              <option value="all">Tất cả type</option>
              {OPP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {OPP_TYPE_LABELS[type]} ({type})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ngành
            </span>
            <select
              value={verticalFilter}
              onChange={(e) => setVerticalFilter(e.target.value as Vertical | "all")}
              className={inputClass}
            >
              <option value="all">Tất cả ngành</option>
              {VERTICALS.map((vertical) => (
                <option key={vertical} value={vertical}>
                  {vertical}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-primary hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
          {cases.length === 0
            ? "Chưa có success case nào. Hãy thêm case đầu tiên sau một opportunity thành công."
            : "Không tìm thấy case phù hợp. Thử đổi từ khóa hoặc bộ lọc."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-[220px] px-4">Opportunity</TableHead>
                <TableHead className="min-w-[120px]">Khách hàng</TableHead>
                <TableHead className="min-w-[140px]">Ngành / Phase</TableHead>
                <TableHead className="min-w-[100px]">Owner</TableHead>
                <TableHead className="min-w-[100px]">Trạng thái</TableHead>
                <TableHead className="min-w-[200px]">Kết quả</TableHead>
                <TableHead className="w-[140px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <CaseTableRow
                  key={item.id}
                  item={item}
                  canManage={canManage}
                  onEdit={() => startEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                  deleting={deleteMut.isPending}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
        </>
      )}
    </div>
  );
}

function CaseTableRow({
  item,
  canManage,
  onEdit,
  onDelete,
  deleting,
}: {
  item: CaseSuccess;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const navigate = useNavigate();

  const openDetail = () => {
    navigate({ to: "/case-success/$id", params: { id: item.id } });
  };

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={openDetail}>
      <TableCell className="px-4">
        <p className="font-medium">{item.opportunityName}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {item.opportunityCode || "Chưa có mã Opp"}
        </p>
      </TableCell>
      <TableCell>{item.customerName}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          <TagBadge kind="vertical" value={item.vertical} />
          <TagBadge kind="phase" value={item.phase} />
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{item.owner}</TableCell>
      <TableCell>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {item.visibility}
        </span>
      </TableCell>
      <TableCell>
        {item.outcome ? (
          <p className="line-clamp-2 text-muted-foreground">{item.outcome}</p>
        ) : item.metrics[0] ? (
          <p className="line-clamp-2 font-medium text-primary">{item.metrics[0]}</p>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Link
            to="/case-success/$id"
            params={{ id: item.id }}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Eye className="h-3.5 w-3.5" />
            Xem
          </Link>
          {canManage && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="rounded-md border bg-background px-2 py-1 text-xs font-medium hover:bg-accent"
              >
                Sửa
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                title="Xóa case"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

function CaseForm({
  mode,
  initial,
  saving,
  onCancel,
  onSave,
}: {
  mode: "create" | "edit";
  initial: CaseSuccess | CaseSuccessInput;
  saving: boolean;
  onCancel: () => void;
  onSave: (input: CaseSuccessInput) => void;
}) {
  const [form, setForm] = useState<CaseSuccessInput>({
    ...emptyForm,
    ...initial,
  });
  const [metricsText, setMetricsText] = useState(form.metrics.join("\n"));
  const [lessonsText, setLessonsText] = useState(form.reusableLessons.join("\n"));
  const [tagsText, setTagsText] = useState(form.tags.join(", "));
  const [relatedDocs, setRelatedDocs] = useState<CaseReference[]>(form.relatedDocs);
  const [references, setReferences] = useState<CaseReference[]>(form.references);

  const set = <K extends keyof CaseSuccessInput>(key: K, value: CaseSuccessInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = () => {
    if (!form.opportunityName.trim()) {
      toast.error("Vui lòng nhập tên Opportunity.");
      return;
    }
    if (!form.customerName.trim()) {
      toast.error("Vui lòng nhập tên khách hàng.");
      return;
    }
    if (!form.owner.trim()) {
      toast.error("Vui lòng nhập owner/PIC.");
      return;
    }

    onSave({
      ...form,
      opportunityCode: form.opportunityCode.trim(),
      opportunityName: form.opportunityName.trim(),
      customerName: form.customerName.trim(),
      owner: form.owner.trim(),
      metrics: splitLines(metricsText),
      reusableLessons: splitLines(lessonsText),
      relatedDocs,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      references,
    });
  };

  return (
    <section className="mb-5 rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">
            {mode === "edit" ? "Sửa Success Case" : "Thêm Success Case"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Nên nhập ngay sau khi Opp thành công để tri thức còn mới và có nguồn chứng thực.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Tên Opportunity *">
          <input className={inputClass} value={form.opportunityName} onChange={(e) => set("opportunityName", e.target.value)} placeholder="VD: AI Agent Call Center Bank X" />
        </Field>
        <Field label="Mã Opportunity / CRM">
          <input className={inputClass} value={form.opportunityCode} onChange={(e) => set("opportunityCode", e.target.value)} placeholder="VD: OPP-2026-001" />
        </Field>
        <Field label="Khách hàng *">
          <input className={inputClass} value={form.customerName} onChange={(e) => set("customerName", e.target.value)} placeholder="Tên KH" />
        </Field>
        <Field label="Owner / PIC *">
          <input className={inputClass} value={form.owner} onChange={(e) => set("owner", e.target.value)} placeholder="Người phụ trách case" />
        </Field>
        <Field label="Khối ngành">
          <select className={inputClass} value={form.vertical} onChange={(e) => set("vertical", e.target.value as Vertical)}>
            {VERTICALS.map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Phase dùng lại">
          <select className={inputClass} value={form.phase} onChange={(e) => set("phase", e.target.value as Phase)}>
            {PHASES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Sản phẩm">
          <MultiPick<Product>
            items={PRODUCTS}
            value={form.products}
            onChange={(products) => set("products", products)}
          />
        </Field>
        <Field label="Mức chia sẻ">
          <select className={inputClass} value={form.visibility} onChange={(e) => set("visibility", e.target.value as CaseVisibility)}>
            <option>Nội bộ</option>
            <option>Chia sẻ rộng</option>
            <option>Hạn chế</option>
          </select>
        </Field>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Field label="Bối cảnh Opp">
          <textarea className={textareaClass} rows={4} value={form.context} onChange={(e) => set("context", e.target.value)} placeholder="KH là ai, pain point gì, lúc đó deal ở phase nào..." />
        </Field>
        <Field label="Thách thức chính">
          <textarea className={textareaClass} rows={4} value={form.challenge} onChange={(e) => set("challenge", e.target.value)} placeholder="Điểm khó về dữ liệu, stakeholder, cạnh tranh, kỹ thuật..." />
        </Field>
        <Field label="Cách xử lý / approach">
          <textarea className={textareaClass} rows={5} value={form.solution} onChange={(e) => set("solution", e.target.value)} placeholder="Team đã làm gì, ai tham gia, tài liệu/POC/proposal nào dùng..." />
        </Field>
        <Field label="Kết quả / impact">
          <textarea className={textareaClass} rows={5} value={form.outcome} onChange={(e) => set("outcome", e.target.value)} placeholder="Kết quả kinh doanh, kỹ thuật, deal thắng, POC pass, số liệu..." />
        </Field>
        <Field label="Metrics / bằng chứng (mỗi dòng 1 ý)">
          <textarea className={textareaClass} rows={4} value={metricsText} onChange={(e) => setMetricsText(e.target.value)} placeholder="VD: POC pass 92% AC&#10;Giảm 35% thời gian xử lý..." />
        </Field>
        <Field label="Tri thức có thể share lại">
          <textarea className={textareaClass} rows={4} value={form.shareableKnowledge} onChange={(e) => set("shareableKnowledge", e.target.value)} placeholder="Viết thành đoạn ngắn, dễ copy/share cho team khi gặp Opp tương tự..." />
        </Field>
        <Field label="Bài học kinh nghiệm tái sử dụng (mỗi dòng 1 ý)">
          <textarea className={textareaClass} rows={4} value={lessonsText} onChange={(e) => setLessonsText(e.target.value)} placeholder="VD: Luôn kéo IT vào Discovery sớm..." />
        </Field>
        <Field label="Hướng dẫn tái sử dụng">
          <textarea className={textareaClass} rows={4} value={form.reuseGuidance} onChange={(e) => set("reuseGuidance", e.target.value)} placeholder="Case này nên dùng khi gặp Opp nào, cần tránh gì..." />
        </Field>
        <Field label="Tài liệu liên quan của Opp">
          <ReferenceEditor
            value={relatedDocs}
            onChange={setRelatedDocs}
            titlePlaceholder="Proposal bản gửi KH"
            urlPlaceholder="/tai-lieu/... hoặc https://..."
          />
        </Field>
        <Field label="Nguồn tham chiếu uy tín">
          <ReferenceEditor
            value={references}
            onChange={setReferences}
            titlePlaceholder="POC report / dashboard / proposal đã thắng"
            urlPlaceholder="https://..."
          />
        </Field>
        <Field label="Tags">
          <input className={inputClass} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="BFSI, Voice, RFP, POC pass..." />
        </Field>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent">
          Hủy
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Lưu success case
        </button>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ReferenceEditor({
  value,
  onChange,
  titlePlaceholder,
  urlPlaceholder,
}: {
  value: CaseReference[];
  onChange: (next: CaseReference[]) => void;
  titlePlaceholder: string;
  urlPlaceholder: string;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const add = () => {
    const cleanTitle = title.trim();
    const cleanUrl = url.trim();
    if (!cleanTitle || !cleanUrl) {
      toast.error("Vui lòng nhập đủ tên và link.");
      return;
    }
    if (!isValidReferenceUrl(cleanUrl)) {
      toast.error("Link phải là URL hợp lệ hoặc đường dẫn nội bộ bắt đầu bằng /.");
      return;
    }
    onChange([
      ...value,
      {
        id: `ref_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: cleanTitle,
        url: cleanUrl,
      },
    ]);
    setTitle("");
    setUrl("");
  };

  return (
    <div className="rounded-md border bg-background p-2">
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={titlePlaceholder}
          className="rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={urlPlaceholder}
          className="rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Thêm
        </button>
      </div>

      {value.length > 0 && (
        <div className="mt-2 overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-8 px-2 text-xs">Tên</TableHead>
                <TableHead className="h-8 px-2 text-xs">Link</TableHead>
                <TableHead className="h-8 w-10 px-2" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {value.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-2 py-1.5 text-sm font-medium">{item.title}</TableCell>
                  <TableCell className="max-w-[220px] truncate px-2 py-1.5 text-xs text-muted-foreground">
                    {item.url}
                  </TableCell>
                  <TableCell className="px-2 py-1.5 text-right">
                    <button
                      type="button"
                      onClick={() => onChange(value.filter((ref) => ref.id !== item.id))}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Xóa link"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function MultiPick<T extends string>({
  items,
  value,
  onChange,
}: {
  items: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const active = value.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() =>
              onChange(active ? value.filter((v) => v !== item) : [...value, item])
            }
            className={cn(
              "rounded-md border px-2.5 py-1.5 text-xs font-medium",
              active ? "border-primary bg-primary/10 text-primary" : "bg-background text-muted-foreground",
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function isValidReferenceUrl(url: string) {
  if (url.startsWith("/")) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
