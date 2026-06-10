import { HERO_TIMINGS } from "@/timeline/timings";

export const heroAnimationRanges = {
  videoOpacity: {
    input: [...HERO_TIMINGS.videoFade],
    output: [1, 1, 0],
  },
  videoScale: {
    input: [0, 0.12],
    output: [1, 1.05],
  },
  indicatorOpacity: {
    input: [...HERO_TIMINGS.indicatorFade],
    output: [1, 0, 0],
  },
  canvasScale: {
    input: [0.8, 1],
    output: [1, 1.09],
  },
  canvasOpacity: {
    input: [...HERO_TIMINGS.canvasExit],
    output: [1, 0, 0],
  },
  magicPageOpacity: {
    input: [...HERO_TIMINGS.magicEntrance],
    output: [0, 1, 1],
  },
  magicPageScale: {
    input: [...HERO_TIMINGS.magicEntrance],
    output: [0.97, 1, 1],
  },
};
