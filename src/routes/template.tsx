import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { AddDocButton } from "@/components/AddDocButton";
import { TagBadge } from "@/components/TagBadge";
import { AttachmentList } from "@/components/ResourceAttachments";
import { listDocs } from "@/lib/api/docs.functions";
import { useDocs } from "@/lib/queries";
import { requireUserRoute } from "@/lib/auth-route-guard";

export const Route = createFileRoute("/template")({
  beforeLoad: ({ context }) => requireUserRoute(context),
  loader: async ({ context }) => {
    const docs = await listDocs();
    await context.queryClient.ensureQueryData({
      queryKey: ["docs"],
      queryFn: () => Promise.resolve(docs),
    });
    return docs;
  },
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
  const { data: docs = [], isLoading } = useDocs();
  const templates = docs.filter((d) => d.type === "Template");

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:py-8">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Thư viện Template</h1>
          <p className="text-sm text-muted-foreground">
            Các mẫu chuẩn để dùng nhanh. Tải tệp hoặc mở link tài nguyên đính kèm.
          </p>
        </div>
        <AddDocButton label="Thêm template mới" docType="Template" />
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

            <div className="mt-4">
              <AttachmentList attachments={t.attachments} compact />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
