// lib/orders.js
// In-memory order store — shared between Server Actions and Route Handlers.
// Replace with a real database in production.

export const orders = [
  { id: "ord-1", userId: "demo-user-1",  item: "Doro Wot",      status: "Preparing", createdAt: new Date().toISOString() },
  { id: "ord-2", userId: "demo-user-1",  item: "Shiro",         status: "Ready",     createdAt: new Date().toISOString() },
  { id: "ord-3", userId: "demo-user-2",  item: "Tibs",          status: "Delivered", createdAt: new Date().toISOString() },
  { id: "ord-4", userId: "demo-staff-1", item: "Kitfo",         status: "Preparing", createdAt: new Date().toISOString() },
];

export function getOrderById(id) {
  return orders.find((o) => o.id === id) ?? null;
}

export function getOrdersForUser(userId) {
  return orders.filter((o) => o.userId === userId);
}

export function getAllOrders() {
  return orders;
}
