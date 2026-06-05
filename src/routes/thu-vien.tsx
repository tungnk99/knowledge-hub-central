import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { DocCard } from "@/components/DocCard";
import { FilterSidebar, applyFilters, emptyFilter, type FilterState } from "@/components/FilterSidebar";
import { MOCK_DOCS } from "@/lib/mock-data";
import type { Vertical, Product, Phase } from "@/lib/taxonomy";

interface Search {
  q?: string;
  vertical?: Vertical;
  product?: Product;
  phase?: Phase;
}

export const Route = createFileRoute("/thu-vien")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    vertical: typeof s.vertical === "string" ? (s.vertical as Vertical) : undefined,
    product: typeof s.product === "string" ? (s.product as Product) : undefined,
    phase: typeof s.phase === "string" ? (s.phase as Phase) : undefined,
  }),
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
        MOCK_DOCS.map((d) => ({
          ...d,
          verticals: d.verticals as string[],
          products: d.products as string[],
          phases: d.phases as string[],
        })),
        filter,
        query,
      ),
    [filter, query],
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:py-8">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Thư viện tài liệu</h1>
        <p className="text-sm text-muted-foreground">
          Lọc kết hợp nhiều chiều để tìm đúng tài liệu bạn cần.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <FilterSidebar value={filter} onChange={setFilter} />

        <div>
          <div className="mb-4 flex items-center gap-2 rounded-lg border bg-card p-2">
            <Search className="ml-1 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm trong tiêu đề và tóm tắt..."
              className="flex-1 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <span className="pr-2 text-xs text-muted-foreground">
              {results.length} kết quả
            </span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
              Không có tài liệu nào khớp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((d) => (
                <DocCard key={d.id} doc={MOCK_DOCS.find((x) => x.id === d.id)!} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
