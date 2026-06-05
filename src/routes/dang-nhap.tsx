import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api/auth.functions";
import { hasMinRole } from "@/lib/permissions";

export const Route = createFileRoute("/dang-nhap")({
  beforeLoad: ({ context }) => {
    if (hasMinRole(context.role, "user")) {
      throw redirect({ to: "/quy-trinh" });
    }
  },
  head: () => ({
    meta: [{ title: "Đăng nhập — Kho tri thức Consultant AI" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login({ data: { email, password } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Chào mừng ${result.user.name}!`);
      await router.invalidate();
      router.navigate({ to: "/quy-trinh" });
    } catch {
      toast.error("Không thể đăng nhập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Truy cập kho tri thức nội bộ Consultant AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@fpt.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Đăng nhập
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Khách chỉ xem được{" "}
          <Link to="/" className="text-primary hover:underline">
            trang chủ
          </Link>
          . Liên hệ quản trị viên để được cấp tài khoản.
        </p>

        <div className="mt-4 rounded-md border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Tài khoản demo</p>
          <p>Admin: admin@fpt.com / admin123</p>
          <p>User: user@fpt.com / user123</p>
        </div>
      </div>
    </div>
  );
}
