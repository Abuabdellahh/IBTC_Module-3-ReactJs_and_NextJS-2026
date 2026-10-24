"use client";
// components/AuthForm.js — sign-in and sign-up share one form.
// onSubmit-free: the form's `action` is the Server Action, so it also works
// before JavaScript loads, and Enter submits it like any real form.

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import FieldError from "./FieldError";
import FormAlert from "./FormAlert";
import SubmitButton from "./SubmitButton";
import { card, field } from "./styles";

export default function AuthForm({ mode, next }) {
  const isSignUp = mode === "signup";
  const [state, formAction] = useActionState(isSignUp ? signUp : signIn, {});
  const errors = state?.errors ?? {};
  const values = state?.values ?? {};
  const nextQuery = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form action={formAction} className={`${card} space-y-5 p-6`} noValidate>
      <FormAlert message={errors.form} />
      <input type="hidden" name="next" value={next} />

      {isSignUp && (
        <div>
          <label htmlFor="name" className={field.label}>Your name</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={field.input}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
      )}

      <div>
        <label htmlFor="email" className={field.label}>Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={values.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={field.input}
        />
        <FieldError id="email-error" message={errors.email} />
      </div>

      <div>
        <label htmlFor="password" className={field.label}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          required
          minLength={isSignUp ? 8 : undefined}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={[errors.password && "password-error", isSignUp && "password-hint"].filter(Boolean).join(" ") || undefined}
          className={field.input}
        />
        {isSignUp && <p id="password-hint" className={field.hint}>At least 8 characters.</p>}
        <FieldError id="password-error" message={errors.password} />
      </div>

      <SubmitButton pendingLabel={isSignUp ? "Creating your account…" : "Signing in…"} className="w-full">
        {isSignUp ? "Create account" : "Sign in"}
      </SubmitButton>

      <p className="text-center text-sm text-muted">
        {isSignUp ? "Already have an account? " : "New to Addis Eats? "}
        <Link href={`${isSignUp ? "/signin" : "/signup"}${nextQuery}`} className="font-semibold text-brand-700 underline">
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
