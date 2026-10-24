"use server";
// app/actions/auth.js — sign in, sign up, sign out.
// Error messages are deliberately generic: "email or password is wrong" never
// reveals which accounts exist.

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { findUserByEmail, createUser } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { safeRedirect } from "@/lib/auth/redirect";
import { validateSignIn, validateSignUp } from "@/lib/validation";

export async function signIn(_prevState, formData) {
  const { data, errors } = validateSignIn(formData);
  if (errors) return { errors, values: { email: String(formData.get("email") ?? "") } };

  const user = findUserByEmail(data.email);
  if (!user || !verifyPassword(data.password, user.passwordHash)) {
    return { errors: { form: "That email and password do not match." }, values: { email: data.email } };
  }

  await createSession(user);
  // Attack 3 stops here: `next` is reduced to a same-origin path or "/".
  redirect(safeRedirect(formData.get("next"), "/menu"));
}

export async function signUp(_prevState, formData) {
  const { data, errors } = validateSignUp(formData);
  const values = { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? "") };
  if (errors) return { errors, values };

  if (findUserByEmail(data.email)) {
    return { errors: { email: "An account with this email already exists. Sign in instead." }, values };
  }

  const user = createUser({
    name: data.name,
    email: data.email,
    passwordHash: hashPassword(data.password),
  });
  await createSession(user);
  redirect(safeRedirect(formData.get("next"), "/menu"));
}

// The account menu navigates home and refreshes after this resolves.
export async function signOut() {
  await deleteSession();
}
