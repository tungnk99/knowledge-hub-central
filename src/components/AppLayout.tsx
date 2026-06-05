import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpen, Home, LayoutTemplate, ClipboardCheck, PlusCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Trang chủ", icon: Home },
  { to: "/thu-vien", label: "Thư viện tài liệu", icon: BookOpen },
  { to: "/template", label: "Thư viện Template", icon: LayoutTemplate },
  { to: "/duyet", label: "Hàng đợi duyệt", icon: ClipboardCheck },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card px-3 py-5 lg:flex">
        <Link to="/" className="flex items-center gap-2 px-2 pb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Kho tri thức</div>
            <div className="text-xs text-muted-foreground leading-tight">Consultant AI</div>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <Link
            to="/soan/new"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4" />
            Soạn tài liệu mới
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex w-full flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">Kho tri thức</span>
          </Link>
          <Link
            to="/soan/new"
            className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Tài liệu mới
          </Link>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b bg-card px-2 py-2 lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
