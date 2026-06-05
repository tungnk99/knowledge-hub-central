import { Link } from "@tanstack/react-router";
import { CalendarDays, User, Paperclip } from "lucide-react";
import { TagBadge } from "./TagBadge";
import type { DocItem } from "@/lib/mock-data";

export function DocCard({ doc }: { doc: DocItem }) {
  return (
    <Link
      to="/tai-lieu/$slug"
      params={{ slug: doc.slug }}
      className="block rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <TagBadge kind="type" value={doc.type} />
          <TagBadge kind="status" value={doc.status} />
        </div>
        {doc.attachments.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Paperclip className="h-3 w-3" />
            {doc.attachments.length}
          </span>
        )}
      </div>

      <h3 className="mt-3 line-clamp-2 text-base font-semibold text-foreground">
        {doc.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{doc.summary}</p>

      <div className="mt-3 flex flex-wrap gap-1">
        {doc.verticals.map((v) => (
          <TagBadge key={v} kind="vertical" value={v} />
        ))}
        {doc.products.map((p) => (
          <TagBadge key={p} kind="product" value={p} />
        ))}
        {doc.phases.map((ph) => (
          <TagBadge key={ph} kind="phase" value={ph} />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {doc.owner}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          {doc.updatedAt}
        </span>
      </div>
    </Link>
  );
}
