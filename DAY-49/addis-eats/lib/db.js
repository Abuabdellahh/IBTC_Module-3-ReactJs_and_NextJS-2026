// lib/db.js
// Data-access layer. Every function that reads a customer's data takes the
// userId as an argument, and callers pass session.userId — never an id from
// the URL, a form field or a request body.
//
// Storage is an in-memory store kept on globalThis (so it survives hot reload
// in development). It resets on every server restart and is not shared
// between serverless instances. That limitation is deliberate for a frontend
// capstone and is the first item in FUTURE.md: swapping this file for a real
// database changes nothing outside it.

import "server-only";
import { randomUUID } from "node:crypto";
import { hashPassword } from "./auth/password.js";

const totalOf = (lines) => lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
const newest = (a, b) => b.createdAt.localeCompare(a.createdAt);

function seed() {
  const users = [
    { id: "usr_abebe", name: "Abebe Kebede", email: "abebe@example.com", role: "customer", password: "password123" },
    { id: "usr_sara", name: "Sara Tesfaye", email: "sara@example.com", role: "customer", password: "password123" },
    { id: "usr_kitchen", name: "Kitchen Staff", email: "kitchen@example.com", role: "staff", password: "staffpass123" },
  ].map(({ password, ...user }) => ({
    ...user,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }));

  const now = Date.now();
  const orders = [
    {
      id: "ord_abebe_demo",
      userId: "usr_abebe",
      lines: [
        { dishId: "doro-wat", name: "Doro Wat", unitPrice: 450, qty: 1 },
        { dishId: "buna", name: "Buna (Coffee)", unitPrice: 90, qty: 2 },
      ],
      phone: "0911234567",
      address: "Bole, near Edna Mall",
      notes: "",
      status: "Preparing",
      createdAt: new Date(now - 25 * 60_000).toISOString(),
    },
    {
      // Sara's order: the target for attack 2 (signed in as Abebe, act on Sara's record).
      id: "ord_sara_demo",
      userId: "usr_sara",
      lines: [{ dishId: "beyaynetu", name: "Beyaynetu", unitPrice: 320, qty: 2 }],
      phone: "0922345678",
      address: "Piassa, behind the post office",
      notes: "Extra injera please",
      status: "Placed",
      createdAt: new Date(now - 5 * 60_000).toISOString(),
    },
  ].map((order) => ({ ...order, total: totalOf(order.lines), idempotencyKey: null }));

  return { users, orders };
}

const store = (globalThis.__addisEatsStore ??= seed());


// ─── Users ──────────────────────────────────────────────────────────────────

export function findUserByEmail(email) {
  return store.users.find((user) => user.email === email) ?? null;
}

export function createUser({ name, email, passwordHash }) {
  const user = {
    id: `usr_${randomUUID()}`,
    name,
    email,
    role: "customer", // sign-up can never create staff
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  return user;
}

// ─── Orders (customer-scoped) ───────────────────────────────────────────────

export function listOrdersForUser(userId) {
  return store.orders.filter((order) => order.userId === userId).sort(newest);
}

/** Scoped lookup: returns null both when the order does not exist and when it belongs to someone else. */
export function getOrderForUser(orderId, userId) {
  return store.orders.find((order) => order.id === orderId && order.userId === userId) ?? null;
}

/**
 * Idempotent create: the same (userId, idempotencyKey) always returns the
 * first order, so a double-click or a retried request cannot charge twice.
 */
export function createOrder({ userId, idempotencyKey, lines, phone, address, notes }) {
  const existing = store.orders.find(
    (order) => order.userId === userId && order.idempotencyKey === idempotencyKey
  );
  if (existing) return existing;

  const order = {
    id: `ord_${randomUUID()}`,
    userId,
    idempotencyKey,
    lines,
    total: totalOf(lines),
    phone,
    address,
    notes,
    status: "Placed",
    createdAt: new Date().toISOString(),
  };
  store.orders.push(order);
  return order;
}

export function setOrderStatus(orderId, status) {
  const order = store.orders.find((o) => o.id === orderId);
  if (order) order.status = status;
  return order ?? null;
}

// ─── Orders (staff only — callers must check the role first) ────────────────

export function getOrderById(orderId) {
  return store.orders.find((order) => order.id === orderId) ?? null;
}

export function listAllOrders() {
  return [...store.orders].sort(newest).map((order) => ({
    ...order,
    customerName: store.users.find((u) => u.id === order.userId)?.name ?? "Unknown",
  }));
}
