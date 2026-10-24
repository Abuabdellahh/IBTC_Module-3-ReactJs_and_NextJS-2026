// components/EmptyState.js — what a screen shows when there is nothing to show yet.
// A brand-new account sees one of these, never a blank area or a crash.

import Link from "next/link";
import { btn, card } from "./styles";

export default function EmptyState({ icon, title, children, actionHref, actionLabel }) {
  return (
    <div className={`${card} px-6 py-12 text-center`}>
      <p className="text-4xl" aria-hidden="true">{icon}</p>
      <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
      {children && <p className="mx-auto mt-2 max-w-sm text-muted">{children}</p>}
      {actionHref && (
        <Link href={actionHref} className={`${btn.primary} mt-6`}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
