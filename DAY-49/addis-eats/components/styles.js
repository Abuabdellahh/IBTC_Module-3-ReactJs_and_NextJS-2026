// components/styles.js
// Shared class strings so buttons and fields look and behave the same everywhere.
// Minimum 44px touch targets (min-h-11) for thumbs on a real phone.

export const btn = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60",
  danger:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-danger/30 bg-surface px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger-bg disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-medium text-ink hover:bg-brand-50",
};

export const field = {
  label: "block text-sm font-semibold text-ink",
  input:
    "mt-1 block min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-ink placeholder:text-muted/70 aria-[invalid=true]:border-danger",
  textarea:
    "mt-1 block w-full rounded-lg border border-line bg-surface px-3 py-2 text-base text-ink placeholder:text-muted/70 aria-[invalid=true]:border-danger",
  error: "mt-1 text-sm text-danger",
  hint: "mt-1 text-sm text-muted",
};

export const card = "rounded-2xl border border-line bg-surface shadow-sm";
