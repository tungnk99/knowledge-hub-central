import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  BookOpen,
  Home,
  LayoutTemplate,
  ClipboardCheck,
  Sparkles,
  Map,
  Trophy,
  LogIn,
  LogOut,
  Shield,
  UserCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/auth.types";
import { navItemsForRole, type NavItem } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import type { RouterContext } from "@/router";
import { Route as RootRoute } from "@/routes/__root";

const NAV_ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/quy-trinh": Map,
  "/case-success": Trophy,
  "/thu-vien": BookOpen,
  "/template": LayoutTemplate,
  "/duyet": ClipboardCheck,
  "/quan-tri/tai-khoan": Shield,
};

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.to;
  return pathname.startsWith(item.to);
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { role, user } = RootRoute.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const nav = navItemsForRole(role);

  const handleLogout = async () => {
    const { logout } = await import("@/lib/api/auth.functions");
    await logout();
    await router.invalidate();
    router.navigate({ to: "/" });
  };

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

        {nav.length > 0 && (
          <nav className="flex flex-col gap-1">
            {nav.map((item) => {
              const Icon = NAV_ICONS[item.to] ?? Home;
              const active = isActive(pathname, item);
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
        )}

        <div className="mt-auto pt-6">
          <AuthPanel role={role} user={user} onLogout={handleLogout} />
        </div>
      </aside>

      <div className="flex w-full flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">Kho tri thức</span>
          </Link>
          <div className="flex items-center gap-2">
            {role === "guest" && (
              <Link
                to="/dang-nhap"
                className="flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium"
              >
                <LogIn className="h-3.5 w-3.5" />
                Đăng nhập
              </Link>
            )}
          </div>
        </header>

        {nav.length > 0 && (
          <nav className="flex gap-1 overflow-x-auto border-b bg-card px-2 py-2 lg:hidden">
            {nav.map((item) => {
              const Icon = NAV_ICONS[item.to] ?? Home;
              const active = isActive(pathname, item);
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
        )}

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function AuthPanel({
  role,
  user,
  onLogout,
}: {
  role: RouterContext["role"];
  user: RouterContext["user"];
  onLogout: () => void;
}) {
  if (role === "guest") {
    return (
      <Link
        to="/dang-nhap"
        className="flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
      >
        <LogIn className="h-4 w-4" />
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="rounded-md border bg-background p-3">
      <div className="flex items-start gap-2">
        <UserCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          <p className="mt-1 text-xs text-primary">{ROLE_LABELS[role]}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="mt-3 w-full" onClick={onLogout}>
        <LogOut className="h-3.5 w-3.5" />
        Đăng xuất
      </Button>
    </div>
  );
}
