import { test, describe } from "node:test";
import assert from "node:assert";
import { BASE_URL, authHeaders, adminCookie, recruiterCookie, seekerCookie } from "./setup.js";

// API routes are mounted under /api (see app.ts: app.use("/api", api))
const API = `${BASE_URL}/api`;

// ──────────────────────────────────────────────
// Public endpoints
// ──────────────────────────────────────────────

describe("GET /api/jobs", () => {
  test("returns 200 with paginated response", async () => {
    const res = await fetch(`${API}/jobs`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(typeof body.data.total === "number");
    assert.ok(Array.isArray(body.data.data));
  });

  test("filters by technology", async () => {
    const res = await fetch(`${API}/jobs?technology=React`);
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
    const res = await fetch(`${API}/jobs?modality=remote`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    for (const job of body.data.data) {
      assert.strictEqual(job.data.modality, "remote");
    }
  });
});

describe("GET /api/jobs/:id", () => {
  test("returns 200 for existing job", async () => {
    // First get a valid ID
    const list = await (await fetch(`${API}/jobs`)).json();
    const id = list.data.data[0]?.id;
    if (!id) return; // skip if no jobs

    const res = await fetch(`${API}/jobs/${id}`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.id, id);
  });

  test("returns 404 for non-existent job", async () => {
    const res = await fetch(`${API}/jobs/00000000-0000-0000-0000-000000000000`);
    assert.strictEqual(res.status, 404);
  });
});

describe("GET /api/technologies", () => {
  test("returns 200 with technologies array", async () => {
    const res = await fetch(`${API}/technologies`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.total > 0);
    assert.ok(Array.isArray(body.data.data));
  });

  test("returns grouped technologies", async () => {
    const res = await fetch(`${API}/technologies/grouped`);
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
    const res = await fetch(`${API}/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Fresh", lastName: "User", email, password: "fresh1234", role: "seeker" }),
    });
    assert.strictEqual(res.status, 200);
  });

  test("sign-in returns session cookie", async () => {
    const res = await fetch(`${API}/auth/sign-in/email`, {
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

describe("POST /api/jobs (auth required)", () => {
  // Build a valid job payload with a real companyId
  async function buildJobPayload() {
    const companies = await (await fetch(`${API}/companies`)).json();
    const companyId = companies.data[0]?.id;
    return {
      title: "Test Job from API Test",
      companyId,
      location: "Test City",
      description: "A test job",
      data: { modality: "remote", level: "junior", technology: ["React"] },
      content: { description: "Testing", responsibilities: "Test", requirements: "Test", about: "Test" },
    };
  }

  test("returns 401 without auth", async () => {
    const newJob = await buildJobPayload();
    const res = await fetch(`${API}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });
    assert.strictEqual(res.status, 401);
  });

  test("returns 403 for seeker", async () => {
    const newJob = await buildJobPayload();
    const res = await fetch(`${API}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(seekerCookie) },
      body: JSON.stringify(newJob),
    });
    assert.strictEqual(res.status, 403);
  });

  test("returns 201 for recruiter", async () => {
    const newJob = await buildJobPayload();
    const res = await fetch(`${API}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(recruiterCookie) },
      body: JSON.stringify(newJob),
    });
    assert.strictEqual(res.status, 201);
  });

  test("returns 201 for admin", async () => {
    const newJob = await buildJobPayload();
    const res = await fetch(`${API}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(adminCookie) },
      body: JSON.stringify(newJob),
    });
    assert.strictEqual(res.status, 201);
  });
});

describe("DELETE /api/jobs/:id (auth required)", () => {
  // Note: DELETE is now allowed for both admin and recruiter (route: requireRoles(ADMIN, RECRUITER))
  test("returns 200 for recruiter", async () => {
    // Create a job first so we have something to delete
    const companies = await (await fetch(`${API}/companies`)).json();
    const createRes = await fetch(`${API}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(recruiterCookie) },
      body: JSON.stringify({
        title: "Temp Job for Delete Test",
        companyId: companies.data[0]?.id,
        location: "Test",
        description: "Test job for delete",
      }),
    });
    if (createRes.status !== 201) return;
    const created = await createRes.json();
    const id = created.data?.id;
    if (!id) return;

    const res = await fetch(`${API}/jobs/${id}`, {
      method: "DELETE",
      headers: authHeaders(recruiterCookie),
    });
    assert.strictEqual(res.status, 200);
  });

  test("returns 403 for seeker", async () => {
    const list = await (await fetch(`${API}/jobs`)).json();
    const id = list.data.data[0]?.id;
    if (!id) return;

    const res = await fetch(`${API}/jobs/${id}`, {
      method: "DELETE",
      headers: authHeaders(seekerCookie),
    });
    assert.strictEqual(res.status, 403);
  });
});

