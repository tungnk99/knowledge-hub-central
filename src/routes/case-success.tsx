import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppLayout } from "@/components/AppLayout";
import { listCaseSuccess } from "@/lib/api/case-success.functions";
import { requireUserRoute } from "@/lib/auth-route-guard";

export const Route = createFileRoute("/case-success")({
  beforeLoad: ({ context }) => requireUserRoute(context),
  loader: async ({ context }) => {
    const cases = await listCaseSuccess();
    await context.queryClient.ensureQueryData({
      queryKey: ["case-success"],
      queryFn: () => Promise.resolve(cases),
    });
    return cases;
  },
  component: CaseSuccessLayout,
});

function CaseSuccessLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
