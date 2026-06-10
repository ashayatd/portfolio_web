export const SCROLL_UNLOCK_DELAY_MS = 600;

export const HERO_TIMINGS = {
  // Hero fades a little slower
  videoFade: [0, 0.08, 0.16],

  // Keep overlay visible longer
  indicatorFade: [0, 0.08, 0.82],

  // Hero exits slightly earlier
  canvasExit: [0.86, 0.94, 1],

  // Magic gains ownership earlier
  magicEntrance: [0.90, 0.97, 1],
} as const;

export const MAGIC_TIMINGS = {
  // Title sequence begins sooner
  titleStart: 0.28,

  // Leave room for horizontal cards
  titleEnd: 0.82,
} as const;

export const CONTINUE_TIMINGS = {
  // Continue appears gently
  introStart: 0.88,

  introEnd: 0.94,

  // Future cards phase
  cardsStart: 0.94,

  cardsEnd: 1,
} as const;