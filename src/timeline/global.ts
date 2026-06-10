export const GLOBAL_TIMELINE = {
  hero: [0, 30],

  magic: [30, 80],

  continue: [80, 100],
} as const;

export const normalizeRange = (
  progress: number,
  start: number,
  end: number,
) => {
  return Math.min(
    1,
    Math.max(
      0,
      (progress - start) /
        (end - start),
    ),
  );
};

