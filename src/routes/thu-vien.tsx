import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { AddDocButton } from "@/components/AddDocButton";
import { DocCard } from "@/components/DocCard";
import { FilterSidebar, applyFilters, emptyFilter, type FilterState } from "@/components/FilterSidebar";
import { listDocs } from "@/lib/api/docs.functions";
import { useDocs } from "@/lib/queries";
import type { Vertical, Product, Phase } from "@/lib/taxonomy";
import { requireUserRoute } from "@/lib/auth-route-guard";

interface Search {
  q?: string;
  vertical?: Vertical;
  product?: Product;
  phase?: Phase;
}

export const Route = createFileRoute("/thu-vien")({
  beforeLoad: ({ context }) => requireUserRoute(context),
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    vertical: typeof s.vertical === "string" ? (s.vertical as Vertical) : undefined,
    product: typeof s.product === "string" ? (s.product as Product) : undefined,
    phase: typeof s.phase === "string" ? (s.phase as Phase) : undefined,
  }),
  loader: async ({ context }) => {
    const docs = await listDocs();
    await context.queryClient.ensureQueryData({
      queryKey: ["docs"],
      queryFn: () => Promise.resolve(docs),
    });
    return docs;
  },
  head: () => ({
    meta: [
      { title: "Thư viện tài liệu — Kho tri thức Consultant AI" },
      { name: "description", content: "Duyệt và lọc tài liệu theo khối, sản phẩm và giai đoạn." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <AppLayout>
      <Library />
    </AppLayout>
  );
}

function Library() {
  const search = Route.useSearch();
  const { data: docs = [], isLoading } = useDocs();
  const [query, setQuery] = useState(search.q ?? "");
  const [filter, setFilter] = useState<FilterState>(emptyFilter);

  useEffect(() => {
    const next = { ...emptyFilter };
    if (search.vertical) next.verticals = [search.vertical];
    if (search.product) next.products = [search.product];
    if (search.phase) next.phases = [search.phase];
    setFilter(next);
    if (search.q) setQuery(search.q);
  }, [search.q, search.vertical, search.product, search.phase]);

  const results = useMemo(
    () =>
      applyFilters(
        docs.map((d) => ({
          ...d,
          verticals: d.verticals as string[],
          products: d.products as string[],
          phases: d.phases as string[],
        })),
        filter,
        query,
      ),
    [docs, filter, query],
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:py-8">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Thư viện tài liệu</h1>
          <p className="text-sm text-muted-foreground">
            Lọc kết hợp nhiều chiều để tìm đúng tài liệu bạn cần.
          </p>
        </div>
        <AddDocButton />
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <FilterSidebar value={filter} onChange={setFilter} />

        <div>
          <div className="mb-4 flex items-center gap-2 rounded-lg border bg-card p-2">
            <Search className="ml-1 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm trong tiêu đề, tóm tắt và nội dung..."
              className="flex-1 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <span className="pr-2 text-xs text-muted-foreground">
              {results.length} kết quả
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
              Không có tài liệu nào khớp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((d) => {
                const full = docs.find((x) => x.id === d.id)!;
                return <DocCard key={d.id} doc={full} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
