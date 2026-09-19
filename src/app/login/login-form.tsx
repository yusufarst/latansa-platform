"use client";

import { useActionState } from "react";
import { loginAction } from "@/modules/auth/actions";
import { useFormStatus } from "react-dom";

const initialState = {
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Sign in"
      className="w-full rounded-md bg-brand px-4 py-2.5 text-xs sm:text-sm font-semibold text-brand-foreground shadow-xs hover:bg-brand-hover focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
    >
      {pending ? "Sedang memverifikasi..." : "Masuk"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(
    async (prevState: { error: string }, formData: FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const res = await loginAction({ email, password });
      if (res?.error) {
        return { error: res.error };
      }
      return { error: "" };
    },
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-md bg-red-50 dark:bg-red-950/40 p-3.5 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-300">
          <p className="font-medium">{state.error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-foreground"
        >
          Alamat Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-label="Email address"
          placeholder="nama@perusahaan.com"
          className="block w-full rounded-md border border-border/80 py-2 px-3 text-xs sm:text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-foreground"
        >
          Kata Sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-label="Password"
          placeholder="••••••••"
          className="block w-full rounded-md border border-border/80 py-2 px-3 text-xs sm:text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
        />
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
