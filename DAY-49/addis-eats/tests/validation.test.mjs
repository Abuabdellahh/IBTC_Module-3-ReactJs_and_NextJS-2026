// The server re-prices every order from the catalogue and rejects bad input.
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateCheckout, validateSignUp } from "../lib/validation.js";

function form(fields) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const valid = {
  phone: "0911 234 567",
  address: "Bole, near Edna Mall",
  notes: "",
  idempotencyKey: "3f0c2a8e-1111-2222-3333-444455556666",
  items: JSON.stringify([{ id: "doro-wat", qty: 2, price: 1 }]),
};

test("a price sent by the browser is ignored", () => {
  const { data, errors } = validateCheckout(form(valid));
  assert.equal(errors, undefined);
  assert.deepEqual(data.lines, [{ dishId: "doro-wat", name: "Doro Wat", unitPrice: 450, qty: 2 }]);
  assert.equal(data.phone, "0911234567");
});

test("unknown dishes, silly quantities and empty carts are refused", () => {
  for (const items of ["[]", "not json", '[{"id":"lobster","qty":1}]', '[{"id":"kitfo","qty":0}]', '[{"id":"kitfo","qty":1.5}]', '[{"id":"kitfo","qty":500}]']) {
    assert.ok(validateCheckout(form({ ...valid, items })).errors?.items, items);
  }
});

test("phone and address are required", () => {
  const { errors } = validateCheckout(form({ ...valid, phone: "12345", address: "x" }));
  assert.ok(errors.phone);
  assert.ok(errors.address);
});

test("sign-up needs a name, a real email and 8+ character password", () => {
  const { errors } = validateSignUp(form({ name: "A", email: "nope", password: "short" }));
  assert.deepEqual(Object.keys(errors).sort(), ["email", "name", "password"]);
});
