// Attack 3 — every crafted return link must collapse to a same-origin path.
import { test } from "node:test";
import assert from "node:assert/strict";
import { safeRedirect } from "../lib/auth/redirect.js";

test("keeps same-origin paths, including query and hash", () => {
  assert.equal(safeRedirect("/orders"), "/orders");
  assert.equal(safeRedirect("/orders/ord_1?placed=1#top"), "/orders/ord_1?placed=1#top");
});

for (const attack of [
  "https://example.com",
  "http://example.com/orders",
  "//example.com",
  "/\\example.com",
  "\\\\example.com",
  "javascript:alert(1)",
  "/%0d%0aSet-Cookie:x=1".replace("%0d%0a", "\r\n"),
  "",
  undefined,
  null,
  ["/orders"],
]) {
  test(`rejects ${JSON.stringify(attack)}`, () => {
    assert.equal(safeRedirect(attack), "/");
  });
}

test("uses the fallback that was asked for", () => {
  assert.equal(safeRedirect("https://example.com", "/menu"), "/menu");
});
