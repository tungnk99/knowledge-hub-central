import { useSession } from "@tanstack/react-start/server";

import type { SessionData } from "./auth.types";

function sessionPassword(): string {
  return (
    process.env.SESSION_SECRET ??
    "dev-knowledge-hub-session-secret-min-32-chars"
  );
}

export function useAppSession() {
  return useSession<SessionData>({
    name: "kh-session",
    password: sessionPassword(),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    },
  });
}
