"use client";
// components/AccountNav.js
// Why a Client Component: the root layout must not read the session cookie,
// because reading cookies makes every route under it dynamic — including the
// public menu, which should be static and served from the CDN. So the account
// menu asks /api/session from the browser instead.
//
// This is UI only. Hiding "Kitchen" from customers protects nothing — the
// kitchen page and advanceOrder() check the role on the server.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { signOut } from "@/app/actions/auth";

const fetcher = (url) => fetch(url, { cache: "no-store" }).then((res) => res.json());
const linkClass = "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-brand-50";

export default function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR("/api/session", fetcher, { revalidateOnFocus: true });

  // Sign-in and sign-up redirect to a new page; refresh who we are when that happens.
  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  async function handleSignOut() {
    await signOut();
    await mutate({ user: null }, { revalidate: false });
    router.push("/");
    router.refresh(); // drop any cached private pages
  }

  // Reserve the space while loading so the header does not shift (CLS).
  if (isLoading && !data) return <span className="inline-block h-11 w-20" aria-hidden="true" />;

  const user = data?.user;
  if (!user) {
    return (
      <Link href="/signin" className="inline-flex min-h-11 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">
        Sign in
      </Link>
    );
  }

  return (
    <>
      <Link href="/orders" className={linkClass}>My orders</Link>
      {user.role === "staff" && <Link href="/kitchen" className={linkClass}>Kitchen</Link>}
      <form action={handleSignOut}>
        <button type="submit" className={linkClass}>
          Sign out<span className="sr-only">, {user.name}</span>
        </button>
      </form>
    </>
  );
}
