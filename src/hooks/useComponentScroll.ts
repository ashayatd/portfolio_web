"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

export function useComponentScroll(ref: React.RefObject<HTMLElement | null>) {
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const pixelsScrolledPastTop = -rect.top;
      const scrollableRange = rect.height - window.innerHeight;
      const percentage =
        scrollableRange <= 0 ? 0 : pixelsScrolledPastTop / scrollableRange;

      scrollProgress.set(Math.max(0, Math.min(1, percentage)));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref, scrollProgress]);

  return scrollProgress;
}
