export const SLOT_SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function getSlotScrambleCharacter(seed: number) {
  const index = Math.abs(seed) % SLOT_SCRAMBLE_CHARS.length;
  return SLOT_SCRAMBLE_CHARS[index];
}
