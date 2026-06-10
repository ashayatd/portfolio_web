import type { SectionId, TimelineRangeMap } from "@/types";

export const TIMELINE = {
  hero: [0.0, 0.15],

  // long cinematic section
  magic: [0.15, 0.75],

  continue: [0.75, 1.0],
  
} as const satisfies TimelineRangeMap<SectionId>;

export type TimelineSection =
  keyof typeof TIMELINE;



