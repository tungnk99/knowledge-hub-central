import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getCurrentAuth, requireAdmin } from "../auth-guard.server";
import type { PublicUser, Role } from "../auth.types";
import { verifyPassword } from "../password.server";
import { useAppSession } from "../session.server";
import {
  createUserAccount,
  deleteUserAccount,
  findUserByEmail,
  readUsers,
  toPublicUser,
  updateUserAccount,
} from "../users.server";

export interface SessionResponse {
  user: PublicUser | null;
  role: Role;
}

export const fetchSession = createServerFn({ method: "GET" }).handler(async (): Promise<SessionResponse> => {
  return getCurrentAuth();
});

export const login = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email("Email không hợp lệ"),
      password: z.string().min(1, "Mật khẩu không được để trống"),
    }),
  )
  .handler(async ({ data }) => {
    const account = await findUserByEmail(data.email);
    const hashToCheck = account?.passwordHash ?? "";
    const ok = account?.active && hashToCheck && (await verifyPassword(data.password, hashToCheck));

    if (!ok) {
      return { ok: false as const, error: "Email hoặc mật khẩu không đúng" };
    }

    const session = await useAppSession();
    await session.update({
      userId: account!.id,
      email: account!.email,
      name: account!.name,
      role: account!.role,
    });

    return {
      ok: true as const,
      user: toPublicUser(account!),
      role: account!.role as Role,
    };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  await session.clear();
  return { ok: true };
});

export const listUsers = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const users = await readUsers();
  return users.map((u) => ({
    ...toPublicUser(u),
    active: u.active,
    createdAt: u.createdAt,
  }));
});

export const createUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      name: z.string().min(1),
      role: z.enum(["admin", "user"]),
      password: z.string().min(6),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const user = await createUserAccount(data);
    return toPublicUser(user);
  });

export const updateUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      role: z.enum(["admin", "user"]).optional(),
      active: z.boolean().optional(),
      password: z.string().min(6).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    if (data.id === admin.id && data.active === false) {
      throw new Error("Không thể tự vô hiệu hóa tài khoản của bạn");
    }
    const { id, ...patch } = data;
    const user = await updateUserAccount(id, patch);
    return toPublicUser(user);
  });

export const removeUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    if (data.id === admin.id) {
      throw new Error("Không thể xóa tài khoản của bạn");
    }
    await deleteUserAccount(data.id);
    return { ok: true };
  });
