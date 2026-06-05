import { redirect } from "@tanstack/react-router";

import type { Role } from "./auth.types";
import { hasMinRole } from "./permissions";

export function requireMinRole(current: Role, min: Exclude<Role, "guest">, redirectTo = "/") {
  if (!hasMinRole(current, min)) {
    throw redirect({ to: redirectTo });
  }
}

export function requireUserRoute(context: { role: Role }) {
  requireMinRole(context.role, "user");
}

export function requireAdminRoute(context: { role: Role }) {
  requireMinRole(context.role, "admin", "/quy-trinh");
}
