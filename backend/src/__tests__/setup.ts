import { before, after } from "node:test";
import type { Server } from "node:http";
import type { Express } from "express";

let server: Server;
let app: Express;

export const PORT = 3456;
export const BASE_URL = `http://localhost:${PORT}`;
export let adminCookie = "";
export let recruiterCookie = "";
export let seekerCookie = "";

before(async () => {
  process.env.PORT = String(PORT);
  process.env.BETTER_AUTH_URL = BASE_URL;
  process.env.NODE_ENV = "test";

  // Purge test users from previous runs so sign-up always succeeds
  const { default: db } = await import("../db/database.js");
  for (const email of ["admin@test.dev", "recruiter@test.dev", "seeker@test.dev"]) {
    const user = db.prepare("SELECT id FROM user WHERE email = ?").get(email) as { id: string } | undefined;
    if (user) {
      db.prepare("DELETE FROM session WHERE userId = ?").run(user.id);
      db.prepare("DELETE FROM account WHERE userId = ?").run(user.id);
    }
    db.prepare("DELETE FROM user WHERE email = ?").run(email);
  }

  const { default: loadedApp } = await import("../app.js");
  app = loadedApp;

  await new Promise<void>((resolve, reject) => {
    server = app.listen(PORT, () => {
      console.log(`✅ Test server on ${BASE_URL}`);
      resolve();
    });
    server.on("error", reject);
  });

  // Create test users and capture session cookies
  const users = [
    { name: "Admin Test", email: "admin@test.dev", password: "admin1234", role: "admin" },
    { name: "Recruiter Test", email: "recruiter@test.dev", password: "recruit1", role: "recruiter" },
    { name: "Seeker Test", email: "seeker@test.dev", password: "password123", role: "seeker" },
  ];

  for (const user of users) {
    const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: user.name, email: user.email, password: user.password, role: user.role }),
    });

    if (res.ok) {
      const cookie = res.headers.get("set-cookie") || "";
      const role = user.role;
      if (role === "admin") adminCookie = cookie;
      else if (role === "recruiter") recruiterCookie = cookie;
      else seekerCookie = cookie;

      db.prepare("UPDATE user SET role = ?, name = ? WHERE email = ?").run(role, user.name, user.email);
    } else {
      // Fallback: try sign-in instead
      const signin = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });
      if (signin.ok) {
        const cookie = signin.headers.get("set-cookie") || "";
        const role = user.role;
        if (role === "admin") adminCookie = cookie;
        else if (role === "recruiter") recruiterCookie = cookie;
        else seekerCookie = cookie;
      } else {
        const body = await res.json().catch(() => ({}));
        throw new Error(`Cannot create or sign-in test user ${user.email}: ${body.error || res.statusText}`);
      }
    }
  }
});

after(async () => {
  if (!server) return;
  if (typeof server.closeAllConnections === "function") {
    server.closeAllConnections();
  }
  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      console.log("🛑 Test server closed");
      resolve();
    });
  });
});

export function authHeaders(cookie: string): Record<string, string> {
  return cookie ? { Cookie: cookie } : {};
}
