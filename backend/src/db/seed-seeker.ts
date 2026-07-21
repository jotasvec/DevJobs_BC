import db from "./database.js";

const seekerProfiles = [
  {
    email: "seeker@test.com",
    resumeUrl: "https://drive.google.com/file/d/seeker-resume",
    linkedin: "https://linkedin.com/in/seeker-user",
    github: "https://github.com/seeker-user",
    portfolio: "https://seeker-user.dev",
    expectedSalary: 85000,
    modality: "remote",
    location: "Madrid, Spain",
    experienceYears: 3,
  },
  {
    email: "seeker@test.dev",
    resumeUrl: null,
    linkedin: "https://linkedin.com/in/seeker-test",
    github: "https://github.com/seeker-test",
    portfolio: null,
    expectedSalary: 70000,
    modality: "hybrid",
    location: "Barcelona, Spain",
    experienceYears: 1,
  },
];

function seedSeekerProfiles() {
  const getUser = db.prepare("SELECT id FROM user WHERE email = ?");
  const upsert = db.prepare(`
    INSERT OR REPLACE INTO seeker_profile (userId, resumeUrl, linkedin, github, portfolio, expectedSalary, modality, location, experienceYears)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let created = 0;
  for (const profile of seekerProfiles) {
    const user = getUser.get(profile.email) as { id: string } | undefined;
    if (!user) {
      console.log(`⚠️  User ${profile.email} not found — skipping profile`);
      continue;
    }

    upsert.run(
      user.id,
      profile.resumeUrl,
      profile.linkedin,
      profile.github,
      profile.portfolio,
      profile.expectedSalary,
      profile.modality,
      profile.location,
      profile.experienceYears
    );
    created++;
  }

  console.log(`✅ Seeded ${created} seeker profiles`);
}

seedSeekerProfiles();
