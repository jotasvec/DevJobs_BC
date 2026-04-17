import Database from "better-sqlite3";

const db = new Database("jobs.db")

db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT,
        modality TEXT,
        technology TEXT -- Guardaremos un JSON string o string separado por comas
    );
`)

//Insert data with prepared statement 
const insert = db.prepare(
    'INSERT INTO jobs (id, title, company, modality, technology) VALUES (?,?,?,?,?)'
)

insert.run('101', 'Frontend Developer', 'TechCorp1', 'remote','Reactjs' )
insert.run('102', 'Frontend Developer', 'TechCorp2', 'hybrid','express' )



// request all 
const allJobs = db.prepare('SELECT * FROM jobs').all()
console.log('all listed Jobs:\t', allJobs)

// tech / modality / etc
const techType = db.prepare('SELECT * FROM jobs WHERE technology = ?').all('express')
console.log('techType:\t', techType)

// request by ID
const jobByID = () => db.prepare('SELECT * FROM jobs WHERE id = ?').all('101')

// Update
db.prepare('UPDATE jobs SET modality = ? WHERE id = ?').run('onsite', '101')
jobByID()
console.log('jobByID : ', jobByID())

const result = db.prepare('DELETE FROM jobs WHERE id = ?').run('102')
console.log('Deleted rows', result.changes)

db.close()