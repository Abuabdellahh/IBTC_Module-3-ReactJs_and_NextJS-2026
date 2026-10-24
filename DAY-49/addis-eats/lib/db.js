// lib/db.js
// Data-access layer. Every function that reads a customer's data takes the
// userId as an argument, and callers pass session.userId — never an id from
// the URL, a form field or a request body.
//
// Storage: the Vercel Runtime Cache (getCache from @vercel/functions).
// Why not a plain in-memory object: on Vercel, the checkout action, the
// orders API and the kitchen page run as separate functions, each with its
// own memory, so an order written by one was invisible to the others (found
// in the live verification run). The Runtime Cache is shared by every
// function in the region and needs no database to provision. Locally, one
// process-wide object stands in for it (see getStoreCache).
//
// It is still a cache, not a database: entries can be evicted, and the
// read-modify-write below can lose an update under heavy concurrent writes.
// Both are acceptable for a demo and are FUTURE.md #1. Swapping this file for
// a real database changes nothing outside it.

import "server-only";
import { randomUUID } from "node:crypto";
import { getCache } from "@vercel/functions";
import { hashPassword } from "./auth/password.js";

const STORE_KEY = "addis-eats:store:v1";
const STORE_TTL = 60 * 60 * 24 * 30; // 30 days

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

// On Vercel: the shared Runtime Cache. Elsewhere (next dev / next start): one
// object on globalThis. @vercel/functions has its own in-memory fallback, but
// Next bundles it into each route separately, so every route would get its
// own private copy, which is the very bug this file exists to avoid.
function getStoreCache() {
  if (process.env.VERCEL) return getCache();
  const memory = (globalThis.__addisEatsMemory ??= new Map());
  return {
    get: async (key) => (memory.has(key) ? structuredClone(memory.get(key)) : null),
    set: async (key, value) => void memory.set(key, structuredClone(value)),
  };
}

async function load() {
  const cache = getStoreCache();
  let existing = await cache.get(STORE_KEY);
  // The client returns null for a timeout or error as well as for "empty".
  // Ask twice before seeding, so a slow read does not wipe real orders.
  if (!existing) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    existing = await cache.get(STORE_KEY);
  }
  if (existing?.users && existing?.orders) return existing;

  const fresh = seed();
  await cache.set(STORE_KEY, fresh, { ttl: STORE_TTL, tags: ["addis-eats"] });
  return fresh;
}

async function save(store) {
  await getStoreCache().set(STORE_KEY, store, { ttl: STORE_TTL, tags: ["addis-eats"] });
}


// ─── Users ──────────────────────────────────────────────────────────────────

export async function findUserByEmail(email) {
  const store = await load();
  return store.users.find((user) => user.email === email) ?? null;
}

export async function createUser({ name, email, passwordHash }) {
  const store = await load();
  const user = {
    id: `usr_${randomUUID()}`,
    name,
    email,
    role: "customer", // sign-up can never create staff
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  await save(store);
  return user;
}

// ─── Orders (customer-scoped) ───────────────────────────────────────────────

export async function listOrdersForUser(userId) {
  const store = await load();
  return store.orders.filter((order) => order.userId === userId).sort(newest);
}

/** Scoped lookup: returns null both when the order does not exist and when it belongs to someone else. */
export async function getOrderForUser(orderId, userId) {
  const store = await load();
  return store.orders.find((order) => order.id === orderId && order.userId === userId) ?? null;
}

/**
 * Idempotent create: the same (userId, idempotencyKey) always returns the
 * first order, so a double-click or a retried request cannot charge twice.
 */
export async function createOrder({ userId, idempotencyKey, lines, phone, address, notes }) {
  const store = await load();
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
  await save(store);
  return order;
}

export async function setOrderStatus(orderId, status) {
  const store = await load();
  const order = store.orders.find((o) => o.id === orderId);
  if (!order) return null;
  order.status = status;
  await save(store);
  return order;
}

// ─── Orders (staff only — callers must check the role first) ────────────────

export async function getOrderById(orderId) {
  const store = await load();
  return store.orders.find((order) => order.id === orderId) ?? null;
}

export async function listAllOrders() {
  const store = await load();
  return [...store.orders].sort(newest).map((order) => ({
    ...order,
    customerName: store.users.find((u) => u.id === order.userId)?.name ?? "Unknown",
  }));
}
