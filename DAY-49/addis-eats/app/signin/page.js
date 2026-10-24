// app/signin/page.js — Dynamic (reads ?next= and the session).
// `next` is sanitised here for the hidden field AND again inside signIn(),
// because the form value can be edited before it is posted.

import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { safeRedirect } from "@/lib/auth/redirect";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: true },
};

export default async function SignInPage({ searchParams }) {
  const next = safeRedirect((await searchParams).next, "/menu");
  if (await getSession()) redirect(next);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>
      <p className="mt-2 mb-6 text-muted">Sign in to check out and follow your orders.</p>
      <AuthForm mode="signin" next={next} />

      <details className="mt-6 rounded-xl border border-line bg-surface p-4 text-sm">
        <summary className="cursor-pointer font-semibold">Demo accounts for assessors</summary>
        <ul className="mt-3 space-y-1 text-muted">
          <li>Customer: <code>abebe@example.com</code> / <code>password123</code></li>
          <li>Second customer: <code>sara@example.com</code> / <code>password123</code></li>
          <li>Kitchen staff: <code>kitchen@example.com</code> / <code>staffpass123</code></li>
        </ul>
      </details>
    </div>
  );
}
