import type { AuthUser, Role } from "./auth.types";
import { useAppSession } from "./session.server";
import { findUserById, toPublicUser } from "./users.server";

export async function getCurrentAuth(): Promise<{ user: AuthUser | null; role: Role }> {
  const session = await useAppSession();
  const data = session.data;
  if (!data.userId) {
    return { user: null, role: "guest" };
  }

  const account = await findUserById(data.userId);
  if (!account || !account.active) {
    await session.clear();
    return { user: null, role: "guest" };
  }

  const user = toPublicUser(account);
  return { user, role: user.role };
}

export async function requireAuth(): Promise<AuthUser> {
  const { user } = await getCurrentAuth();
  if (!user) throw new Error("Vui lòng đăng nhập");
  return user;
}

export async function requireRole(roles: Exclude<Role, "guest">[]): Promise<AuthUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error("Không có quyền thực hiện thao tác này");
  }
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  return requireRole(["admin"]);
}
