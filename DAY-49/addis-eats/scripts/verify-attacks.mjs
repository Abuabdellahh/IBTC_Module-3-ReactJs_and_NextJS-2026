#!/usr/bin/env node
// scripts/verify-attacks.mjs — the security battery from Day 49, as a script.
//
//   npm run build                                   # once, so the action ids are known
//   BASE_URL=https://your-app.vercel.app npm run verify:attacks
//
// Optional: SESSION_SECRET=<the deployed secret> also runs the "signed in as
// someone else" checks by minting Abebe's session locally. The secret never
// leaves your machine — it is only used to sign a cookie.
//
// Every check prints PASS (the attack was refused) or FAIL (it was not).

import { readFileSync, existsSync } from "node:fs";
import { signToken } from "../lib/auth/token.js";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const SECRET = process.env.SESSION_SECRET;
const COOKIE = "ae_session";
const SARA_ORDER = "ord_sara_demo"; // seeded order owned by sara@example.com
const ABEBE_ORDER = "ord_abebe_demo"; // seeded order owned by abebe@example.com

let failures = 0;
const report = (ok, label, detail = "") => {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
};
const skip = (label, why) => console.log(`SKIP  ${label}  (${why})`);

const get = (path, cookie) =>
  fetch(`${BASE}${path}`, { redirect: "manual", headers: cookie ? { cookie: `${COOKIE}=${cookie}` } : {} });

// Calls a Server Action exactly the way the browser does — no page, no UI.
// Next.js serves each action from the routes that use it, so it is posted to
// that route. Signed out, proxy.js (layer 1) answers first with a redirect;
// signed in, the request reaches the action and its own checks answer.
const ACTION_ROUTE = { cancelOrder: `/orders/${SARA_ORDER}`, advanceOrder: "/kitchen" };
// Action ids differ between builds (a local build and Vercel's build do not
// match), so they are read from the target's own client JavaScript, where
// each reference is emitted as createServerReference("<id>", …, "<name>").
// Loading the pages that use the actions needs a session, so this needs
// SESSION_SECRET; without it, a local `npm run build` manifest is used.
async function discoverActionIds() {
  const ids = {};
  if (SECRET) {
    const pages = [
      ["/kitchen", { sub: "usr_kitchen", name: "Kitchen Staff", role: "staff" }],
      [`/orders/${ABEBE_ORDER}`, { sub: "usr_abebe", name: "Abebe Kebede", role: "customer" }],
    ];
    const chunks = new Set();
    for (const [path, claims] of pages) {
      const html = await (await get(path, signToken(claims, SECRET, 300))).text();
      for (const src of html.match(/\/_next\/static\/[^"\\ ]+\.js/g) ?? []) chunks.add(src);
    }
    for (const src of chunks) {
      const js = await (await fetch(`${BASE}${src}`)).text();
      for (const [, id, name] of js.matchAll(/createServerReference\)\("([0-9a-f]{40,})",[^)]*?"(\w+)"\)/g)) ids[name] = id;
    }
    if (Object.keys(ids).length) return ids;
  }
  const file = new URL("../.next/server/server-reference-manifest.json", import.meta.url);
  if (!existsSync(file)) return ids;
  const manifest = JSON.parse(readFileSync(file, "utf8"));
  return Object.fromEntries(Object.entries(manifest.node ?? {}).map(([id, v]) => [v.exportedName, id]));
}
const actionIds = await discoverActionIds();

async function callAction(name, args, cookie) {
  const id = actionIds[name];
  if (!id) return null;
  const res = await fetch(`${BASE}${ACTION_ROUTE[name]}`, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Next-Action": id,
      "Content-Type": "text/plain;charset=UTF-8",
      Accept: "text/x-component",
      Origin: BASE,
      ...(cookie ? { cookie: `${COOKIE}=${cookie}` } : {}),
    },
    body: JSON.stringify(args),
  });
  if (res.headers.get("x-nextjs-action-not-found")) return null; // id from another build
  return { status: res.status, location: res.headers.get("location") ?? "", body: await res.text() };
}

console.log(`Target: ${BASE}\n`);

// ─── Attack 1: signed out ────────────────────────────────────────────────────
console.log("Attack 1 — signed out");
for (const path of ["/orders", "/checkout", "/kitchen", `/orders/${SARA_ORDER}`]) {
  const res = await get(path);
  const location = res.headers.get("location") ?? "";
  report(res.status >= 300 && res.status < 400 && location.includes("/signin"), `GET ${path} redirects to sign-in`, `${res.status} → ${location}`);
}
{
  const res = await get(`/api/orders/${SARA_ORDER}`);
  report(res.status === 401, "GET /api/orders/:id refuses with 401", String(res.status));
}
// Refused if proxy redirects to sign-in, or the action itself says no.
const refusedSignedOut = (r) =>
  r.location.includes("/signin") ? "proxy → /signin" : /session has ended/i.test(r.body) ? "action check" : null;
