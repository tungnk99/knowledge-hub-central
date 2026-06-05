import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Plus, Trash2, UserCog } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser, listUsers, removeUser, updateUser } from "@/lib/api/auth.functions";
import { requireAdminRoute } from "@/lib/auth-route-guard";
import { ROLE_LABELS } from "@/lib/auth.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/quan-tri/tai-khoan")({
  beforeLoad: ({ context }) => requireAdminRoute(context),
  head: () => ({
    meta: [{ title: "Quản lý tài khoản — Kho tri thức Consultant AI" }],
  }),
  component: AccountAdminPage,
});

type ManagedUser = Awaited<ReturnType<typeof listUsers>>[number];

function AccountAdminPage() {
  return (
    <AppLayout>
      <AccountAdmin />
    </AppLayout>
  );
}

function AccountAdmin() {
  const qc = useQueryClient();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => listUsers(),
  });

  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");

  const createMut = useMutation({
    mutationFn: () => createUser({ data: { email, name, password, role } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Đã tạo tài khoản");
      setShowForm(false);
      setEmail("");
      setName("");
      setPassword("");
      setRole("user");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMut = useMutation({
    mutationFn: (payload: Parameters<typeof updateUser>[0]["data"]) => updateUser({ data: payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Đã cập nhật tài khoản");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => removeUser({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Đã xóa tài khoản");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <UserCog className="h-6 w-6" />
            Quản lý tài khoản truy cập
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tạo và quản lý quyền admin / user cho hệ thống.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" />
          Thêm tài khoản
        </Button>
      </div>

      {showForm && (
        <form
          className="mb-6 grid gap-4 rounded-lg border bg-card p-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMut.mutate();
          }}
        >
          <div>
            <Label>Họ tên</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Mật khẩu</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div>
            <Label>Vai trò</Label>
            <Select value={role} onValueChange={(v) => setRole(v as "admin" | "user")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Thành viên</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={createMut.isPending}>
              Tạo tài khoản
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Họ tên</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Vai trò</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onUpdate={(patch) => updateMut.mutate({ id: user.id, ...patch })}
                onDelete={() => {
                  if (confirm(`Xóa tài khoản ${user.email}?`)) deleteMut.mutate(user.id);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserRow({
  user,
  onUpdate,
  onDelete,
}: {
  user: ManagedUser;
  onUpdate: (patch: {
    name?: string;
    role?: "admin" | "user";
    active?: boolean;
    password?: string;
  }) => void;
  onDelete: () => void;
}) {
  const [password, setPassword] = useState("");

  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3">{user.name}</td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3">
        <Select
          value={user.role}
          onValueChange={(v) => onUpdate({ role: v as "admin" | "user" })}
        >
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">{ROLE_LABELS.user}</SelectItem>
            <SelectItem value="admin">{ROLE_LABELS.admin}</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 py-3">
        <Button
          variant={user.active ? "outline" : "secondary"}
          size="sm"
          onClick={() => onUpdate({ active: !user.active })}
        >
          {user.active ? "Đang hoạt động" : "Đã khóa"}
        </Button>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-8 w-36"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={password.length < 6}
            onClick={() => {
              onUpdate({ password });
              setPassword("");
            }}
          >
            Đổi MK
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
