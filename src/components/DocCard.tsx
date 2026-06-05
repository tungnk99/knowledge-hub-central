import { Link } from "@tanstack/react-router";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { useState } from "react";

import { TagBadge } from "@/components/TagBadge";
import type { Attachment, DocItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DocCard({ doc }: { doc: DocItem }) {
  const primaryAttachment = doc.attachments[0] ?? null;

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary/40">
      <Link
        to="/tai-lieu/$slug"
        params={{ slug: doc.slug }}
        className="min-w-0 flex-1 rounded-md outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        title={`Xem chi tiết ${doc.title}`}
      >
        <div className="mb-1.5 flex flex-wrap gap-1">
          <TagBadge kind="fileFormat" value={doc.fileFormat} />
          <TagBadge kind="category" value={doc.category} />
        </div>
        <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
      </Link>
      <OpenDocAction attachment={primaryAttachment} />
    </div>
  );
}

function OpenDocAction({ attachment }: { attachment: Attachment | null }) {
  const [loading, setLoading] = useState(false);

  if (attachment?.kind === "link" && attachment.url) {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noreferrer"
        className={openButtonClass}
        title={`Mở ${attachment.fileName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Mở
      </a>
    );
  }

  if (attachment?.kind === "file" && attachment.storageKey) {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={async (e) => {
          e.stopPropagation();
          setLoading(true);
          try {
            const { downloadStoredFile } = await import("@/lib/queries");
            await downloadStoredFile(attachment.storageKey!, attachment.fileName);
          } finally {
            setLoading(false);
          }
        }}
        className={openButtonClass}
        title={`Tải ${attachment.fileName}`}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <FileText className="h-3.5 w-3.5" />
        )}
        Mở
      </button>
    );
  }

  return null;
}

const openButtonClass = cn(
  "inline-flex shrink-0 items-center gap-1 rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-accent",
);
