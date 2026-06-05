import type { PublicUser, UserAccount } from "./auth.types";
import { hashPassword } from "./password.server";
import { newId, todayISO } from "./db.server";
import { ensureDbReady, sqlExecute, sqlQuery } from "./sqlite.server";

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: UserAccount["role"];
  password_hash: string;
  active: number;
  created_at: string;
};

function rowToUser(row: UserRow): UserAccount {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    passwordHash: row.password_hash,
    active: row.active === 1,
    createdAt: row.created_at,
  };
}

export async function readUsers(): Promise<UserAccount[]> {
  await ensureDbReady();
  const rows = await sqlQuery<UserRow>("SELECT * FROM users ORDER BY created_at ASC");
  return rows.map(rowToUser);
}

export async function findUserByEmail(email: string): Promise<UserAccount | null> {
  await ensureDbReady();
  const rows = await sqlQuery<UserRow>(
    "SELECT * FROM users WHERE email = ? COLLATE NOCASE",
    [email],
  );
  return rows[0] ? rowToUser(rows[0]) : null;
}

export async function findUserById(id: string): Promise<UserAccount | null> {
  await ensureDbReady();
  const rows = await sqlQuery<UserRow>("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0] ? rowToUser(rows[0]) : null;
}

export function toPublicUser(user: UserAccount): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

async function saveUser(user: UserAccount) {
  await sqlExecute(
    `INSERT OR REPLACE INTO users (id, email, name, role, password_hash, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      user.email,
      user.name,
      user.role,
      user.passwordHash,
      user.active ? 1 : 0,
      user.createdAt,
    ],
  );
}

export async function createUserAccount(input: {
  email: string;
  name: string;
  role: UserAccount["role"];
  password: string;
}): Promise<UserAccount> {
  await ensureDbReady();
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("Email đã tồn tại");
  }
  const user: UserAccount = {
    id: newId("usr"),
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    role: input.role,
    passwordHash: await hashPassword(input.password),
    active: true,
    createdAt: todayISO(),
  };
  await saveUser(user);
  return user;
}

export async function updateUserAccount(
  id: string,
  patch: Partial<Pick<UserAccount, "name" | "role" | "active">> & { password?: string },
): Promise<UserAccount> {
  await ensureDbReady();
  const current = await findUserById(id);
  if (!current) throw new Error("Không tìm thấy tài khoản");

  if (patch.name !== undefined) current.name = patch.name.trim();
  if (patch.role !== undefined) current.role = patch.role;
  if (patch.active !== undefined) current.active = patch.active;
  if (patch.password) current.passwordHash = await hashPassword(patch.password);

  await saveUser(current);
  return current;
}

export async function deleteUserAccount(id: string): Promise<void> {
  await ensureDbReady();
  const users = await readUsers();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error("Không tìm thấy tài khoản");
  if (user.role === "admin" && users.filter((u) => u.role === "admin" && u.active).length <= 1) {
    throw new Error("Không thể xóa admin cuối cùng");
  }
  await sqlExecute("DELETE FROM users WHERE id = ?", [id]);
}
