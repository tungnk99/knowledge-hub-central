import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Save, SendHorizonal, Upload, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { MOCK_DOCS } from "@/lib/mock-data";
import {
  VERTICALS, PRODUCTS, PHASES, DOC_TYPES,
  verticalClass, productClass, phaseClass,
  type Vertical, type Product, type Phase, type DocType,
} from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/soan/$id")({
  loader: ({ params }) => {
    if (params.id === "new") return null;
    return MOCK_DOCS.find((d) => d.id === params.id) ?? null;
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
  const existing = Route.useLoaderData();
  const [title, setTitle] = useState(existing?.title ?? "");
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [type, setType] = useState<DocType>(existing?.type ?? "Chuẩn");
  const [verticals, setVerticals] = useState<Vertical[]>(existing?.verticals ?? []);
  const [products, setProducts] = useState<Product[]>(existing?.products ?? []);
  const [phases, setPhases] = useState<Phase[]>(existing?.phases ?? []);
  const [body, setBody] = useState(existing?.body ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [files, setFiles] = useState<File[]>([]);

  const save = (status: "Nháp" | "Đã review") => {
    toast.success(status === "Nháp" ? "Đã lưu nháp." : "Đã gửi duyệt.");
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
        <div className="flex gap-2">
          <button
            onClick={() => save("Nháp")}
            className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <Save className="h-4 w-4" />
            Lưu nháp
          </button>
          <button
            onClick={() => save("Đã review")}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <SendHorizonal className="h-4 w-4" />
            Gửi duyệt
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Field label="Tiêu đề">
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

          <Field label="Tệp đính kèm">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-card px-4 py-6 text-sm text-muted-foreground hover:bg-accent">
              <Upload className="mb-1 h-5 w-5" />
              Kéo-thả hoặc bấm để chọn tệp (xlsx, pptx, docx, pdf)
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles([...files, ...Array.from(e.target.files ?? [])])}
              />
            </label>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between rounded-md border px-2 py-1.5 text-sm">
                    <span className="truncate">{f.name}</span>
                    <button
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Field>
        </div>

        <aside className="space-y-4">
          <Field label="Loại tài liệu">
            <div className="flex flex-wrap gap-1.5">
              {DOC_TYPES.map((t) => (
                <button
                  key={t}
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

          <MultiPicker
            label="Khối khách hàng"
            options={VERTICALS}
            value={verticals}
            onChange={setVerticals}
            cls={verticalClass}
          />
          <MultiPicker
            label="Sản phẩm"
            options={PRODUCTS}
            value={products}
            onChange={setProducts}
            cls={productClass}
          />
          <MultiPicker
            label="Giai đoạn"
            options={PHASES}
            value={phases}
            onChange={setPhases}
            cls={phaseClass}
          />
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