for (const [name, args] of [["cancelOrder", [SARA_ORDER, {}, null]], ["advanceOrder", [SARA_ORDER, "Delivered", {}, null]]]) {
  const result = await callAction(name, args);
  if (!result) skip(`${name}() called directly`, "action id unknown for this build — set SESSION_SECRET, or try it from DevTools");
  else report(Boolean(refusedSignedOut(result)), `${name}() called directly is refused`, `HTTP ${result.status}, ${refusedSignedOut(result) ?? "NOT refused"}`);
}

// ─── Forged cookies ──────────────────────────────────────────────────────────
console.log("\nForged session cookies");
const tampered = `${Buffer.from(JSON.stringify({ sub: "usr_kitchen", name: "x", role: "staff", exp: 9999999999 })).toString("base64url")}.not-a-real-signature`;
for (const [label, cookie] of [["plain user id (old style)", "usr_kitchen"], ["role edited to staff", tampered]]) {
  const res = await get(`/api/orders/${SARA_ORDER}`, cookie);
  report(res.status === 401, `${label} → API refuses`, String(res.status));
  const page = await get("/kitchen", cookie);
  report(page.status >= 300 && page.status < 400, `${label} → /kitchen redirects to sign-in`, String(page.status));
}

// ─── Attack 3: crafted return link ───────────────────────────────────────────
console.log("\nAttack 3 — crafted return link");
for (const next of ["https://example.com", "//example.com", "/\\example.com", "javascript:alert(1)"]) {
  const res = await get(`/signin?next=${encodeURIComponent(next)}`);
  const html = await res.text();
  const value = html.match(/name="next" value="([^"]*)"/)?.[1];
  report(value === "/menu", `?next=${next} is reduced to a local path`, `hidden field = ${value}`);
}

// ─── Attack 2: signed in as someone else ─────────────────────────────────────
console.log("\nAttack 2 — signed in as Abebe, acting on Sara's order");
if (!SECRET) {
  skip("all checks", "set SESSION_SECRET to mint a session for abebe@example.com");
} else {
  const abebe = signToken({ sub: "usr_abebe", name: "Abebe Kebede", role: "customer" }, SECRET, 300);
  const own = await get(`/api/orders/${ABEBE_ORDER}`, abebe);
  report(own.status === 200, "control: Abebe can read his own order", String(own.status));
  const api = await get(`/api/orders/${SARA_ORDER}`, abebe);
  report(api.status === 404, "API returns 404 for Sara's order", String(api.status));
  // The page streams (orders/loading.js), so the not-found UI may arrive with
  // HTTP 200 — what matters is that none of Sara's data is in the response.
  const page = await (await get(`/orders/${SARA_ORDER}`, abebe)).text();
  report(page.includes("could not find") && !page.includes("Piassa") && !page.includes("Beyaynetu"),
    "id changed in the private URL → not-found page, none of Sara's data");
  const kitchen = await (await get("/kitchen", abebe)).text();
  report(kitchen.includes("Kitchen staff only") && !kitchen.includes("Order queue"), "customer opening /kitchen sees a refusal, no data");

  const cancel = await callAction("cancelOrder", [SARA_ORDER, {}, null], abebe);
  if (!cancel) skip("cancelOrder(Sara's id)", "action id unknown for this build");
  else report(/Order not found/.test(cancel.body), "cancelOrder(Sara's id) is refused", `HTTP ${cancel.status}`);
  const advance = await callAction("advanceOrder", [SARA_ORDER, "Delivered", {}, null], abebe);
  if (!advance) skip("advanceOrder() as a customer", "action id unknown for this build");
  else report(/Only kitchen staff/.test(advance.body), "advanceOrder() as a customer is refused", `HTTP ${advance.status}`);
  const after = await get(`/api/orders/${SARA_ORDER}`, signToken({ sub: "usr_kitchen", name: "Kitchen", role: "staff" }, SECRET, 300));
  report((await after.json()).status === "Placed", "Sara's order is still untouched");
}

console.log(`\n${failures === 0 ? "All attacks refused." : `${failures} check(s) FAILED.`}`);
process.exit(failures === 0 ? 0 : 1);
