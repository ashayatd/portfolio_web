import { TIMELINE, type TimelineSection } from "./timeline";

export const TIMELINE_SECTIONS = Object.keys(TIMELINE) as TimelineSection[];

export const SECTION_ORDER: TimelineSection[] = [
  "hero",
  "magic",
  "continue",
];
