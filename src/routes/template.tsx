import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TagBadge } from "@/components/TagBadge";
import { MOCK_DOCS } from "@/lib/mock-data";

export const Route = createFileRoute("/template")({
  head: () => ({
    meta: [{ title: "Thư viện Template — Kho tri thức Consultant AI" }],
  }),
  component: TemplatePage,
});

function TemplatePage() {
  return (
    <AppLayout>
      <Templates />
    </AppLayout>
  );
}

function Templates() {
  const templates = MOCK_DOCS.filter((d) => d.type === "Template");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:py-8">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Thư viện Template</h1>
        <p className="text-sm text-muted-foreground">
          Các mẫu chuẩn để dùng nhanh. Bấm tệp để tải về.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap gap-1.5">
              <TagBadge kind="type" value={t.type} />
              <TagBadge kind="status" value={t.status} />
            </div>
            <Link
              to="/tai-lieu/$slug"
              params={{ slug: t.slug }}
              className="mt-3 block text-base font-semibold hover:text-primary"
            >
              {t.title}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.summary}</p>

            <div className="mt-3 flex flex-wrap gap-1">
              {t.verticals.map((v) => <TagBadge key={v} kind="vertical" value={v} />)}
              {t.products.map((p) => <TagBadge key={p} kind="product" value={p} />)}
              {t.phases.map((p) => <TagBadge key={p} kind="phase" value={p} />)}
            </div>

            {t.attachments.length > 0 ? (
              <div className="mt-4 space-y-2">
                {t.attachments.map((a) => (
                  <button
                    key={a.id}
                    className="flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{a.fileName}</span>
                    </span>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">Chưa có tệp đính kèm.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
