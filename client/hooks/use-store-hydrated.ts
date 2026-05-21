"use client";

import { useSyncExternalStore } from "react";

/** After hydration — safe to read zustand `persist` state without SSR mismatch. */
export function useStoreHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
