import Database from "better-sqlite3";

const db = new Database('jobs.db')

db.pragma('journal_mode = WAL') // improve rendering on concurrence
db.pragma('foreign_keys = ON') // enable foreign keys

export { db }