import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { ConsultingRoadmap } from "@/components/ConsultingRoadmap";
import { listDocs } from "@/lib/api/docs.functions";
import { getRoadmapOverrides } from "@/lib/api/roadmap.functions";
import { CONSULTING_ROADMAP } from "@/lib/consulting-roadmap";
import { useDocs, useRoadmapOverrides } from "@/lib/queries";
import { requireUserRoute } from "@/lib/auth-route-guard";

interface Search {
  buoc?: string;
  chiTiet?: string;
}

export const Route = createFileRoute("/quy-trinh")({
  beforeLoad: ({ context }) => requireUserRoute(context),
  validateSearch: (s: Record<string, unknown>): Search => ({
    buoc: typeof s.buoc === "string" ? s.buoc : undefined,
    chiTiet: typeof s.chiTiet === "string" ? s.chiTiet : undefined,
  }),
  loader: async ({ context }) => {
    const [docs, overrides] = await Promise.all([listDocs(), getRoadmapOverrides()]);
    await context.queryClient.ensureQueryData({
      queryKey: ["docs"],
      queryFn: () => Promise.resolve(docs),
    });
    await context.queryClient.ensureQueryData({
      queryKey: ["roadmap-overrides"],
      queryFn: () => Promise.resolve(overrides),
    });
    return { docs, overrides };
  },
  head: () => ({
    meta: [
      { title: "AI Agent Consulting Playbook — Kho tri thức Consultant AI" },
      {
        name: "description",
        content:
          "Roadmap tương tác theo playbook trang chủ: Intake, Discovery, POC, Pilot, RFP/RFI & Bid, Contract & Handoff.",
      },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  return (
    <AppLayout>
      <RoadmapContent />
    </AppLayout>
  );
}

function RoadmapContent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: docs = [], isLoading: docsLoading } = useDocs();
  const { data: overrides, isLoading: overridesLoading } = useRoadmapOverrides();

  const validStep =
    search.buoc && CONSULTING_ROADMAP.some((s) => s.slug === search.buoc)
      ? search.buoc
      : CONSULTING_ROADMAP[0]!.slug;

  const handleStepChange = (stepSlug: string, subId?: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        buoc: stepSlug,
        chiTiet: subId,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  if (docsLoading || overridesLoading || !overrides) {
    return (
      <div className="flex justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 lg:py-8">
      <ConsultingRoadmap
        docs={docs}
        overrides={overrides}
        initialStep={validStep}
        initialSub={search.chiTiet}
        onStepChange={handleStepChange}
      />
    </div>
  );
}
