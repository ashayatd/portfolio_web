"use client";

import { MAGIC_COPY } from "./constants";

export default function ScrollIndicator() {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-600">
      <div className="h-12 w-px animate-pulse bg-zinc-700" />

      <span className="text-xs uppercase tracking-widest">
        {MAGIC_COPY.scrollLabel}
      </span>
    </div>
  );
}
