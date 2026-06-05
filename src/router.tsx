import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import type { PublicUser, Role } from "./lib/auth.types";
import { routeTree } from "./routeTree.gen";

export interface RouterContext {
  queryClient: QueryClient;
  user: PublicUser | null;
  role: Role;
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      user: null,
      role: "guest",
    } satisfies RouterContext,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
