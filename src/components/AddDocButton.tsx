import { Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";

import { canSubmitDoc } from "@/lib/permissions";
import type { DocType } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import { Route as RootRoute } from "@/routes/__root";

export function AddDocButton({
  label = "Soạn tài liệu mới",
  docType,
  className,
}: {
  label?: string;
  docType?: DocType;
  className?: string;
}) {
  const { role } = RootRoute.useRouteContext();
  if (!canSubmitDoc(role)) return null;

  return (
    <Link
      to="/soan/$id"
      params={{ id: "new" }}
      search={docType ? { type: docType } : {}}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        className,
      )}
    >
      <PlusCircle className="h-4 w-4" />
      {label}
    </Link>
  );
}
