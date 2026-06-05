import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { TagBadge } from "@/components/TagBadge";
import type { CaseReference, CaseSuccess } from "@/lib/case-success.types";
import { cn } from "@/lib/utils";

export function CaseSuccessDetailView({
  item,
  onEdit,
  onDelete,
  deleting,
}: {
  item: CaseSuccess;
  onEdit?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="border-b bg-gradient-to-r from-primary/10 via-card to-status-approved/10 p-4 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5">
              <TagBadge kind="vertical" value={item.vertical} />
              {item.products.map((p) => (
                <TagBadge key={p} kind="product" value={p} />
              ))}
              <TagBadge kind="phase" value={item.phase} />
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {item.visibility}
              </span>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border bg-background px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-3 text-xl font-bold lg:text-2xl">{item.opportunityName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.opportunityCode || "Chưa có mã Opp"} · {item.customerName} · Owner:{" "}
              {item.owner}
            </p>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex shrink-0 gap-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                >
                  Sửa
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  disabled={deleting}
                  onClick={onDelete}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                  title="Xóa case"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 lg:p-6">
        <div className="grid gap-3 text-sm lg:grid-cols-2">
          <InfoBlock title="Bối cảnh Opp" value={item.context} />
          <InfoBlock title="Thách thức chính" value={item.challenge} />
          <InfoBlock title="Cách xử lý / approach" value={item.solution} className="lg:col-span-2" />
          <InfoBlock title="Kết quả / impact" value={item.outcome} highlight className="lg:col-span-2" />
        </div>

        <ShareableKnowledge value={item.shareableKnowledge} />

        {item.reusableLessons.length > 0 && (
          <div className="rounded-lg border bg-background px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Bài học tái sử dụng
            </p>
            <ul className="mt-2 space-y-1.5">
              {item.reusableLessons.map((lesson) => (
                <li key={lesson} className="flex gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        )}

        <InfoBlock title="Hướng dẫn tái sử dụng" value={item.reuseGuidance} />

        {item.metrics.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Metrics / bằng chứng
            </p>
            <div className="flex flex-wrap gap-1.5">
              {item.metrics.map((m) => (
                <span
                  key={m}
                  className="rounded-md border bg-muted/50 px-2 py-1 text-xs font-medium"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {item.relatedDocs.length > 0 && (
          <ReferenceList title="Tài liệu liên quan của Opp" items={item.relatedDocs} />
        )}

        {item.references.length > 0 && (
          <ReferenceList title="Nguồn tham chiếu uy tín" items={item.references} />
        )}
      </div>
    </article>
  );
}

function ShareableKnowledge({ value }: { value: string }) {
  if (!value.trim()) return null;
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Đã copy tri thức có thể share.");
  };
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Tri thức có thể share lại
        </p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs text-primary hover:bg-accent"
        >
          <Copy className="h-3 w-3" />
          Copy
        </button>
      </div>
      <p className="mt-1 whitespace-pre-line text-sm">{value}</p>
    </div>
  );
}

function ReferenceList({ title, items }: { title: string; items: CaseReference[] }) {
  return (
    <div className="border-t pt-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((ref) => (
          <a
            key={ref.id}
            href={ref.url}
            target={ref.url.startsWith("/") ? undefined : "_blank"}
            rel={ref.url.startsWith("/") ? undefined : "noreferrer"}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-primary hover:bg-accent"
          >
            <ExternalLink className="h-3 w-3" />
            {ref.title}
          </a>
        ))}
      </div>
    </div>
  );
}

function InfoBlock({
  title,
  value,
  highlight,
  className,
}: {
  title: string;
  value: string;
  highlight?: boolean;
  className?: string;
}) {
  if (!value.trim()) return null;
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2",
        highlight ? "bg-status-approved/10" : "bg-background",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-1 whitespace-pre-line text-sm">{value}</p>
    </div>
  );
}
