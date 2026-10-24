// lib/order-status.js
// The order lifecycle. Both the UI and the server actions read from here, but
// only the server's check (canTransition) is a security boundary.

export const ORDER_STATUSES = ["Placed", "Preparing", "Ready", "Delivered", "Cancelled"];

const TRANSITIONS = {
  Placed: ["Preparing", "Cancelled"],
  Preparing: ["Ready", "Cancelled"],
  Ready: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

export function nextStatuses(status) {
  return TRANSITIONS[status] ?? [];
}

export function canTransition(from, to) {
  return nextStatuses(from).includes(to);
}

/** Customers may cancel only before the kitchen starts cooking. */
export function customerCanCancel(status) {
  return status === "Placed";
}

export function isFinal(status) {
  return status === "Delivered" || status === "Cancelled";
}
