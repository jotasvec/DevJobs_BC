import { test, describe } from "node:test";
import assert from "node:assert";
import { BASE_URL, authHeaders, adminCookie, recruiterCookie, seekerCookie } from "./setup.js";

// ──────────────────────────────────────────────
// Public endpoints
// ──────────────────────────────────────────────

describe("GET /jobs", () => {
  test("returns 200 with paginated response", async () => {
    const res = await fetch(`${BASE_URL}/jobs`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(typeof body.data.total === "number");
    assert.ok(Array.isArray(body.data.data));
  });

  test("filters by technology", async () => {
    const res = await fetch(`${BASE_URL}/jobs?technology=React`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.ok(body.data.data.length > 0);
    for (const job of body.data.data) {
      const hasTech = job.data.technology.some((t: string) =>
        t.toLowerCase().includes("react")
      );
      assert.ok(hasTech, `Job ${job.id} should have React technology`);
    }
  });

  test("filters by modality", async () => {
    const res = await fetch(`${BASE_URL}/jobs?modality=remote`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    for (const job of body.data.data) {
      assert.strictEqual(job.data.modality, "remote");
    }
  });
});

describe("GET /jobs/:id", () => {
  test("returns 200 for existing job", async () => {
    // First get a valid ID
    const list = await (await fetch(`${BASE_URL}/jobs`)).json();
    const id = list.data.data[0]?.id;
    if (!id) return; // skip if no jobs

    const res = await fetch(`${BASE_URL}/jobs/${id}`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.id, id);
  });

  test("returns 404 for non-existent job", async () => {
    const res = await fetch(`${BASE_URL}/jobs/00000000-0000-0000-0000-000000000000`);
    assert.strictEqual(res.status, 404);
  });
});

describe("GET /technologies", () => {
  test("returns 200 with technologies array", async () => {
    const res = await fetch(`${BASE_URL}/technologies`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.total > 0);
    assert.ok(Array.isArray(body.data.data));
  });

  test("returns grouped technologies", async () => {
    const res = await fetch(`${BASE_URL}/technologies/grouped`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(typeof body.data === "object");
  });
});

// ──────────────────────────────────────────────
// Auth endpoints
// ──────────────────────────────────────────────

describe("POST /api/auth", () => {
  test("sign-up creates a new user", async () => {
    const email = `fresh-${Date.now()}@test.dev`;
    const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Fresh", lastName: "User", email, password: "fresh1234", role: "seeker" }),
    });
    assert.strictEqual(res.status, 200);
  });

  test("sign-in returns session cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@test.dev", password: "admin1234" }),
    });
    assert.strictEqual(res.status, 200);

    const cookie = res.headers.get("set-cookie");
    assert.ok(cookie, "Should return a session cookie");
  });
});

// ──────────────────────────────────────────────
// Protected endpoints — authentication required
// ──────────────────────────────────────────────

describe("POST /jobs (auth required)", () => {
  const newJob = {
    title: "Test Job from API Test",
    company: "TestCo",
    location: "Test City",
    description: "A test job",
    data: { modality: "remote", level: "junior", technology: ["React"] },
    content: { description: "Testing", responsibilities: "Test", requirements: "Test", about: "Test" },
  };

  test("returns 401 without auth", async () => {
    const res = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });
    assert.strictEqual(res.status, 401);
  });

  test("returns 403 for seeker", async () => {
    const res = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(seekerCookie) },
      body: JSON.stringify(newJob),
    });
    assert.strictEqual(res.status, 403);
  });

  test("returns 201 for recruiter", async () => {
    const res = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(recruiterCookie) },
      body: JSON.stringify(newJob),
    });
    assert.strictEqual(res.status, 201);
  });

  test("returns 201 for admin", async () => {
    const res = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(adminCookie) },
      body: JSON.stringify(newJob),
    });
    assert.strictEqual(res.status, 201);
  });
});

describe("DELETE /jobs/:id (auth required)", () => {
  test("returns 403 for recruiter", async () => {
    const list = await (await fetch(`${BASE_URL}/jobs`)).json();
    const id = list.data.data[0]?.id;
    if (!id) return;

    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: authHeaders(recruiterCookie),
    });
    assert.strictEqual(res.status, 403);
  });

  test("returns 403 for seeker", async () => {
    const list = await (await fetch(`${BASE_URL}/jobs`)).json();
    const id = list.data.data[0]?.id;
    if (!id) return;

    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: authHeaders(seekerCookie),
    });
    assert.strictEqual(res.status, 403);
  });
});

describe("GET /users (auth required)", () => {
  test("returns 401 without auth", async () => {
    const res = await fetch(`${BASE_URL}/users`);
    assert.strictEqual(res.status, 401);
  });

  test("returns 200 for admin", async () => {
    const res = await fetch(`${BASE_URL}/users`, { headers: authHeaders(adminCookie) });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  test("returns limited fields for recruiter", async () => {
    const res = await fetch(`${BASE_URL}/users`, { headers: authHeaders(recruiterCookie) });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.ok(Array.isArray(body.data));
    // Recruiter should only see public fields
    if (body.data.length > 0) {
      const first = body.data[0];
      assert.ok(first.email);
      assert.ok(first.name);
      assert.ok(first.lastName);
      assert.ok(first.role);
      // Should NOT contain sensitive fields
      assert.strictEqual(first.id, undefined);
      assert.strictEqual(first.createdAt, undefined);
      assert.strictEqual(first.updatedAt, undefined);
    }
  });
});

describe("POST /technologies (admin only)", () => {
  test("returns 401 without auth", async () => {
    const res = await fetch(`${BASE_URL}/technologies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "TestLang", category: "Backend" }),
    });
    assert.strictEqual(res.status, 401);
  });

  test("returns 403 for recruiter", async () => {
    const res = await fetch(`${BASE_URL}/technologies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(recruiterCookie) },
      body: JSON.stringify({ name: "TestLang", category: "Backend" }),
    });
    assert.strictEqual(res.status, 403);
  });

  test("returns 403 for seeker", async () => {
    const res = await fetch(`${BASE_URL}/technologies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(seekerCookie) },
      body: JSON.stringify({ name: "TestLang", category: "Backend" }),
    });
    assert.strictEqual(res.status, 403);
  });
});
