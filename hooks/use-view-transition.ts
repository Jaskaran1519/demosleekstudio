"use client";

import { useRouter } from "next/navigation";

export function useViewTransitionRouter() {
  const router = useRouter();

  const push = (href: string) => {
    if (!document.startViewTransition) {
      return router.push(href);
    }

    document.startViewTransition(() => {
      router.push(href);
    });
  };

  return {
    ...router,
    push,
  };
} 