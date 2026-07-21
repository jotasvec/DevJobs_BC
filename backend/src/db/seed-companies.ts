import db from "./database.js";

const companies = [
  {
    name: "Tech Solutions Inc.",
    description: "Leading provider of enterprise software solutions",
    website: "https://techsolutions.example.com",
    logo: "https://logo.clearbit.com/techsolutions.example.com",
    industry: "Software",
    size: "201-500",
    location: "San Francisco, CA",
  },
  {
    name: "Data Driven Co.",
    description: "Analytics and business intelligence platform",
    website: "https://datadriven.example.com",
    logo: "https://logo.clearbit.com/datadriven.example.com",
    industry: "Data Analytics",
    size: "51-200",
    location: "New York, NY",
  },
  {
    name: "Mobile Apps Ltd.",
    description: "Mobile-first product studio building consumer apps",
    website: "https://mobileapps.example.com",
    logo: "https://logo.clearbit.com/mobileapps.example.com",
    industry: "Mobile",
    size: "11-50",
    location: "Austin, TX",
  },
  {
    name: "Cloud Services SA",
    description: "Cloud infrastructure and DevOps consulting",
    website: "https://cloudservices.example.com",
    logo: "https://logo.clearbit.com/cloudservices.example.com",
    industry: "Cloud Infrastructure",
    size: "501-1000",
    location: "Seattle, WA",
  },
  {
    name: "Creative Minds Studio",
    description: "Design agency specializing in UI/UX and branding",
    website: "https://creativeminds.example.com",
    logo: "https://logo.clearbit.com/creativeminds.example.com",
    industry: "Design",
    size: "11-50",
    location: "Los Angeles, CA",
  },
  {
    name: "Secure Data Corp.",
    description: "Cybersecurity solutions for financial institutions",
    website: "https://securedata.example.com",
    logo: "https://logo.clearbit.com/securedata.example.com",
    industry: "Security",
    size: "201-500",
    location: "Washington, DC",
  },
  {
    name: "NextGen Technologies",
    description: "AI and machine learning research lab",
    website: "https://nextgentech.example.com",
    logo: "https://logo.clearbit.com/nextgentech.example.com",
    industry: "AI/ML",
    size: "51-200",
    location: "Boston, MA",
  },
  {
    name: "Bright Web Studio",
    description: "Full-stack web development agency",
    website: "https://brightweb.example.com",
    logo: "https://logo.clearbit.com/brightweb.example.com",
    industry: "Web Development",
    size: "11-50",
    location: "Chicago, IL",
  },
];

function seedCompanies() {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO company (id, name, description, website, logo, industry, size, location, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let created = 0;
  for (const company of companies) {
    const result = insert.run(
      crypto.randomUUID(),
      company.name,
      company.description,
      company.website,
      company.logo,
      company.industry,
      company.size,
      company.location,
      new Date().toISOString()
    );
    if (result.changes > 0) created++;
  }

  console.log(`✅ Seeded ${created} companies (${companies.length - created} already existed)`);
}

seedCompanies();
