"use client";

import { useEffect, useState } from "react";

/** After mount — safe to read zustand `persist` state without SSR mismatch. */
export function useStoreHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
