"use client";

import {
  createContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { useScroll, type MotionValue } from "framer-motion";

type TimelineContextValue = {
  progress: MotionValue<number>;
};

export const TimelineContext = createContext<TimelineContextValue | null>(null);

export function TimelineProvider({ children }: PropsWithChildren) {
  const { scrollYProgress } = useScroll();

  const value = useMemo(
    () => ({ progress: scrollYProgress }),
    [scrollYProgress],
  );

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}