describe("GET /api/users (auth required)", () => {
  test("returns 401 without auth", async () => {
    const res = await fetch(`${API}/users`);
    assert.strictEqual(res.status, 401);
  });

  test("returns 200 for admin", async () => {
    const res = await fetch(`${API}/users`, { headers: authHeaders(adminCookie) });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  test("returns limited fields for recruiter", async () => {
    const res = await fetch(`${API}/users`, { headers: authHeaders(recruiterCookie) });
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

describe("POST /api/technologies (admin only)", () => {
  test("returns 401 without auth", async () => {
    const res = await fetch(`${API}/technologies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "TestLang", category: "Backend" }),
    });
    assert.strictEqual(res.status, 401);
  });

  test("returns 403 for recruiter", async () => {
    const res = await fetch(`${API}/technologies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(recruiterCookie) },
      body: JSON.stringify({ name: "TestLang", category: "Backend" }),
    });
    assert.strictEqual(res.status, 403);
  });

  test("returns 403 for seeker", async () => {
    const res = await fetch(`${API}/technologies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(seekerCookie) },
      body: JSON.stringify({ name: "TestLang", category: "Backend" }),
    });
    assert.strictEqual(res.status, 403);
  });
});

// ──────────────────────────────────────────────
// Profile endpoints
// ──────────────────────────────────────────────

describe("GET /api/users/me/seeker-profile", () => {
  // Note: route only has requireSession (no role check) — any authenticated user can hit it
  test("returns 401 without auth", async () => {
    const res = await fetch(`${API}/users/me/seeker-profile`);
    assert.strictEqual(res.status, 401);
  });

  test("returns 200 for seeker", async () => {
    const res = await fetch(`${API}/users/me/seeker-profile`, {
      headers: authHeaders(seekerCookie),
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  test("returns 200 for recruiter (auth only, no role gate)", async () => {
    const res = await fetch(`${API}/users/me/seeker-profile`, {
      headers: authHeaders(recruiterCookie),
    });
    assert.strictEqual(res.status, 200);
  });
});

describe("PUT /api/users/me/seeker-profile", () => {
  test("updates seeker profile", async () => {
    const res = await fetch(`${API}/users/me/seeker-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders(seekerCookie) },
      body: JSON.stringify({
        location: "Madrid, Spain",
        modality: "remote",
        experienceYears: 3,
        linkedin: "https://linkedin.com/in/test",
      }),
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  test("rejects invalid modality", async () => {
    const res = await fetch(`${API}/users/me/seeker-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders(seekerCookie) },
      body: JSON.stringify({ modality: "invalid" }),
    });
    assert.strictEqual(res.status, 400);
  });
});

describe("GET /api/users/me/recruiter-profile", () => {
  // Note: route only has requireSession (no role check) — any authenticated user can hit it
  test("returns 401 without auth", async () => {
    const res = await fetch(`${API}/users/me/recruiter-profile`);
    assert.strictEqual(res.status, 401);
  });

  test("returns 200 for recruiter", async () => {
    const res = await fetch(`${API}/users/me/recruiter-profile`, {
      headers: authHeaders(recruiterCookie),
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  test("returns 200 for seeker (auth only, no role gate)", async () => {
    const res = await fetch(`${API}/users/me/recruiter-profile`, {
      headers: authHeaders(seekerCookie),
    });
    assert.strictEqual(res.status, 200);
  });
});

describe("PUT /api/users/me/recruiter-profile", () => {
  test("updates recruiter profile", async () => {
    const res = await fetch(`${API}/users/me/recruiter-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders(recruiterCookie) },
      body: JSON.stringify({
        position: "Senior Recruiter",
        department: "Engineering",
      }),
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
  });
});

describe("PATCH /api/users/:id (self-update)", () => {
  test("returns 401 without auth", async () => {
    const res = await fetch(`${API}/users/some-id`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated" }),
    });
    assert.strictEqual(res.status, 401);
  });

  test("allows self-update of name", async () => {
    // Get seeker user ID from session
    const sessionRes = await fetch(`${API}/auth/get-session`, {
      headers: authHeaders(seekerCookie),
    });
    const session = await sessionRes.json();
    const userId = session.data?.user?.id;
    if (!userId) return;

    const res = await fetch(`${API}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders(seekerCookie) },
      body: JSON.stringify({ name: "UpdatedSeeker" }),
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  test("prevents role escalation via self-update", async () => {
    const sessionRes = await fetch(`${API}/auth/get-session`, {
      headers: authHeaders(seekerCookie),
    });
    const session = await sessionRes.json();
    const userId = session.data?.user?.id;
    if (!userId) return;

    const res = await fetch(`${API}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders(seekerCookie) },
      body: JSON.stringify({ role: "admin" }),
    });
    // Should succeed but ignore the role change
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.data.role, "seeker");
  });
});

// ──────────────────────────────────────────────
// Companies endpoints
// ──────────────────────────────────────────────

describe("GET /api/companies", () => {
  test("returns 200 publicly", async () => {
    const res = await fetch(`${API}/companies`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  });
});

describe("GET /api/companies/:id", () => {
  test("returns 404 for non-existent company", async () => {
    const res = await fetch(`${API}/companies/00000000-0000-0000-0000-000000000000`);
    assert.strictEqual(res.status, 404);
  });

  test("returns 200 for existing company", async () => {
    const list = await (await fetch(`${API}/companies`)).json();
    const id = list.data[0]?.id;
    if (!id) return;

    const res = await fetch(`${API}/companies/${id}`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.id, id);
  });
});

describe("POST /api/companies", () => {
  test("returns 401 without auth", async () => {
    const res = await fetch(`${API}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "TestCo" }),
    });
    assert.strictEqual(res.status, 401);
  });

  test("returns 201 for recruiter", async () => {
    const res = await fetch(`${API}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(recruiterCookie) },
      body: JSON.stringify({ name: `RecruiterCo-${Date.now()}` }),
    });
    assert.strictEqual(res.status, 201);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.id);
  });

  test("returns 409 for duplicate name", async () => {
    const companyName = `DupCo-${Date.now()}`;
    await fetch(`${API}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(recruiterCookie) },
      body: JSON.stringify({ name: companyName }),
    });

    const res = await fetch(`${API}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(recruiterCookie) },
      body: JSON.stringify({ name: companyName }),
    });
    assert.strictEqual(res.status, 409);
  });
});
