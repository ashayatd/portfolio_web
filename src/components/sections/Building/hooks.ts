"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

type InViewOptions = NonNullable<Parameters<typeof useInView>[1]>;
type RevealMargin = InViewOptions["margin"];

export function useBuildingReveal<T extends HTMLElement = HTMLDivElement>(
  margin: RevealMargin = "-80px",
) {
  const ref = useRef<T>(null);
  const isInView = useInView(ref, { once: true, margin });

  return { ref, isInView };
}
