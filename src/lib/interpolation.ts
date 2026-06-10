import { clamp01 } from "./math";

export function normalizeRange(value: number, start: number, end: number) {
  if (start === end) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

export function mapRange(
  value: number,
  inputStart: number,
  inputEnd: number,
  outputStart: number,
  outputEnd: number,
) {
  const progress = normalizeRange(value, inputStart, inputEnd);
  return outputStart + (outputEnd - outputStart) * progress;
}
