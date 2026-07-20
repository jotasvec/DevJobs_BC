import crypto from "node:crypto";
import db from "../db/database.js";
import type { Company } from "../types/user.js";

export class CompanyModel {
  static getAll(): Company[] {
    return db.prepare(
      "SELECT id, name, description, website, logo, industry, size, location, createdAt FROM company ORDER BY createdAt DESC"
    ).all() as Company[];
  }

  static getById(id: string): Company | null {
    const company = db.prepare(
      "SELECT id, name, description, website, logo, industry, size, location, createdAt FROM company WHERE id = ?"
    ).get(id) as Company | undefined;

    return company || null;
  }

  static getByName(name: string): Company | null {
    const company = db.prepare(
      "SELECT id, name, description, website, logo, industry, size, location, createdAt FROM company WHERE name = ?"
    ).get(name) as Company | undefined;

    return company || null;
  }

  static create(fields: { name: string; description?: string; website?: string; logo?: string; industry?: string; size?: string; location?: string }): Company {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.prepare(
      `INSERT INTO company (id, name, description, website, logo, industry, size, location, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      fields.name,
      fields.description || null,
      fields.website || null,
      fields.logo || null,
      fields.industry || null,
      fields.size || null,
      fields.location || null,
      createdAt
    );

    return this.getById(id)!;
  }

  static update(id: string, fields: Partial<{ name: string; description: string; website: string; logo: string; industry: string; size: string; location: string }>): boolean {
    const setClauses: string[] = [];
    const params: unknown[] = [];

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        setClauses.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (setClauses.length === 0) return false;

    params.push(id);
    const result = db.prepare(
      `UPDATE company SET ${setClauses.join(", ")} WHERE id = ?`
    ).run(...params);

    return result.changes > 0;
  }

  static delete(id: string): boolean {
    const result = db.prepare("DELETE FROM company WHERE id = ?").run(id);
    return result.changes > 0;
  }
}
