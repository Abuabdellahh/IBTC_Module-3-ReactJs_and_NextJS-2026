// app/signup/page.js — create a customer account. Sign-up can never create staff.

import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { safeRedirect } from "@/lib/auth/redirect";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Create an account",
  description: "Create a free Addis Eats account to order and track deliveries.",
  alternates: { canonical: "/signup" },
};

export default async function SignUpPage({ searchParams }) {
  const next = safeRedirect((await searchParams).next, "/menu");
  if (await getSession()) redirect(next);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
      <p className="mt-2 mb-6 text-muted">It takes less than a minute.</p>
      <AuthForm mode="signup" next={next} />
    </div>
  );
}
