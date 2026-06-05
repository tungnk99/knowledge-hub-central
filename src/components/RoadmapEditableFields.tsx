import { Loader2, Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function AdminEditBar({
  editing,
  saving,
  onToggle,
  onSave,
  onCancel,
}: {
  editing: boolean;
  saving: boolean;
  onToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
      <p className="text-xs font-medium text-primary">
        Chế độ quản trị — chỉnh sửa nội dung quy trình để chia sẻ với team
      </p>
      <div className="flex gap-2">
        {!editing ? (
          <Button type="button" size="sm" variant="outline" onClick={onToggle}>
            Chỉnh sửa
          </Button>
        ) : (
          <>
            <Button type="button" size="sm" variant="ghost" onClick={onCancel} disabled={saving}>
              <X className="h-3.5 w-3.5" />
              Hủy
            </Button>
            <Button type="button" size="sm" onClick={onSave} disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Lưu thay đổi
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function EditableText({
  editing,
  value,
  onChange,
  className,
}: {
  editing: boolean;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  if (!editing) {
    return <p className={cn("text-sm font-medium", className)}>{value}</p>;
  }
  return <Input value={value} onChange={(e) => onChange(e.target.value)} className={className} />;
}

export function EditableParagraph({
  editing,
  value,
  onChange,
}: {
  editing: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  if (!editing) {
    return (
      <p className="rounded-lg border bg-muted/30 px-3 py-2.5 text-sm leading-relaxed">{value}</p>
    );
  }
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="text-sm"
    />
  );
}

export function EditableList({
  editing,
  items,
  onChange,
  ordered = false,
}: {
  editing: boolean;
  items: string[];
  onChange: (items: string[]) => void;
  ordered?: boolean;
}) {
  if (!editing) {
    const ListTag = ordered ? "ol" : "ul";
    return (
      <ListTag className="space-y-1.5">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2.5 text-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {ordered ? index + 1 : "•"}
            </span>
            <span className="pt-0.5">{item}</span>
          </li>
        ))}
      </ListTag>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[index] = e.target.value;
              onChange(next);
            }}
            className="text-sm"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => onChange([...items, ""])}
      >
        <Plus className="h-3.5 w-3.5" />
        Thêm dòng
      </Button>
    </div>
  );
}

export function useEditableDraft<T>(source: T, active: boolean) {
  const [draft, setDraft] = useState(source);
  useEffect(() => {
    if (!active) setDraft(source);
  }, [source, active]);
  return [draft, setDraft] as const;
}

export function cleanList(items: string[]) {
  return items.map((s) => s.trim()).filter(Boolean);
}

export function itemsToMarkdown(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function resolveApprovalReviewMarkdown(
  override: string | undefined,
  autoItems: string[],
): string {
  if (override !== undefined) return override;
  return itemsToMarkdown(autoItems);
}

function ApprovalReviewMarkdown({ markdown }: { markdown: string }) {
  if (!markdown.trim()) {
    return <p className="text-sm opacity-70">Chưa có nội dung.</p>;
  }
  return (
    <div className="prose-review text-amber-950 dark:text-amber-50">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}

function ReviewMdTab({
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
        "px-3 py-1.5 text-xs font-medium",
        active
          ? "border-b-2 border-amber-600 text-amber-950 dark:border-amber-400 dark:text-amber-50"
          : "text-amber-800/70 dark:text-amber-200/70",
      )}
    >
      {children}
    </button>
  );
}

export function ApprovalReviewEditor({
  markdown,
  editing,
  onChange,
}: {
  markdown: string;
  editing: boolean;
  onChange?: (value: string) => void;
}) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    if (!editing) setTab("write");
  }, [editing]);

  if (!markdown.trim() && !editing) return null;

  return (
    <div className="rounded-lg border-2 border-amber-400 bg-amber-50 p-3 text-amber-950 shadow-sm dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-100">
      <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
        <ShieldCheck className="h-3.5 w-3.5" />
        Cảnh báo trước: cần review / phê duyệt
      </h4>
      <p className="mb-2 text-xs font-medium">
        Xử lý các điểm này trước khi gửi KH, demo, nộp thầu, ký hoặc chuyển sang bước tiếp theo.
      </p>
      {editing && onChange ? (
        <>
          <div className="overflow-hidden rounded-md border border-amber-200 bg-white dark:border-amber-700 dark:bg-amber-950/50">
            <div className="flex border-b border-amber-200 dark:border-amber-700">
              <ReviewMdTab active={tab === "write"} onClick={() => setTab("write")}>
                Soạn
              </ReviewMdTab>
              <ReviewMdTab active={tab === "preview"} onClick={() => setTab("preview")}>
                Xem trước
              </ReviewMdTab>
            </div>
            {tab === "write" ? (
              <Textarea
                value={markdown}
                onChange={(e) => onChange(e.target.value)}
                rows={8}
                placeholder="- Người chốt giai đoạn: Manager&#10;- PIC cần xác nhận exit criteria trước khi chuyển bước"
                className="min-h-[160px] resize-y rounded-none border-0 bg-transparent font-mono text-sm text-foreground shadow-none focus-visible:ring-0"
              />
            ) : (
              <div className="min-h-[160px] px-3 py-2.5">
                <ApprovalReviewMarkdown markdown={markdown} />
              </div>
            )}
          </div>
          <p className="mt-1.5 text-[11px] opacity-80">
            Markdown: <code>- gạch đầu dòng</code>, <code>**in đậm**</code>, <code>[tên](url)</code>
          </p>
        </>
      ) : (
        <ApprovalReviewMarkdown markdown={markdown} />
      )}
    </div>
  );
}
