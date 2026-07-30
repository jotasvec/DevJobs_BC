import db from "../db/database.js";
import type { UserRow } from "../schemas/users.js";

export class UserModel {
  static getAll(): UserRow[] {
    const users = db.prepare(
      "SELECT id, email, name, lastName, role, bio, emailVerified, image, createdAt, updatedAt, phone FROM user ORDER BY createdAt DESC"
    ).all() as UserRow[];

    return users;
  }

  static getById(id: string): UserRow | null {
    const user = db.prepare(
      "SELECT id, email, name, lastName, role, bio, emailVerified, image, createdAt, updatedAt, phone FROM user WHERE id = ?"
    ).get(id) as UserRow | undefined;

    return user || null;
  }

  static update(id: string, fields: Partial<Pick<UserRow, "name" | "lastName" | "role" | "bio" | "image" | "phone" >>): boolean {
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
      `UPDATE user SET ${setClauses.join(", ")} WHERE id = ?`
    ).run(...params);

    return result.changes > 0;
  }

  static delete(id: string): boolean {
    const result = db.prepare("DELETE FROM user WHERE id = ?").run(id);
    return result.changes > 0;
  }
}
