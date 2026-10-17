"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  createSessionValue,
  getAdminPassword,
  passwordMatches,
  sessionCookieOptions,
} from "@/lib/admin-session";

export type LoginState = { error: string | null };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!getAdminPassword()) {
    return { error: "RESUME_ACCESS_PASSWORD is not set on the server." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    return { error: "Incorrect password." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionValue(), sessionCookieOptions());
  revalidatePath("/ashayatd");
  return { error: null };
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  revalidatePath("/ashayatd");
}
