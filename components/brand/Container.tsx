import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Max 1280px, gutters that hold at 375px. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-site px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
