export const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

export const REVEAL_TRANSITION = {
  duration: 0.6,
  ease: CINEMATIC_EASE,
};

export const STAGGERED_REVEAL = {
  ...REVEAL_TRANSITION,
  staggerChildren: 0.08,
};
