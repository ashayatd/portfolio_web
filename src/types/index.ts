export type SectionId =
  | "hero"
  | "magic"
  | "continue";

export type TimelineRange =
  readonly [start: number, end: number];

export type TimelineRangeMap<
  T extends string = string
> = Record<T, TimelineRange>;

export type Nullable<T> = T | null;