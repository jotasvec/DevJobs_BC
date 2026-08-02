import { auth } from "@/lib/auth";
import db from "./database.js";
import fs from 'fs'
import path from 'path'

let isSeeding = false
const loading = async () => {
    let dots = 0;
    while (!isSeeding) {
        dots = (dots + 1) % 4;
        process.stdout.write(`\rSeeding Users ${".".repeat(dots)}`);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    process.stdout.clearLine(0);
}

const users = [
  { email: "jotasvec@gmail.com", password: "admin2026", name: "Admin", lastName: "User", role: "admin" },
  { email: "recruiter@company.com", password: "recruit1", name: "Recruiter", lastName: "User", role: "recruiter" },
  { email: "seeker@test.com", password: "password123", name: "Seeker", lastName: "User", role: "seeker" },
  { email: "recruiter@test.dev", password: "recruit1", name: "Test", lastName: "Recruiter", role: "recruiter" }
]


async function seedUsers() {

    const spinner = loading()

    for(const user of users){
        try {
            
            const result = await auth.api.signUpEmail({
                body: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role
                },
            });
            
            db.prepare('UPDATE user SET role = ? WHERE email = ?').run(user.role, user.email)
            console.log(`✅ Created ${user.role}: ${user.email}`)

        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            if (message.includes("already exists")) {
                console.log(`⚠️  ${user.email} already exists — updating role`);
                db.prepare("UPDATE user SET role = ?, name = ? WHERE email = ?").run(user.role, user.name, user.email);
            } else {
                console.error(`❌ Failed to create ${user.email}:`, message);
            }
            
        }

    }
    isSeeding = true
    await spinner;
    console.log('Users seeded successfully!')
}

seedUsers()