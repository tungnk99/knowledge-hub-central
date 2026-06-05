import { Link2, Upload, X, FileText, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";

import type { Attachment } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface PendingLink {
  id: string;
  fileName: string;
  url: string;
}

interface Props {
  attachments: Attachment[];
  pendingFiles: File[];
  pendingLinks: PendingLink[];
  onAttachmentsChange: (next: Attachment[]) => void;
  onPendingFilesChange: (next: File[]) => void;
  onPendingLinksChange: (next: PendingLink[]) => void;
}

export function ResourceAttachments({
  attachments,
  pendingFiles,
  pendingLinks,
  onAttachmentsChange,
  onPendingFilesChange,
  onPendingLinksChange,
}: Props) {
  const [mode, setMode] = useState<"file" | "link">("file");
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");

  const addLink = () => {
    const result = parseSingleLink(linkUrl, linkName);
    if ("error" in result) {
      setLinkError(result.error);
      return;
    }
    onPendingLinksChange([
      ...pendingLinks,
      { ...result.link, id: `plink_${Date.now()}` },
    ]);
    setLinkName("");
    setLinkUrl("");
    setLinkError("");
  };

  const savedListCount =
    attachments.length + pendingFiles.length + (mode !== "link" ? pendingLinks.length : 0);

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-md border bg-muted/40 p-1">
        <ModeButton active={mode === "file"} onClick={() => setMode("file")}>
          <Upload className="h-3.5 w-3.5" />
          Upload tệp
        </ModeButton>
        <ModeButton active={mode === "link"} onClick={() => setMode("link")}>
          <Link2 className="h-3.5 w-3.5" />
          Gắn link
        </ModeButton>
      </div>

      {mode === "file" ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-card px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-accent">
          <Upload className="mb-1 h-5 w-5" />
          Kéo-thả hoặc bấm để chọn một/nhiều tệp (xlsx, pptx, docx, pdf, zip...)
          <span className="mt-1 text-xs">Tối đa khuyến nghị 10MB/tệp</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? []);
              onPendingFilesChange([...pendingFiles, ...picked]);
              e.target.value = "";
            }}
          />
        </label>
      ) : (
        <div className="space-y-2 rounded-md border bg-card p-3">
          <input
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            placeholder="Tên hiển thị (tuỳ chọn)"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value);
                if (linkError) setLinkError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              placeholder="https://drive.google.com/..."
              className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={addLink}
              disabled={!linkUrl.trim()}
              className="shrink-0 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Thêm
            </button>
          </div>
          {linkError && <p className="text-xs font-medium text-destructive">{linkError}</p>}
          <p className="text-xs text-muted-foreground">
            Nhập URL rồi bấm Thêm — có thể thêm nhiều link Google Drive, SharePoint, Notion lần lượt.
          </p>
          {pendingLinks.length > 0 && (
            <ul className="space-y-1.5 border-t pt-2">
              {pendingLinks.map((l) => (
                <ResourceRow
                  key={l.id}
                  icon={ExternalLink}
                  label={l.fileName}
                  sub={l.url}
                  badge="Link mới"
                  onRemove={() => onPendingLinksChange(pendingLinks.filter((x) => x.id !== l.id))}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {savedListCount > 0 && (
        <ul className="space-y-1.5">
          {attachments.map((a) => (
            <ResourceRow
              key={a.id}
              icon={a.kind === "link" ? ExternalLink : FileText}
              label={a.fileName}
              sub={
                a.kind === "link"
                  ? a.url
                  : a.sizeKb
                    ? `${a.fileType.toUpperCase()} · ${a.sizeKb} KB`
                    : a.fileType.toUpperCase()
              }
              badge={a.kind === "link" ? "Link" : "Tệp"}
              onRemove={() => onAttachmentsChange(attachments.filter((x) => x.id !== a.id))}
            />
          ))}
          {pendingFiles.map((f, i) => (
            <ResourceRow
              key={`pf-${i}-${f.name}`}
              icon={FileText}
              label={f.name}
              sub={`${Math.round(f.size / 1024)} KB · chờ lưu`}
              badge="Mới"
              onRemove={() => onPendingFilesChange(pendingFiles.filter((_, idx) => idx !== i))}
            />
          ))}
          {mode !== "link" &&
            pendingLinks.map((l) => (
              <ResourceRow
                key={l.id}
                icon={ExternalLink}
                label={l.fileName}
                sub={l.url}
                badge="Link mới"
                onRemove={() => onPendingLinksChange(pendingLinks.filter((x) => x.id !== l.id))}
              />
            ))}
        </ul>
      )}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function parseSingleLink(
  rawUrlInput: string,
  fallbackName: string,
): { link: Omit<PendingLink, "id"> } | { error: string } {
  let rawUrl = rawUrlInput.trim();
  let rawName = fallbackName.trim();

  if (!rawUrl) {
    return { error: "Vui lòng nhập URL" };
  }

  if (!rawName && rawUrl.includes("|")) {
    const [maybeName, ...rest] = rawUrl.split("|");
    rawName = maybeName.trim();
    rawUrl = rest.join("|").trim();
  }

  try {
    const url = new URL(rawUrl).toString();
    const fileName = rawName || url;
    return { link: { fileName, url } };
  } catch {
    return { error: "Link không hợp lệ. Vui lòng nhập URL đầy đủ (https://...)" };
  }
}

function ResourceRow({
  icon: Icon,
  label,
  sub,
  badge,
  onRemove,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub?: string;
  badge: string;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-md border px-2.5 py-2 text-sm">
      <span className="flex min-w-0 items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="truncate font-medium">{label}</span>
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {badge}
            </span>
          </span>
          {sub && <span className="block truncate text-xs text-muted-foreground">{sub}</span>}
        </span>
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-muted-foreground hover:text-destructive"
        title="Xoá"
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  );
}

export function AttachmentList({
  attachments,
  compact = false,
}: {
  attachments: Attachment[];
  compact?: boolean;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (attachments.length === 0) {
    return compact ? null : (
      <p className="text-xs text-muted-foreground">Chưa có tài nguyên đính kèm.</p>
    );
  }

  const handleAction = async (att: Attachment) => {
    if (att.kind === "link" && att.url) {
      window.open(att.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (att.kind === "file" && att.storageKey) {
      setLoadingId(att.id);
      try {
        const { downloadStoredFile } = await import("@/lib/queries");
        await downloadStoredFile(att.storageKey, att.fileName);
      } finally {
        setLoadingId(null);
      }
    }
  };

  return (
    <ul className={cn("space-y-2", compact && "space-y-1.5")}>
      {attachments.map((a) => {
        const isLink = a.kind === "link";
        const canAction = isLink ? !!a.url : !!a.storageKey;
        return (
          <li key={a.id}>
            <button
              type="button"
              disabled={!canAction || loadingId === a.id}
              onClick={() => handleAction(a)}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md border text-sm transition-colors",
                compact ? "px-3 py-2" : "p-2",
                canAction ? "hover:bg-accent" : "cursor-not-allowed opacity-60",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                {loadingId === a.id ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                ) : isLink ? (
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="min-w-0 text-left">
                  <span className="block truncate">{a.fileName}</span>
                  {!compact && (
                    <span className="text-xs text-muted-foreground">
                      {isLink ? "Mở link" : a.sizeKb ? `${a.sizeKb} KB` : "Tải về"}
                    </span>
                  )}
                </span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {isLink ? "Mở" : "Tải"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
