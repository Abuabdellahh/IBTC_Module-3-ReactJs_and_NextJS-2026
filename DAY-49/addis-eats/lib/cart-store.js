// lib/cart-store.js
// Imported only by Client Components (it touches window).
// The cart lives in the browser (localStorage) — it is the visitor's private
// scratchpad until they check out, and the server never needs it before then.
//
// It is an external store read with useSyncExternalStore rather than
// useState + useEffect: React gets a consistent snapshot, the server render
// uses a fixed "not loaded yet" snapshot (no hydration mismatch), and other
// tabs stay in sync through the `storage` event.

import { useSyncExternalStore } from "react";
import { MAX_QTY, MAX_LINES } from "./validation.js";

const KEY = "addis-eats:cart:v1";
const SERVER_SNAPSHOT = Object.freeze({ items: [], hydrated: false });

const listeners = new Set();
let cachedRaw;
let cachedSnapshot = { items: [], hydrated: true };

function read() {
  let raw = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    // Storage blocked (private mode, disabled cookies) — fall back to an empty cart.
  }
  if (raw === cachedRaw) return cachedSnapshot;

  cachedRaw = raw;
  let items = [];
  try {
    const parsed = JSON.parse(raw ?? "[]");
    if (Array.isArray(parsed)) {
      items = parsed.filter((line) => typeof line?.id === "string" && Number.isInteger(line?.qty));
    }
  } catch {
    items = [];
  }
  cachedSnapshot = { items, hydrated: true };
  return cachedSnapshot;
}

function write(items) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Ignore — the in-memory snapshot below still updates this tab.
  }
  cachedRaw = undefined;
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  const onStorage = (event) => event.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  return useSyncExternalStore(subscribe, read, () => SERVER_SNAPSHOT);
}

export function addToCart(id, qty = 1) {
  const items = read().items;
  const existing = items.find((line) => line.id === id);
  if (existing) {
    write(items.map((line) => (line.id === id ? { ...line, qty: Math.min(MAX_QTY, line.qty + qty) } : line)));
  } else if (items.length < MAX_LINES) {
    write([...items, { id, qty }]);
  }
}

export function setQuantity(id, qty) {
  const items = read().items;
  if (qty <= 0) write(items.filter((line) => line.id !== id));
  else write(items.map((line) => (line.id === id ? { ...line, qty: Math.min(MAX_QTY, qty) } : line)));
}

export function clearCart() {
  write([]);
}
