import type { Role } from "./auth.types";

const ROLE_RANK: Record<Role, number> = {
  guest: 0,
  user: 1,
  admin: 2,
};

export function hasMinRole(current: Role, min: Exclude<Role, "guest">): boolean {
  return ROLE_RANK[current] >= ROLE_RANK[min];
}

export function canManageAccounts(role: Role): boolean {
  return role === "admin";
}

export function canApproveDocs(role: Role): boolean {
  return role === "admin";
}

export function canEditDoc(role: Role, status: string): boolean {
  if (role === "admin") return true;
  if (role === "user") return status !== "Đã duyệt";
  return false;
}

export function canDeleteDoc(role: Role): boolean {
  return role === "admin";
}

export function canSubmitDoc(role: Role): boolean {
  return role === "admin" || role === "user";
}

export function canManageCaseSuccess(role: Role): boolean {
  return role === "admin";
}

export type NavItem = {
  to: string;
  label: string;
  minRole: Exclude<Role, "guest">;
  exact?: boolean;
};

export const ALL_NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Trang chủ", minRole: "user", exact: true },
  { to: "/quy-trinh", label: "Quy trình tư vấn", minRole: "user" },
  { to: "/case-success", label: "Success Case", minRole: "user" },
  { to: "/thu-vien", label: "Thư viện tài liệu", minRole: "user" },
  { to: "/template", label: "Thư viện Template", minRole: "user" },
  { to: "/duyet", label: "Hàng đợi duyệt", minRole: "admin" },
  { to: "/quan-tri/tai-khoan", label: "Quản lý tài khoản", minRole: "admin" },
];

export function navItemsForRole(role: Role) {
  if (role === "guest") return [];
  return ALL_NAV_ITEMS.filter((item) => hasMinRole(role, item.minRole));
}
