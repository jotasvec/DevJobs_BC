import { db } from './database.js'
import fs from 'fs'
import path from 'path'

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
    CREATE TABLE IF NOT EXISTS job_technologies (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        technology TEXT NOT NULL,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
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
    INSERT INTO job_technologies (id, job_id, technology)
    VALUES (?, ?, ?)
`)

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
                insertJobTechnology.run(
                    crypto.randomUUID(),
                    job.id,
                    tech
                )
            }
        }
    }
})

insertAll()
console.log('Jobs seeded successfully!')

