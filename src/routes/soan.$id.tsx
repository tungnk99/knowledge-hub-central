import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Save, SendHorizonal, Trash2, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { ResourceAttachments, type PendingLink } from "@/components/ResourceAttachments";
import {
  VERTICALS, PRODUCTS, PHASES, DOC_TYPES, DOC_CATEGORIES, FILE_FORMATS,
  verticalClass, productClass, phaseClass, categoryClass, fileFormatClass,
  type Vertical, type Product, type Phase, type DocType, type DocCategory, type FileFormat,
} from "@/lib/taxonomy";
import { inferFileFormatFromAttachment } from "@/lib/doc-meta";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getDocById } from "@/lib/api/docs.functions";
import {
  useCreateDoc,
  useUpdateDoc,
  useDeleteDoc,
  uploadFiles,
} from "@/lib/queries";
import type { Attachment, DocItem } from "@/lib/types";
import { requireUserRoute } from "@/lib/auth-route-guard";
import { canDeleteDoc } from "@/lib/permissions";
import { Route as RootRoute } from "@/routes/__root";

export const Route = createFileRoute("/soan/$id")({
  beforeLoad: ({ context }) => requireUserRoute(context),
  validateSearch: (s: Record<string, unknown>) => ({
    type:
      typeof s.type === "string" && DOC_TYPES.includes(s.type as DocType)
        ? (s.type as DocType)
        : undefined,
  }),
  loader: async ({ params, context }) => {
    if (params.id === "new") return null;
    const doc = await getDocById({ data: { id: params.id } });
    if (doc) {
      await context.queryClient.ensureQueryData({
        queryKey: ["docs", "id", params.id],
        queryFn: () => Promise.resolve(doc),
      });
    }
    return doc;
  },
  head: () => ({
    meta: [{ title: "Soạn tài liệu — Kho tri thức Consultant AI" }],
  }),
  component: EditorPage,
});

function EditorPage() {
  return (
    <AppLayout>
      <Editor />
    </AppLayout>
  );
}

