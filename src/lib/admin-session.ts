import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ashay_admin";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

/**
 * The session is signed with the password itself, which keeps setup to a
 * single env var and has the useful side effect that changing the password
 * immediately invalidates every issued session.
 */
export function getAdminPassword(): string | null {
  const password = process.env.RESUME_ACCESS_PASSWORD;
  return password && password.length > 0 ? password : null;
}

function constantTimeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function sign(expiresAt: number, password: string): string {
  return createHmac("sha256", password)
    .update(`resume-admin:${expiresAt}`)
    .digest("hex");
}

export function passwordMatches(candidate: string): boolean {
  const password = getAdminPassword();
  if (!password) return false;
  return constantTimeEquals(candidate, password);
}

export function createSessionValue(): string {
  const password = getAdminPassword();
  if (!password) throw new Error("RESUME_ACCESS_PASSWORD is not configured");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return `${expiresAt}.${sign(expiresAt, password)}`;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

function isValidSession(value: string | undefined): boolean {
  const password = getAdminPassword();
  if (!password || !value) return false;

  const separator = value.indexOf(".");
  if (separator === -1) return false;

  const expiresAt = Number(value.slice(0, separator));
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return constantTimeEquals(value.slice(separator + 1), sign(expiresAt, password));
}

/** Read-only check, safe to call from a Server Component. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return isValidSession(store.get(ADMIN_COOKIE)?.value);
}
