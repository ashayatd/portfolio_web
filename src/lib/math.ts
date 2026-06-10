export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function clamp01(value: number) {
  return clamp(value, 0, 1);
}

export function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}