function Editor() {
  const existing = Route.useLoaderData() as DocItem | null;
  const { type: presetType } = Route.useSearch();
  const { role, user } = RootRoute.useRouteContext();
  const navigate = useNavigate();
  const createMut = useCreateDoc();
  const updateMut = useUpdateDoc();
  const deleteMut = useDeleteDoc();

  const [title, setTitle] = useState(existing?.title ?? "");
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [owner, setOwner] = useState(existing?.owner ?? user?.name ?? "");
  const [type, setType] = useState<DocType>(existing?.type ?? presetType ?? "Chuẩn");
  const [category, setCategory] = useState<DocCategory>(existing?.category ?? "Khác");
  const [fileFormat, setFileFormat] = useState<FileFormat>(existing?.fileFormat ?? "Khác");
  const [verticals, setVerticals] = useState<Vertical[]>(existing?.verticals ?? []);
  const [products, setProducts] = useState<Product[]>(existing?.products ?? []);
  const [phases, setPhases] = useState<Phase[]>(existing?.phases ?? []);
  const [body, setBody] = useState(existing?.body ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [attachments, setAttachments] = useState<Attachment[]>(existing?.attachments ?? []);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingLinks, setPendingLinks] = useState<PendingLink[]>([]);
  const [saving, setSaving] = useState(false);

  const isBusy = saving || createMut.isPending || updateMut.isPending || deleteMut.isPending;

  const buildInput = (status: "Nháp" | "Đã review") => ({
    title: title.trim(),
    summary: summary.trim(),
    body,
    type,
    category,
    fileFormat,
    status,
    verticals,
    products,
    phases,
    owner: owner.trim(),
    attachments: [] as Attachment[],
  });

  const validate = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề.");
      return false;
    }
    if (!owner.trim()) {
      toast.error("Vui lòng nhập chủ sở hữu.");
      return false;
    }
    return true;
  };

  const save = async (status: "Nháp" | "Đã review") => {
    if (!validate()) return;
    setSaving(true);
    try {
      const uploaded = pendingFiles.length > 0 ? await uploadFiles(pendingFiles) : [];
      const linkAttachments: Attachment[] = pendingLinks.map((l) => ({
        id: l.id.replace("plink_", "att_"),
        kind: "link" as const,
        fileName: l.fileName,
        fileType: "link",
        url: l.url,
      }));
      const allAttachments = [...attachments, ...uploaded, ...linkAttachments];
      const inferredFileFormat =
        fileFormat !== "Khác"
          ? fileFormat
          : inferFileFormatFromAttachment(allAttachments[0]) ?? fileFormat;
      const input = {
        ...buildInput(status),
        fileFormat: inferredFileFormat,
        attachments: allAttachments,
      };

      if (existing) {
        const doc = await updateMut.mutateAsync({ id: existing.id, input });
        toast.success(status === "Nháp" ? "Đã lưu nháp." : "Đã gửi duyệt.");
        navigate({ to: "/tai-lieu/$slug", params: { slug: doc.slug } });
      } else {
        const doc = await createMut.mutateAsync(input);
        toast.success(status === "Nháp" ? "Đã tạo nháp." : "Đã gửi duyệt.");
        navigate({ to: "/tai-lieu/$slug", params: { slug: doc.slug } });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể lưu tài liệu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existing) return;
    if (!confirm("Xoá vĩnh viễn tài liệu này?")) return;
    try {
      await deleteMut.mutateAsync(existing.id);
      toast.success("Đã xoá tài liệu.");
      navigate({ to: "/thu-vien" });
    } catch {
      toast.error("Không thể xoá tài liệu.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:py-8">
      <Link
        to="/thu-vien"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Về thư viện
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">
          {existing ? "Chỉnh sửa tài liệu" : "Soạn tài liệu mới"}
        </h1>
        <div className="flex flex-wrap gap-2">
          {existing && canDeleteDoc(role) && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Xoá
            </button>
          )}
          <button
            type="button"
            onClick={() => save("Nháp")}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu nháp
          </button>
          <button
            type="button"
            onClick={() => save("Đã review")}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
            Gửi duyệt
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Field label="Tiêu đề *">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Chuẩn tư vấn Voice cho BFSI"
              className="w-full rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Tóm tắt ngắn">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="Một vài câu mô tả tài liệu này dùng khi nào."
              className="w-full resize-none rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Chủ sở hữu *">
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Họ tên người phụ trách"
              className="w-full rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Nội dung (Markdown)">
            <div className="overflow-hidden rounded-md border bg-card">
              <div className="flex border-b">
                <TabButton active={tab === "write"} onClick={() => setTab("write")}>Soạn</TabButton>
                <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>Xem trước</TabButton>
              </div>
              {tab === "write" ? (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={18}
                  placeholder="# Bắt đầu viết..."
                  className="w-full resize-none bg-transparent px-3 py-3 font-mono text-sm outline-none"
                />
              ) : (
                <div className="prose-doc max-h-[480px] min-h-[320px] overflow-auto px-4 py-3">
                  {body ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
                  ) : (
                    <p className="text-sm text-muted-foreground">Chưa có nội dung để xem trước.</p>
                  )}
                </div>
              )}
            </div>
          </Field>

          <Field label="Tài nguyên đính kèm">
            <ResourceAttachments
              attachments={attachments}
              pendingFiles={pendingFiles}
              pendingLinks={pendingLinks}
              onAttachmentsChange={setAttachments}
              onPendingFilesChange={setPendingFiles}
              onPendingLinksChange={setPendingLinks}
            />
          </Field>
        </div>

        <aside className="space-y-4">
          <Field label="Loại tài liệu">
            <div className="flex flex-wrap gap-1.5">
              {DOC_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                    type === t ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Định dạng file">
            <div className="flex flex-wrap gap-1.5">
              {FILE_FORMATS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFileFormat(f)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                    fileFormat === f ? fileFormatClass[f] : "border bg-card text-muted-foreground hover:bg-accent",
                    fileFormat === f && "ring-2 ring-primary/40",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Loại nội dung">
            <div className="flex flex-wrap gap-1.5">
              {DOC_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                    category === c ? categoryClass[c] : "border bg-card text-muted-foreground hover:bg-accent",
                    category === c && "ring-2 ring-primary/40",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>

          <MultiPicker label="Khối khách hàng" options={VERTICALS} value={verticals} onChange={setVerticals} cls={verticalClass} />
          <MultiPicker label="Sản phẩm" options={PRODUCTS} value={products} onChange={setProducts} cls={productClass} />
          <MultiPicker label="Giai đoạn" options={PHASES} value={phases} onChange={setPhases} cls={phaseClass} />
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function TabButton({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium",
        active ? "border-b-2 border-primary text-foreground" : "text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

function MultiPicker<T extends string>({
  label, options, value, onChange, cls,
}: {
  label: string;
  options: readonly T[];
  value: T[];
  onChange: (v: T[]) => void;
  cls: Record<T, string>;
}) {
  const toggle = (v: T) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => toggle(o)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                on ? cls[o] : "border bg-card text-muted-foreground hover:bg-accent",
                on && "ring-2 ring-primary/40",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </Field>
  );
}
