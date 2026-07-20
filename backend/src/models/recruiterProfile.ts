import db from "../db/database.js";
import type { RecruiterProfile } from "../types/user.js";

export class RecruiterProfileModel {
  static getByUserId(userId: string): RecruiterProfile | null {
    const profile = db.prepare(
      "SELECT userId, companyId, position, phone, department FROM recruiter_profile WHERE userId = ?"
    ).get(userId) as RecruiterProfile | undefined;

    return profile || null;
  }

  static upsert(userId: string, fields: Partial<RecruiterProfile>): boolean {
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
        `UPDATE recruiter_profile SET ${setClauses.join(", ")} WHERE userId = ?`
      ).run(...params);

      return result.changes > 0;
    }

    const columns = ["userId", ...Object.keys(fields)];
    const placeholders = columns.map(() => "?").join(", ");
    const values = [userId, ...Object.values(fields)];

    db.prepare(
      `INSERT INTO recruiter_profile (${columns.join(", ")}) VALUES (${placeholders})`
    ).run(...values);

    return true;
  }

  static delete(userId: string): boolean {
    const result = db.prepare("DELETE FROM recruiter_profile WHERE userId = ?").run(userId);
    return result.changes > 0;
  }
}
