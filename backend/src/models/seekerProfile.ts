import db from "../db/database.js";
import type { SeekerProfile } from "../types/user.js";

export class SeekerProfileModel {
  static getByUserId(userId: string): SeekerProfile | null {
    const profile = db.prepare(
      "SELECT userId, resumeUrl, linkedin, github, portfolio, expectedSalary, modality, location, experienceYears, coverLetter FROM seeker_profile WHERE userId = ?"
    ).get(userId) as SeekerProfile | undefined;

    return profile || null;
  }

  static upsert(userId: string, fields: Partial<SeekerProfile>): boolean {
    const existing = this.getByUserId(userId);

    if (existing) {
      const setClauses: string[] = [];
      const params: unknown[] = [];

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          setClauses.push(`${key} = ?`);
          params.push(value);
        }
      }

      if (setClauses.length === 0) return false;

      params.push(userId);
      const result = db.prepare(
        `UPDATE seeker_profile SET ${setClauses.join(", ")} WHERE userId = ?`
      ).run(...params);

      return result.changes > 0;
    }

    const columns = ["userId", ...Object.keys(fields)];
    const placeholders = columns.map(() => "?").join(", ");
    const values = [userId, ...Object.values(fields)];

    db.prepare(
      `INSERT INTO seeker_profile (${columns.join(", ")}) VALUES (${placeholders})`
    ).run(...values);

    return true;
  }

  static delete(userId: string): boolean {
    const result = db.prepare("DELETE FROM seeker_profile WHERE userId = ?").run(userId);
    return result.changes > 0;
  }
}
