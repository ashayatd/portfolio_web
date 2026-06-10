import type { PropsWithChildren } from "react";

type StickyLayerProps = PropsWithChildren<{
  className?: string;
}>;

export function StickyLayer({ className = "", children }: StickyLayerProps) {
  return (
    <div className={`sticky top-0 h-screen w-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
