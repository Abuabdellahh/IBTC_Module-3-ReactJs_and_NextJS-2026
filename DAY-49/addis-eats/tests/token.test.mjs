// Forged, tampered and expired session cookies must all be rejected.
import { test } from "node:test";
import assert from "node:assert/strict";
import { signToken, verifyToken } from "../lib/auth/token.js";

const SECRET = "test-secret-that-is-at-least-32-characters";
const claims = { sub: "usr_abebe", name: "Abebe", role: "customer" };

test("a token the server signed is accepted", () => {
  const token = signToken(claims, SECRET, 60);
  assert.deepEqual({ ...verifyToken(token, SECRET), exp: undefined }, { ...claims, exp: undefined });
});

test("changing the role in the payload breaks the signature", () => {
  const [, signature] = signToken(claims, SECRET, 60).split(".");
  const forged = Buffer.from(JSON.stringify({ ...claims, role: "staff", exp: 9999999999 })).toString("base64url");
  assert.equal(verifyToken(`${forged}.${signature}`, SECRET), null);
});

test("a token signed with another secret is rejected", () => {
  assert.equal(verifyToken(signToken(claims, "another-secret-another-secret-0000", 60), SECRET), null);
});

test("an expired token is rejected", () => {
  const token = signToken(claims, SECRET, 60, Date.now() - 120_000);
  assert.equal(verifyToken(token, SECRET), null);
});

test("the old-style plain user-id cookie is rejected", () => {
  assert.equal(verifyToken("usr_kitchen", SECRET), null);
  assert.equal(verifyToken(undefined, SECRET), null);
  assert.equal(verifyToken("a.b.c", SECRET), null);
});
