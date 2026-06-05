import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DocCard } from "@/components/DocCard";
import { MOCK_DOCS } from "@/lib/mock-data";
import { VERTICALS, PRODUCTS, PHASES, verticalClass, productClass, phaseClass } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trang chủ — Kho tri thức Consultant AI" },
      { name: "description", content: "Tìm kiếm nhanh tài liệu chuẩn, template và kinh nghiệm tư vấn AI." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const recent = useMemo(
    () => [...MOCK_DOCS].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6),
    [],
  );
  const approved = useMemo(
    () => MOCK_DOCS.filter((d) => d.status === "Đã duyệt").slice(0, 6),
    [],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/thu-vien", search: { q } as never });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:py-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Kho tri thức Consultant AI
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Một nơi duy nhất để tra cứu tài liệu chuẩn, template và kinh nghiệm
          khi tư vấn giải pháp AI cho khách hàng.
        </p>

        <form onSubmit={submit} className="mx-auto mt-7 flex max-w-2xl items-center gap-2 rounded-xl border bg-card p-2 shadow-sm">
          <Search className="ml-2 h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tiêu đề, tóm tắt..."
            className="flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tìm
          </button>
        </form>
      </div>

      <QuickFilters />

      <Section title="Tài liệu mới cập nhật" linkLabel="Xem tất cả" to="/thu-vien">
        <Grid docs={recent} />
      </Section>

      <Section title="Tài liệu chuẩn đã duyệt" linkLabel="Xem thư viện" to="/thu-vien">
        <Grid docs={approved} />
      </Section>
    </div>
  );
}

function Grid({ docs }: { docs: typeof MOCK_DOCS }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((d) => (
        <DocCard key={d.id} doc={d} />
      ))}
    </div>
  );
}

function Section({
  title,
  linkLabel,
  to,
  children,
}: {
  title: string;
  linkLabel: string;
  to: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link
          to={to}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {children}
    </section>
  );
}

function QuickFilters() {
  const navigate = useNavigate();
  const go = (key: "vertical" | "product" | "phase", value: string) => {
    navigate({ to: "/thu-vien", search: { [key]: value } as never });
  };

  return (
    <div className="mx-auto mt-8 max-w-4xl space-y-3">
      <QuickRow label="Khối" items={VERTICALS} cls={verticalClass} onPick={(v) => go("vertical", v)} />
      <QuickRow label="Sản phẩm" items={PRODUCTS} cls={productClass} onPick={(v) => go("product", v)} />
      <QuickRow label="Giai đoạn" items={PHASES} cls={phaseClass} onPick={(v) => go("phase", v)} />
    </div>
  );
}

function QuickRow<T extends string>({
  label,
  items,
  cls,
  onPick,
}: {
  label: string;
  items: readonly T[];
  cls: Record<T, string>;
  onPick: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {items.map((it) => (
        <button
          key={it}
          onClick={() => onPick(it)}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-transform hover:scale-105",
            cls[it],
          )}
        >
          {it}
        </button>
      ))}
    </div>
  );
}
