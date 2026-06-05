import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CaseSuccessDetailView } from "@/components/CaseSuccessDetail";
import { getCaseSuccessById } from "@/lib/api/case-success.functions";
import { useDeleteCaseSuccess } from "@/lib/queries";
import { canManageCaseSuccess } from "@/lib/permissions";
import { Route as RootRoute } from "@/routes/__root";

export const Route = createFileRoute("/case-success/$id")({
  loader: async ({ params }) => {
    const item = await getCaseSuccessById({ data: { id: params.id } });
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.opportunityName ?? "Success Case"} — Kho tri thức Consultant AI`,
      },
      {
        name: "description",
        content: loaderData?.outcome ?? loaderData?.shareableKnowledge ?? "",
      },
    ],
  }),
  component: CaseSuccessDetailPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h2 className="text-xl font-semibold">Không tìm thấy success case</h2>
      <Link to="/case-success" className="mt-4 inline-block text-primary hover:underline">
        ← Về danh sách success case
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => {
    if (error.message.includes("Không tìm thấy")) {
      throw notFound();
    }
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">Lỗi tải success case</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Link to="/case-success" className="mt-4 inline-block text-primary hover:underline">
          ← Về danh sách success case
        </Link>
      </div>
    );
  },
});

function CaseSuccessDetailPage() {
  const item = Route.useLoaderData();
  const { role } = RootRoute.useRouteContext();
  const canManage = canManageCaseSuccess(role);
  const navigate = useNavigate();
  const deleteMut = useDeleteCaseSuccess();

  const handleEdit = () => {
    navigate({ to: "/case-success", search: { edit: item.id } });
  };

  const handleDelete = async () => {
    if (!confirm("Xóa success case này?")) return;
    try {
      await deleteMut.mutateAsync(item.id);
      toast.success("Đã xóa success case.");
      navigate({ to: "/case-success" });
    } catch {
      toast.error("Không thể xóa success case.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-8">
      <Link
        to="/case-success"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Về danh sách success case
      </Link>

      <CaseSuccessDetailView
        item={item}
        onEdit={canManage ? handleEdit : undefined}
        onDelete={canManage ? handleDelete : undefined}
        deleting={deleteMut.isPending}
      />
    </div>
  );
}
