// components/SiteHeader.js — Server Component. Static: it reads no cookies,
// so it does not make the pages that use it dynamic. The two personalised
// pieces (cart count, account menu) are small Client Components.

import Link from "next/link";
import CartLink from "./CartLink";
import AccountNav from "./AccountNav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-h-11 items-center gap-2 text-lg font-extrabold text-brand-700">
          <span aria-hidden="true">🍽</span> Addis Eats
        </Link>
        {/* Phones: the nav always gets its own row, so the header height never depends
            on what the account menu renders after loading (no layout shift / CLS). */}
        <nav aria-label="Main" className="-ml-3 flex w-full flex-wrap items-center gap-1 sm:ml-0 sm:w-auto">
          <Link href="/menu" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-brand-50">
            Menu
          </Link>
          <CartLink />
          <AccountNav />
        </nav>
      </div>
    </header>
  );
}
