import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px] px-4 py-4 pb-28 sm:px-5 md:p-6 md:pb-8 lg:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
