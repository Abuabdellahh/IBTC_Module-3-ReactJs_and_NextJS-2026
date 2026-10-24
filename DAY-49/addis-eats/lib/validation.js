// lib/validation.js
// Server-side validation for every form. Client-side `required` attributes
// are a convenience; these functions are the rule.
// Each returns { data } on success or { errors: { field: message } }.

import { getDish } from "./menu.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Ethiopian mobile numbers: 09XXXXXXXX, 07XXXXXXXX or +2519/+2517XXXXXXXX
const ET_PHONE = /^(?:\+251|0)[79]\d{8}$/;

export const MAX_LINES = 20;
export const MAX_QTY = 20;

const text = (formData, key) => String(formData.get(key) ?? "").trim();

export function validateSignIn(formData) {
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const errors = {};
  if (!EMAIL.test(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter your password.";
  return Object.keys(errors).length ? { errors } : { data: { email, password } };
}

export function validateSignUp(formData) {
  const name = text(formData, "name");
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const errors = {};
  if (name.length < 2 || name.length > 60) errors.name = "Enter your name (2–60 characters).";
  if (!EMAIL.test(email) || email.length > 254) errors.email = "Enter a valid email address.";
  if (password.length < 8 || password.length > 128) {
    errors.password = "Use at least 8 characters.";
  }
  return Object.keys(errors).length ? { errors } : { data: { name, email, password } };
}

/**
 * Validates checkout. The browser sends only dish ids and quantities —
 * names and prices come from the catalogue, so a tampered price is ignored.
 */
export function validateCheckout(formData) {
  const phone = text(formData, "phone").replace(/[\s-]/g, "");
  const address = text(formData, "address");
  const notes = text(formData, "notes");
  const idempotencyKey = text(formData, "idempotencyKey");
  const errors = {};

  if (!ET_PHONE.test(phone)) errors.phone = "Enter an Ethiopian mobile number, e.g. 0911 234 567.";
  if (address.length < 5 || address.length > 200) {
    errors.address = "Enter a delivery address (5–200 characters).";
  }
  if (notes.length > 200) errors.notes = "Keep notes under 200 characters.";
  if (!/^[\w-]{8,64}$/.test(idempotencyKey)) errors.form = "Please reload the page and try again.";

  let rawItems;
  try {
    rawItems = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    rawItems = null;
  }

  const lines = [];
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    errors.items = "Your cart is empty.";
  } else if (rawItems.length > MAX_LINES) {
    errors.items = `An order can contain at most ${MAX_LINES} different dishes.`;
  } else {
    for (const raw of rawItems) {
      const dish = getDish(raw?.id);
      const qty = Number(raw?.qty);
      if (!dish || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
        errors.items = "Something in your cart is no longer available. Please review it.";
        break;
      }
      lines.push({ dishId: dish.id, name: dish.name, unitPrice: dish.price, qty });
    }
  }

  if (Object.keys(errors).length) return { errors };
  return { data: { phone, address, notes, idempotencyKey, lines } };
}
