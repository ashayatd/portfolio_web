"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex items-center gap-2 text-slate-900">
        <Lock size={18} />
        <h1 className="text-lg font-semibold">Restricted</h1>
      </div>

      <input
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Password"
        required
        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400"
      />

      {state.error && (
        <p className="text-sm text-rose-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
