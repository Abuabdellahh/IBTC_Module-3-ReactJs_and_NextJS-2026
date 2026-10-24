// lib/format.js
// One place for display formatting so every screen agrees.
// Formatters are created once — constructing Intl objects per render is slow.

const etb = new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" });

const dateTime = new Intl.DateTimeFormat("en-ET", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Addis_Ababa",
});

export const formatETB = (amount) => etb.format(amount);
export const formatDateTime = (iso) => dateTime.format(new Date(iso));

/** "ord_3f9a…" → "#3F9A12" — short, readable reference for customers and staff. */
export const formatOrderRef = (id) =>
  `#${id.replace(/^ord_/, "").replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase()}`;
