import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { TagBadge } from "@/components/TagBadge";
import { MOCK_DOCS } from "@/lib/mock-data";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/duyet")({
  head: () => ({
    meta: [{ title: "Hàng đợi duyệt — Kho tri thức Consultant AI" }],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  return (
    <AppLayout>
      <ReviewQueue />
    </AppLayout>
  );
}

function ReviewQueue() {
  const queue = MOCK_DOCS.filter((d) => d.status !== "Đã duyệt");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-8">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Hàng đợi duyệt</h1>
        <p className="text-sm text-muted-foreground">
          {queue.length} tài liệu đang chờ xử lý.
        </p>
      </div>

      {queue.length === 0 ? (
        <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
          Không có tài liệu nào đang chờ duyệt.
        </div>
      ) : (
        <div className="space-y-3">
          {queue.map((d) => (
            <div key={d.id} className="rounded-lg border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    <TagBadge kind="type" value={d.type} />
                    <TagBadge kind="status" value={d.status} />
                  </div>
                  <Link
                    to="/tai-lieu/$slug"
                    params={{ slug: d.slug }}
                    className="mt-2 block text-base font-semibold hover:text-primary"
                  >
                    {d.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{d.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {d.verticals.map((v) => <TagBadge key={v} kind="vertical" value={v} />)}
                    {d.products.map((p) => <TagBadge key={p} kind="product" value={p} />)}
                    {d.phases.map((p) => <TagBadge key={p} kind="phase" value={p} />)}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {d.owner} • cập nhật {d.updatedAt}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => toast.message("Đã trả lại tài liệu cho người sở hữu.")}
                    className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Trả lại
                  </button>
                  <button
                    onClick={() => toast.success("Đã duyệt tài liệu.")}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Duyệt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
