"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";

export function useStickyScene<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return {
    ref,
    progress: scrollYProgress,
  };
}
