// components/StatusBadge.js — colour is never the only signal: the text says the status too.

const STYLES = {
  Placed: "bg-accent-100 text-ink",
  Preparing: "bg-brand-100 text-brand-800",
  Ready: "bg-success-bg text-success",
  Delivered: "bg-line text-ink",
  Cancelled: "bg-danger-bg text-danger",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status] ?? "bg-line text-ink"}`}>
      {status}
    </span>
  );
}
