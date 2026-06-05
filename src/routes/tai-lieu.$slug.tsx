import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Copy, Download, FileText, Pencil, CalendarDays, User, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TagBadge } from "@/components/TagBadge";
import { MOCK_DOCS } from "@/lib/mock-data";

export const Route = createFileRoute("/tai-lieu/$slug")({
  loader: ({ params }) => {
    const doc = MOCK_DOCS.find((d) => d.slug === params.slug);
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Tài liệu"} — Kho tri thức` },
      { name: "description", content: loaderData?.summary ?? "" },
    ],
  }),
  component: DocDetailPage,
  notFoundComponent: () => (
    <AppLayout>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">Không tìm thấy tài liệu</h2>
        <Link to="/thu-vien" className="mt-4 inline-block text-primary hover:underline">
          ← Về thư viện
        </Link>
      </div>
    </AppLayout>
  ),
  errorComponent: ({ error }) => (
    <AppLayout>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">Lỗi tải tài liệu</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </AppLayout>
  ),
});

function DocDetailPage() {
  return (
    <AppLayout>
      <DocDetail />
    </AppLayout>
  );
}

function DocDetail() {
  const doc = Route.useLoaderData();
  const [copied, setCopied] = useState(false);

  const copyMd = async () => {
    await navigator.clipboard.writeText(doc.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
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

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <article>
          <div className="mb-3 flex flex-wrap gap-1.5">
            <TagBadge kind="type" value={doc.type} />
            <TagBadge kind="status" value={doc.status} />
          </div>

          <h1 className="text-3xl font-bold leading-tight">{doc.title}</h1>
          <p className="mt-2 text-base text-muted-foreground">{doc.summary}</p>

          {doc.status !== "Đã duyệt" && (
            <div className="mt-4 rounded-md border border-status-reviewed bg-status-reviewed/40 px-3 py-2 text-sm text-status-reviewed-foreground">
              ⚠ Tài liệu này chưa được duyệt — chưa phải tài liệu chuẩn chính thức.
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={copyMd}
              className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-status-approved-foreground" /> : <Copy className="h-4 w-4" />}
              {copied ? "Đã sao chép" : "Copy dạng Markdown"}
            </button>
            <Link
              to="/soan/$id"
              params={{ id: doc.id }}
              className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent"
            >
              <Pencil className="h-4 w-4" />
              Chỉnh sửa
            </Link>
          </div>

          <div className="prose-doc mt-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.body}</ReactMarkdown>
          </div>
        </article>

        <aside className="space-y-5">
          <Panel title="Thông tin">
            <Row icon={<User className="h-3.5 w-3.5" />} label="Chủ sở hữu" value={doc.owner} />
            <Row icon={<CalendarDays className="h-3.5 w-3.5" />} label="Cập nhật" value={doc.updatedAt} />
            <Row
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              label="Review gần nhất"
              value={doc.lastReviewedAt ?? "—"}
            />
          </Panel>

          <Panel title="Phân loại">
            <TagGroup label="Khối">
              {doc.verticals.map((v) => <TagBadge key={v} kind="vertical" value={v} />)}
            </TagGroup>
            <TagGroup label="Sản phẩm">
              {doc.products.map((p) => <TagBadge key={p} kind="product" value={p} />)}
            </TagGroup>
            <TagGroup label="Giai đoạn">
              {doc.phases.map((p) => <TagBadge key={p} kind="phase" value={p} />)}
            </TagGroup>
          </Panel>

          {doc.attachments.length > 0 && (
            <Panel title="Tệp đính kèm">
              <ul className="space-y-2">
                {doc.attachments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{a.fileName}</span>
                    </span>
                    <button
                      className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      title="Tải về"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function TagGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}
