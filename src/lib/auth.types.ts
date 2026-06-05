export type Role = "admin" | "user" | "guest";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: Exclude<Role, "guest">;
  passwordHash: string;
  active: boolean;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: Exclude<Role, "guest">;
}

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: Exclude<Role, "guest">;
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Quản trị viên",
  user: "Thành viên",
  guest: "Khách",
};
