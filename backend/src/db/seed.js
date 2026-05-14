import { db } from './database.js'
import fs from 'fs'
import path from 'path'

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL, 
        modality TEXT NOT NULL CHECK(modality in ('remote','onsite','hybrid')),
        level TEXT NOT NULL CHECK(level in ('junior','mid','senior')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS job_contents (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        description TEXT,
        responsibilities TEXT,
        requirements TEXT,
        about TEXT,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS job_technologies_old (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        technology TEXT NOT NULL,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS technology_categories (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS technologies (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL REFERENCES technology_categories(name),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS job_technologies (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        technology_id TEXT NOT NULL,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE,
        UNIQUE(job_id, technology_id)
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT CHECK(role IN ('seeker', 'employer', 'admin')) DEFAULT 'seeker',
        avatar TEXT,
        bio TEXT,
        resume TEXT,
        skills TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
        cover_letter TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, job_id)
    )
`)

// Pre-populated technologies
const technologiesData = [
    // Frontend
    { name: "React", category: "Frontend" },
    { name: "Vue.js", category: "Frontend" },
    { name: "Angular", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "Nuxt.js", category: "Frontend" },
    { name: "Svelte", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "Bootstrap", category: "Frontend" },
    { name: "TypeScript", category: "Frontend" },
    { name: "JavaScript", category: "Frontend" },
    { name: "CSS", category: "Frontend" },
    { name: "Redux", category: "Frontend" },
    // Backend
    { name: "Node.js", category: "Backend" },
    { name: "Express", category: "Backend" },
    { name: "Django", category: "Backend" },
    { name: "Flask", category: "Backend" },
    { name: "Spring Boot", category: "Backend" },
    { name: "Ruby on Rails", category: "Backend" },
    { name: "Laravel", category: "Backend" },
    { name: "Go", category: "Backend" },
    { name: "Rust", category: "Backend" },
    { name: "C#", category: "Backend" },
    { name: "Microservices", category: "Backend" },
    { name: "Golang", category: "Backend" },
    { name: "gRPC", category: "Backend" },
    // Database
    { name: "PostgreSQL", category: "Database" },
    { name: "MySQL", category: "Database" },
    { name: "MongoDB", category: "Database" },
    { name: "Redis", category: "Database" },
    { name: "SQLite", category: "Database" },
    { name: "Oracle", category: "Database" },
    { name: "SQL Server", category: "Database" },
    { name: "Elasticsearch", category: "Database" },
    { name: "Firebase", category: "Database" },
    { name: "SQL", category: "Database" },
    { name: "Spark", category: "Database" },
    { name: "Airflow", category: "Database" },
    // DevOps
    { name: "Docker", category: "DevOps" },
    { name: "Kubernetes", category: "DevOps" },
    { name: "AWS", category: "DevOps" },
    { name: "Azure", category: "DevOps" },
    { name: "GCP", category: "DevOps" },
    { name: "Terraform", category: "DevOps" },
    { name: "Ansible", category: "DevOps" },
    { name: "Jenkins", category: "DevOps" },
    { name: "GitLab CI", category: "DevOps" },
    { name: "GitHub Actions", category: "DevOps" },
    { name: "MLOps", category: "DevOps" },
    { name: "Linux", category: "DevOps" },
    { name: "Bash", category: "DevOps" },
    { name: "Monitoring", category: "DevOps" },
    { name: "Prometheus", category: "DevOps" },
    { name: "Grafana", category: "DevOps" },
    // Mobile
    { name: "React Native", category: "Mobile" },
    { name: "Flutter", category: "Mobile" },
    { name: "Swift", category: "Mobile" },
    { name: "Kotlin", category: "Mobile" },
    { name: "Ionic", category: "Mobile" },
    { name: "Expo", category: "Mobile" },
    { name: "SwiftUI", category: "Mobile" },
    { name: "iOS", category: "Mobile" },
    { name: "Android", category: "Mobile" },
    { name: "Jetpack Compose", category: "Mobile" },
    // Testing
    { name: "Jest", category: "Testing" },
    { name: "Cypress", category: "Testing" },
    { name: "Playwright", category: "Testing" },
    { name: "Selenium", category: "Testing" },
    { name: "Mocha", category: "Testing" },
    { name: "Chai", category: "Testing" },
    { name: "Robot Framework", category: "Testing" },
    { name: "Testing", category: "Testing" },
    { name: "Test Case Management", category: "Testing" },
    // Tools
    { name: "Git", category: "Tools" },
    { name: "GitHub", category: "Tools" },
    { name: "GitLab", category: "Tools" },
    { name: "Bitbucket", category: "Tools" },
    { name: "Jira", category: "Tools" },
    { name: "Figma", category: "Tools" },
    { name: "Sketch", category: "Tools" },
    { name: "Postman", category: "Tools" },
    { name: "Swagger", category: "Tools" },
    { name: "Agile", category: "Tools" },
    { name: "Scrum", category: "Tools" },
    { name: "Confluence", category: "Tools" },
    { name: "Kanban", category: "Tools" },
    { name: "Xcode", category: "Tools" },
    { name: "Windows", category: "Tools" },
    { name: "Networking", category: "Tools" },
    { name: "Troubleshooting", category: "Tools" },
    { name: "Analytics", category: "Tools" },
    { name: "Product Strategy", category: "Tools" },
    { name: "Adobe XD", category: "Tools" },
    { name: "Prototyping", category: "Tools" },
    { name: "User Research", category: "Tools" },
    // Languages
    { name: "Python", category: "Languages" },
    { name: "Java", category: "Languages" },
    { name: "Ruby", category: "Languages" },
    { name: "PHP", category: "Languages" },
    { name: "Scala", category: "Languages" },
    { name: "R", category: "Languages" },
    // AI/ML
    { name: "TensorFlow", category: "AI/ML" },
    { name: "PyTorch", category: "AI/ML" },
    { name: "Scikit-learn", category: "AI/ML" },
    { name: "NLP", category: "AI/ML" },
    { name: "Computer Vision", category: "AI/ML" },
    // Security
    { name: "SIEM", category: "Security" },
    { name: "Penetration Testing", category: "Security" },
    { name: "Firewall", category: "Security" },
    { name: "Security Tools", category: "Security" },
    { name: "Kali Linux", category: "Security" },
    // Other
    { name: "Pandas", category: "Data Science" },
    { name: "API", category: "Tools" },
    { name: "MVVM", category: "Architecture" },
    { name: "Markdown", category: "Tools" },
    { name: "API Documentation", category: "Tools" },
    { name: "Technical Writing", category: "Tools" },
    { name: "Solidity", category: "Blockchain" },
    { name: "Ethereum", category: "Blockchain" },
    { name: "Web3", category: "Blockchain" },
    { name: "Blockchain", category: "Tools" },
    { name: "Power BI", category: "Tools" },
    { name: "Tableau", category: "Tools" },
    { name: "Excel", category: "Tools" },
    { name: "DAX", category: "Tools" },
    { name: "Office 365", category: "Tools" },
    { name: "Active Directory", category: "DevOps" },
    { name: "Safe", category: "Tools" },
    { name: "Coaching", category: "Tools" },
    { name: "User Research", category: "Tools" },
    { name: "Test Case Management", category: "Testing" },
    { name: "Jetpack Compose", category: "Mobile" },
    // Add variations for data.json matching
    { name: "node", category: "Backend" },
    { name: "react-native", category: "Mobile" },
    { name: "adobe-xd", category: "Tools" },
    { name: "product-strategy", category: "Tools" },
    { name: "tailwincss", category: "Frontend" },
    { name: "sql-server", category: "Database" },
    { name: "kali-linux", category: "Security" },
    { name: "computer-vision", category: "AI/ML" },
]

// Insert technologies
const insertTechnology = db.prepare(`
    INSERT OR IGNORE INTO technologies (id, name, category)
    VALUES (?, ?, ?)
`)

const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO technology_categories (id, name, description)
    VALUES (?, ?, ?)
`)

const categories = [
    { name: "Frontend", description: "Frontend frameworks and libraries" },
    { name: "Backend", description: "Backend frameworks and runtimes" },
    { name: "Database", description: "Database management systems" },
    { name: "DevOps", description: "DevOps tools and cloud platforms" },
    { name: "Mobile", description: "Mobile development frameworks" },
    { name: "Testing", description: "Testing frameworks and tools" },
    { name: "Tools", description: "Development tools and design software" },
    { name: "Languages", description: "Programming languages" },
]

// Seed categories
for (const cat of categories) {
    insertCategory.run(crypto.randomUUID(), cat.name, cat.description)
}

// Seed technologies
const technologyMap = {}
for (const tech of technologiesData) {
    const id = crypto.randomUUID()
    insertTechnology.run(id, tech.name, tech.category)
    technologyMap[tech.name.toLowerCase()] = id
}

console.log(`Seeded ${technologiesData.length} technologies`)

// Job data seeding from data.json
const dataPath = path.join(process.cwd(), 'data.json')
const jobsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

const insertJob = db.prepare(`
    INSERT OR REPLACE INTO jobs (id, title, company, location, description, modality, level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertJobContent = db.prepare(`
    INSERT INTO job_contents (id, job_id, description, responsibilities, requirements, about)
    VALUES (?, ?, ?, ?, ?, ?)
`)

const insertJobTechnology = db.prepare(`
    INSERT INTO job_technologies (id, job_id, technology_id)
    VALUES (?, ?, ?)
`)

const getTechnologyId = (techName) => {
    const normalized = techName.toLowerCase().trim()
    return technologyMap[normalized] || null
}

const normalizeModality = (modalidad) => {
    if (modalidad === 'remoto') return 'remote'
    return 'onsite'
}

const normalizeLevel = (nivel) => {
    if (nivel === 'mid-level' || nivel === 'mid') return 'mid'
    if (nivel === 'junior') return 'junior'
    if (nivel === 'senior') return 'senior'
    return 'mid'
}

const insertAll = db.transaction(() => {
    for (const job of jobsData) {
        insertJob.run(
            job.id,
            job.titulo,
            job.empresa,
            job.ubicacion,
            job.descripcion,
            normalizeModality(job.data.modalidad),
            normalizeLevel(job.data.nivel)
        )

        if (job.content) {
            insertJobContent.run(
                crypto.randomUUID(),
                job.id,
                job.content.description || null,
                job.content.responsibilities || null,
                job.content.requirements || null,
                job.content.about || null
            )
        }

        if (job.data.technology && Array.isArray(job.data.technology)) {
            for (const tech of job.data.technology) {
                const techId = getTechnologyId(tech)
                if (techId) {
                    insertJobTechnology.run(
                        crypto.randomUUID(),
                        job.id,
                        techId
                    )
                } else {
                    console.log(`Technology not found: ${tech}`)
                }
            }
        }
    }
})

insertAll()
console.log('Jobs seeded successfully!')

// Add indexes for performance
db.exec(`CREATE INDEX IF NOT EXISTS idx_technologies_category ON technologies(category)`)
db.exec(`CREATE INDEX IF NOT EXISTS idx_job_technologies_job ON job_technologies(job_id)`)
db.exec(`CREATE INDEX IF NOT EXISTS idx_job_technologies_tech ON job_technologies(technology_id)`)

console.log('Indexes created successfully!')

