import db from "./database.js";

const recruiterProfiles = [
  {
    email: "recruiter@company.com",
    companyName: "Tech Solutions Inc.",
    position: "Engineering Manager",
    phone: "+1-555-0101",
    department: "Engineering",
  },
  {
    email: "recruiter@test.dev",
    companyName: "Data Driven Co.",
    position: "Technical Recruiter",
    phone: "+1-555-0102",
    department: "People & Culture",
  },
];

function seedRecruiterProfiles() {
  const getUser = db.prepare("SELECT id FROM user WHERE email = ?");
  const getCompany = db.prepare("SELECT id FROM company WHERE name = ?");
  const upsert = db.prepare(`
    INSERT OR REPLACE INTO recruiter_profile (userId, companyId, position, phone, department)
    VALUES (?, ?, ?, ?, ?)
  `);

  let created = 0;
  for (const profile of recruiterProfiles) {
    const user = getUser.get(profile.email) as { id: string } | undefined;
    if (!user) {
      console.log(`⚠️  User ${profile.email} not found — skipping profile`);
      continue;
    }

    const company = getCompany.get(profile.companyName) as { id: string } | undefined;
    const companyId = company?.id || null;

    upsert.run(
      user.id,
      companyId,
      profile.position,
      profile.phone,
      profile.department
    );
    created++;
  }

  console.log(`✅ Seeded ${created} recruiter profiles`);
}

seedRecruiterProfiles();
